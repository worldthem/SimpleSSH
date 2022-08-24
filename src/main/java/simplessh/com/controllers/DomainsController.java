package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.Helpers;
import simplessh.com.dao.Connection;
import simplessh.com.response.ListMapResponse;
import simplessh.com.services.KeyStoreService;
import simplessh.com.services.RunCommand;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * @author Corneli F.
 *
 * DomainsController
 */
@RestController
@RequestMapping("/api/v1/")
public class DomainsController {

    @Autowired
    private RunCommand ssh;

    @Autowired
    private KeyStoreService keyStoreService;

    /**
     * get list of domains
     * @param id
     * @return
     */
   @GetMapping("/get-list-of-domains")
    public List<Map<String,String>> getList(@RequestHeader("id") String id) {

        return getDataList(ssh.connect(id));
    }

    /**
     * suspend domain
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/suspend-activate-domain")
    public List<Map<String,String>> suspendActivateDomain(@RequestHeader("id") String id,
                                                           HttpServletRequest request) {
        String name = request.getParameter("name");
        String type = request.getParameter("type");

        Connection connection = ssh.connect(id);
         if(type.contains("off")){
             ssh.executeCommand("move",
                new String[]{"/etc/nginx/conf.d/" + name + ".conf", "/etc/nginx/conf.d/" + name + ".suspended"},connection,false);
         }else{
             ssh.executeCommand("move",
                new String[]{"/etc/nginx/conf.d/" + name + ".suspended", "/etc/nginx/conf.d/" + name + ".conf"},connection,false);
           }

         ssh.executeCommand("nginx_restart",new String[]{}, connection,false );

         try{Thread.sleep(1000);}catch(Exception e){}

        return getDataList(connection);
    }

    /***
     * add new domain
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/add-new-domain" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> addNewDomain(@RequestHeader("id") String id, @RequestBody Map<String, String> data ) {
        String dName = data.getOrDefault("name","");
        String proxy = data.getOrDefault("proxy","");
        String path = data.getOrDefault("path","/var/www/");
        String pathToDomain = path.substring(path.length() - 1).contains("/") ? path : path+"/";

        String ns1 = data.getOrDefault("ns1","");
        String ns2 = data.getOrDefault("ns2","");
        String ns3 = data.getOrDefault("ns3","");
        String ns4 = data.getOrDefault("ns4","");



        String type = data.getOrDefault("typeDomain","php");

        Connection connection = ssh.connect(id);

        if(!dName.isEmpty()) {
            String javaString ="server { \n" +
                    "             listen 80; \n" +
                    "             listen [::]:80;  \n" +
                    "             server_name "+dName+" www."+dName+";\n" +
                    "             access_log "+pathToDomain+dName+"/public_html/access.log;\n" +
                    "             error_log "+pathToDomain+dName+"/public_html/error.log;\n" +
                    "             location / {\n" +
                    "                 proxy_pass "+proxy+";\n" +
                    "                 proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;\n" +
                    "                 proxy_set_header X-Forwarded-Proto \\$scheme;\n" +
                    "                 proxy_set_header X-Forwarded-Port \\$server_port;\n" +
                    "             }\n" +
                    "             location ~ \\.log {\n" +
                    "                deny  all;\n" +
                    "              }\n" +
                    "            }";

            String phpString = "server {  \n" +
                    "             listen 80; \n" +
                    "             listen [::]:80;  \n" +
                    "             server_name "+dName+" www."+dName+";\n" +
                    "             root "+pathToDomain+dName+"/public_html;\n" +
                    "             index index.php index.html index.htm;\n" +
                    "\n" +
                    "        location / {\n" +
                    "                try_files \\$uri \\$uri/ /index.php?\\$args;\n" +
                    "\n" +
                    "               location ~* ^.+\\\\.(jpeg|jpg|png|gif|bmp|ico|svg|css|js)\\$ {\n" +
                    "                    expires max;\n" +
                    "                }\n"+
                    "\n" +
                    "               location ~ \\.php$ {\n" +
                    "                   root "+pathToDomain+dName+"/public_html;\n" +
                    "                   fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;\n" +
                    "                   fastcgi_index  index.php;\n" +
                    "                   fastcgi_split_path_info ^(.+\\\\.php)(/.+)$;\n" +
                    "                   fastcgi_param SCRIPT_FILENAME \\$document_root\\$fastcgi_script_name;\n" +
                    "                   include    fastcgi_params;\n" +
                    "                }\n" +

                    "        }\n" +
                    "\n" +
                    "     error_page   500 502 503 504  /50x.html;\n" +
                    "     location = /50x.html {\n" +
                    "        root "+pathToDomain+dName+"/public_html;\n" +
                    "     }\n" +
                    "\n" +

                    "\n\n" +
                    "         access_log "+pathToDomain+dName+"/public_html/access.log;\n" +
                    "         error_log "+pathToDomain+dName+"/public_html/error.log;\n" +

                    "\n\n" +
                    "      # deny access to .htaccess files, if Apache is document root\n" +
                    "      # concurs with nginx is one\n" +
                    "      location ~* \"/\\\\.(htaccess|htpasswd)\\$\" {\n" +
                    "        deny    all;\n" +
                    "        return  404;\n" +
                    "      }\n"+
                    "\n" +
                    "      location ~ \\.log {\n" +
                    "         deny  all;\n" +
                    "      }\n" +
                    "}";

                String ip = keyStoreService.getSshAccountByName(id,"sshHost");

                String dns = "\\$TTL 14400\n" +
                        "@    IN    SOA    "+ns1+".    root."+dName+". (\n" +
                        "                                            2022030104\n" +
                        "                                            7200\n" +
                        "                                            3600\n" +
                        "                                            1209600\n" +
                        "                                            180 )\n" +
                        "\n" +
                        "@\t14400\tIN\tNS\t\t"+ns1+".\n" +
                        "@\t14400\tIN\tNS\t\t"+ns2+".\n" +
                        (ns3.isEmpty()?"":"@\t14400\tIN\tNS\t\t"+ns3+".\n")+
                        (ns4.isEmpty()?"":"@\t14400\tIN\tNS\t\t"+ns4+".\n")+
                        "@\t14400\tIN\tA\t\t"+ip+"\n" +
                        "www\t14400\tIN\tA\t\t"+ip+"\n" +
                        "ftp\t14400\tIN\tA\t\t"+ip+"\n" +
                        "mail\t14400\tIN\tA\t\t"+ip+"\n" +
                        "smtp\t14400\tIN\tA\t\t"+ip+"\n" +
                        "pop\t14400\tIN\tA\t\t"+ip+"\n" +
                        "imap\t14400\tIN\tA\t\t"+ip+"\n" +
                        "@\t14400\tIN\tMX\t10\tmail."+dName+".\n" +
                        "@\t14400\tIN\tTXT\t\t\\\"v=spf1 a mx ip4:"+ip+" ~all\\\"\n" +
                        "_dmarc\t14400\tIN\tTXT\t\t\\\"v=DMARC1; p=none\\\"\n" +
                        "*\t14400\tIN\tA\t\t"+ip+"";


                String checkDir= ssh.executeCommand("check_if_directory_exist",
                                    new String[]{pathToDomain+dName}, connection, false );

                LinkedHashMap<String, String[]> map21 = new LinkedHashMap<>(){{
                    put("put_content_in_file_simple", new String[]{(type.contains("php")? phpString : javaString), "/etc/nginx/conf.d/"+dName+".conf"});

                    if(!checkDir.contains("yes")){
                     put("new_directory",new String[]{pathToDomain+dName+"/public_html/"});
                     put("assign_www_data_group_to_folder",new String[]{pathToDomain+dName+""});
                     put("automatically_given_www-data_for_new",new String[]{pathToDomain+dName+"/*"});
                     put("automatically_set_permision_rwrr_for_new",new String[]{pathToDomain+dName+"/*"});
                    }
                     put("nginx_restart",new String[]{});
                }};

                ssh.executeCommandMultiple(connection,map21);

               if(!ns1.isEmpty()&&!ns2.isEmpty()) {
                   // create a file your-domain.com.db
                   ssh.executeCommand("put_content_in_file_simple",
                           new String[]{dns, "/etc/bind/"+dName+".db"},connection,false);

                   try{Thread.sleep(1000);}catch(Exception e){}

                   // Add a line bellow other content in file /etc/bind/named.conf :
                   // zone "your-domain.com.db" {type master; file "/etc/bind/your-domain.com.db";};
                   addRemoveToNamedConf(connection,dName, "add");
                 }

                ssh.executeCommand("put_content_in_file_simple",
                                    new String[]{ "<h1>Oops!</h1><br/><h2>Something went wrong</h2>", pathToDomain+dName+"/public_html/50x.html"},
                        connection,false );
          }
        try{Thread.sleep(1000);}catch(Exception e){}
        return getDataList(connection);
    }

    // add or remove a row in /etc/bind/named.conf first read the content file
    private void addRemoveToNamedConf(Connection connection,String domainName, String typeOperation){

        String content = ssh.executeCommand("get_file_content", new String[]{"/etc/bind/named.conf"}, connection, false);

        if(!content.isEmpty()){

            StringJoiner newData = new StringJoiner("\n");
            String[] listSplit = content.split("\\r?\\n");

            for(String st : listSplit){
                if(!st.contains("/"+domainName+".db")){
                  newData.add(st.replaceAll("\"","\\\\\""));
                }
            }

            if(typeOperation.contains("add"))
                newData.add("zone \\\""+domainName+"\\\" {type master; file \\\"/etc/bind/"+domainName+".db\\\";};");

            try{Thread.sleep(1000);}catch (Exception e){}
            ssh.executeCommand("put_content_in_file_simple", new String[]{newData.toString(),
                                                                 "/etc/bind/named.conf"}, connection, false);

            try{Thread.sleep(1000);}catch (Exception e){}
            ssh.executeCommand( "app_restart", new String[]{"bind"}, connection, false);
       }

    }


    /**
     *  install Let's encrypt SSL
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/install-ssl" , consumes = "application/json", produces = "application/json")
    public ListMapResponse changePassword(@RequestHeader("id") String id, @RequestBody Map<String, String> data ) {
        String name = data.getOrDefault("name","");
        String email = data.getOrDefault("email","");

        Connection connection = ssh.connect(id);//open the connection
        //certbot --nginx -d worldthem.com -d www.worldthem.com
        String response = ssh.executeCommand("installssl", new String[]{email, name, name}, connection, false);
        try{Thread.sleep(1000);}catch(Exception e){}
        return new ListMapResponse(getDataList(connection), response);
      }

    /**
     * renew domain
     * @param id
     * @return
     */
    @GetMapping("/renew-ssl")
    public ListMapResponse renewSSL(@RequestHeader("id") String id) {
        Connection connection = ssh.connect(id);//open the connection
        String result = ssh.executeCommand("renew_ssl", new String[]{},connection, false);
        try{Thread.sleep(1000);}catch(Exception e){}
        return new ListMapResponse(getDataList(connection), result);
    }

    /**
     * edit dns
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/edit-dns" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> changePath(@RequestHeader("id") String id, @RequestBody Map<String, String> data ) {
        String name = data.getOrDefault("name","");
        String path = data.getOrDefault("path","");

        Connection connection = ssh.connect(id);//open the connection
        ssh.executeCommand("ftp_set_directory", new String[]{path, name.trim()},connection,false);
        try{Thread.sleep(1000);}catch(Exception e){}
        return getDataList(connection);
    }

    /**
     * remove domain
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/remove-domain")
    public List<Map<String,String>> removeDomain(@RequestHeader("id") String id, HttpServletRequest request ) {
        String name = request.getParameter("name");
        Connection connection = ssh.connect(id);
        ssh.executeCommand("move", new String[]{"/etc/nginx/conf.d/"+name, "/var/trash/"}, connection, false );
          try {  Thread.sleep(2000);  } catch (InterruptedException e) { }
        ssh.executeCommand("nginx_restart",new String[]{}, connection,false );
          try {  Thread.sleep(2000);  } catch (InterruptedException e) { }

        addRemoveToNamedConf(connection,
                      name.replace(".conf","").replace(".suspended",""),
                 "remove");


        return getDataList(connection);
    }


    /**
     * get list of domains
     * @param connection
     * @return
     */
    private List<Map<String,String>> getDataList(Connection connection){
        List<Map<String,String>> list = new ArrayList<>();
        String domainList = ssh.executeCommand( "show_folder_content_ls", new String[]{"/etc/nginx/conf.d"}, connection,true );

        if(domainList.isEmpty())
           return  list;

        String[] listSplit = domainList.split("\\r?\\n");
        for(String st : listSplit){
            if(!st.contains("file:") && !st.contains(".key")) {

               String dbName = st.replace("--", "").replace("|", "").replace(".conf", "")
                        .replace(" ","").replace("`","").replace(".suspended","");

                list.add(new HashMap<>(){{
                    put("name",   dbName);
                    put("active", st); // .suspended  | .conf
                    put("ssl",    "no");  //checkSSL(dbName));
                }});
            }
        }
        return list;
    }

    /**
     * check if ssl is activated
     * @param domain
     * @return
     */
    private String checkSSL(String domain){

        try{
            URL url = new URL("https://"+domain);
            new BufferedReader(new InputStreamReader(url.openStream(), StandardCharsets.UTF_8));
            return "yes";
        }catch (Exception e){
            return "no";
        }
   }
}
