package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.dao.Connection;
import simplessh.com.services.RunCommand;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;

/**
 * @author Corneli F.
 *
 * Email controller when go to menu emails it will process this api
 */
@RestController
@RequestMapping("/api/v1/")
public class EmailsController {
    @Autowired
    private RunCommand ssh;

    /**
     * get list of emails
     * @param id
     * @return
     */
   @GetMapping("/get-list-of-emails")
    public List<Map<String,String>> getList(@RequestHeader("id") String id) {
        return getDataList(ssh.connect(id), null);
    }

    /**
     * add ssl to postfix and dovecot
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/setup-ssl-to-postfix" , consumes = "application/json", produces = "application/json")
    public String setupSSLToPostfix(@RequestHeader("id") String id,
                                              @RequestBody Map<String, String> data) {
      String  type = data.getOrDefault("typeSSL", "1");
      String  cert = data.getOrDefault("cert", "");
      String  key = data.getOrDefault("key", "");
      String  capath = data.getOrDefault("capath", "");

        Connection connection = ssh.connect(id); //initiate session

      if(type.contains("1")){

         String dname= ssh.executeCommand("executecommand",
                             new String[]{"postconf -n myhostname"},connection,false );

         if(dname.isEmpty())
             return "Not valid domain, please setup manually!";

         String[] split = dname.split("=");

          if(split.length <=1 || split[1].contains("localhost"))
              return "Not valid domain, please setup manually!";

          String domain = split[1].trim();

         cert   =  "/etc/letsencrypt/live/"+domain+"/cert.pem";
         key    = "/etc/letsencrypt/live/"+domain+"/privkey.pem";
         capath = "/etc/letsencrypt/live/"+domain+"/fullchain.pem";
      }

        if(type.contains("3")){
            cert   =  "/etc/ssl/certs/ssl-cert-snakeoil.pem";
            key    = "/etc/ssl/private/ssl-cert-snakeoil.key";
            capath = "/etc/ssl/certs";
        }



      ssh.executeCommand("executecommand",
              new String[]{"postconf -e 'smtpd_tls_cert_file="+cert+"'"},connection,false );

      ssh.executeCommand("executecommand",
              new String[]{"postconf -e 'smtpd_tls_key_file="+key+"'"},connection,false );

      if(!capath.isEmpty())
      ssh.executeCommand("executecommand",
              new String[]{"postconf -e 'smtp"+(type.contains("3") ? "":"d")+"_tls_CAfile="+capath+"'"},connection,false );


      // if is return how it was we remove smtpd_tls_CAfile if different smtp_tls_CAfile from main.cf
       ssh.executeCommand( "executecommand",
                    new String[]{"postconf -X 'smtp"+(type.contains("3") ? "d":"")+"_tls_CAfile'"}, connection, false);


        Map<String, InputStream> files = new HashMap<>();

        // file: /etc/dovecot/conf.d/10-auth.conf
         String content2 = ssh.getStringFileContent("/etc/dovecot/conf.d/10-ssl.conf", connection);
        // end read data

        if(!content2.isEmpty()){
            if(type.contains("3")){
               cert   =  "/etc/dovecot/private/dovecot.pem";
               key    = "/etc/dovecot/private/dovecot.key";
            }

            StringJoiner newData10SSl = new StringJoiner("\n");
            String[] listSplit2 = content2.split("\\r?\\n");

            // and the rest auth_mechanisms we just comments
            for(String st : listSplit2) {
              if(st.contains("ssl_cert =") || st.contains("ssl_cert=")) {
                  newData10SSl.add("ssl_cert = <" + cert);
              }else if(st.contains("ssl_key =") || st.contains("ssl_key=")){
                  newData10SSl.add("ssl_key = <" + key);
              } else {
                  newData10SSl.add(st);
              }
            }

            files.put("10-ssl.conf", new ByteArrayInputStream(newData10SSl.toString().getBytes()));
        }

        if(files.size()>0){
            try{Thread.sleep(1000);}catch (Exception e){}
            ssh.sftpUpload(connection, files, "/etc/dovecot/conf.d/", "root");
        }


        ssh.executeCommand("executecommand",
                new String[]{"systemctl restart dovecot"},connection,false );

        try{Thread.sleep(500); }catch (Exception e){}
        // reload service postfix
        ssh.executeCommand("executecommand",
                new String[]{"postfix reload"},connection,false );

        // reload service postfix and close session
        ssh.executeCommand("executecommand",
                new String[]{"systemctl restart postfix"},connection,true );



      return "Certificate added to mail server!";
    }

    /**
     * add new email
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/add-new-email" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> addNewOne(@RequestHeader("id") String id,
                                               @RequestBody Map<String, String> data) {

        String email = data.getOrDefault("email","");
        String account = data.getOrDefault("account","");
        String[] splitMail = email.split("@");

        Connection connection = ssh.connect(id); //initiate session
        String content = ssh.executeCommand("get_file_content",
                           new String[]{"/etc/postfix/virtual"}, connection,false);

        StringJoiner acc = new StringJoiner("\n");
        String[] listSplit = content.split("\\r?\\n");

        for(String st : listSplit){
            if(!st.trim().isEmpty()){
                acc.add(st);
            }
        }

        acc.add(email+" "+account);
        ssh.executeCommand("put_content_in_file_simple", new String[]{acc.toString(), "/etc/postfix/virtual"}, connection, false );

        ssh.executeCommand("commandline",new String[]{"postmap /etc/postfix/virtual"}, connection,false );

        // now we need to add the domain name to
        //   virtual_alias_domains =
        //  what is in /etc/postfix/main.cf
        // first check if this is not a main domain
        String getDomains = ssh.executeCommand("commandline",new String[]{"postconf -n 'mydestination'"}, connection,false );
        if(!getDomains.contains(splitMail[1])){
            String vad = ssh.executeCommand("commandline",new String[]{"postconf -n 'virtual_alias_domains'"}, connection,false );

            // if not than we check if this domain is in list
          if(!vad.contains(splitMail[1])){
              try{Thread.sleep(1500); }catch (Exception e){}
               // if not than we put it in the list
               String[] splitVAD= vad.split("=");
               String v_a_d = splitVAD.length>1 ? splitVAD[1]+","+splitMail[1] :
                                                                  vad+","+splitMail[1];

                v_a_d = v_a_d.trim().startsWith(",") ? v_a_d.trim().substring(1) : v_a_d;

               ssh.executeCommand("commandline",
                      new String[]{"postconf -e 'virtual_alias_domains = "+v_a_d.replace("\n","")+"'"},connection,false );
          }
        }


        ssh.executeCommand("postfix_restart",new String[]{}, connection,true );

        return getDataList(connection, acc.toString());
      }


    /**
     * remove email
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/remove-email" )
    public List<Map<String,String>> remove(@RequestHeader("id") String id,
                                           HttpServletRequest request ) {

        String email = request.getParameter("email");
        String account = request.getParameter("account");
        Connection connection = ssh.connect(id); //initiate session
        String content = ssh.executeCommand("get_file_content",
                              new String[]{"/etc/postfix/virtual"}, connection,false);

        StringJoiner acc = new StringJoiner("\n");
        String[] listSplit = content.split("\\r?\\n");

        for(String st : listSplit){
          if(!st.replace("\\s+"," ").trim().contains(email+" "+account)){
              acc.add(st);
          }
         }

        ssh.executeCommand("put_content_in_file_simple", new String[]{acc.toString(),"/etc/postfix/virtual"}, connection, false );

        ssh.executeCommand("commandlinet",new String[]{"postmap /etc/postfix/virtual"}, connection,false );
        ssh.executeCommand("postfix_restart",new String[]{""}, connection,true );


        return getDataList(connection, acc.toString());
    }


    //postconf -n 'virtual_alias_domains'    - getthis value name like:
    //virtual_alias_domains = simplessh.com

    /**
     * process list of emails
     * @param connection
     * @param data
     * @return
     */
    private List<Map<String,String>> getDataList(Connection connection, String data){
        List<Map<String,String>> list = new ArrayList<>();

       if(data == null)
          data = ssh.executeCommand( "get_file_content",
                                              new String[]{"/etc/postfix/virtual"}, connection,true);

        if(data.isEmpty())
            return list;

        String[] listSplit = data.split("\\r?\\n");
        for(String st : listSplit){
               st= st.trim().replace("  "," ");
               String[] split1 = st.split("\\s+");
               list.add(new HashMap<>(){{
                    put("name",   split1[0]);
                    put("account", split1.length>1? split1[1]:"");
                }});
        }
        return list;
    }


}
