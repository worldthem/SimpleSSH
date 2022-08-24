package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.dao.Connection;
import simplessh.com.services.RunCommand;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

/**
 * @author Corneli F.
 *
 * Install controller
 */

@RestController
@RequestMapping("/api/v1/")
public class InstallationController {

    @Autowired
    private RunCommand ssh;

    /**
     * check if app is instaled
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/check-app-status")
    public String checkStatus(@RequestHeader("id") String id, HttpServletRequest request) {
      String name = request.getParameter("name");
      String result = ssh.executeCommand("check_app_is_install", new String[]{ name }, ssh.connect(id),true);
      return result;
    }

    /**
     * uninstall app
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/uninstall-app")
    public String uninstall(@RequestHeader("id") String id, HttpServletRequest request) {
        Connection connection = ssh.connect(id);
        String name = request.getParameter("name");
        String result = ssh.executeCommand("remove_app", new String[]{name}, connection,false);

        if(name.contains("dovecot"))
        ssh.executeCommand("remove_app", new String[]{"--auto-remove dovecot-core"},connection,false);

        ssh.executeCommand("apt_get_update", new String[]{}, connection,true );
        return result;
    }


    /**
     * install app
     * @param id
     * @param data
     * @param request
     * @return
     */
    @PutMapping(path = "/install-app" , consumes = "application/json", produces = "application/json")
    public String install(@RequestHeader("id") String id, @RequestBody Map<String, String> data, HttpServletRequest request) {
        String name = data.getOrDefault("name","");
        String additional = data.getOrDefault("additional","");

        Connection connection = ssh.connect(id);
        ssh.executeCommand("apt_get_update", new String[]{}, connection,false);

        if(name.compareTo("Php") == 0){
            try{Thread.sleep(1000);}catch (Exception e){}
            ssh.executeCommand("change_repo_for_php", new String[]{},connection,false);
         }

        try{Thread.sleep(1000); }catch (Exception e){}

        if(name.contains("postfix")){
          ssh.executeCommand("executecommand",
              new String[]{"debconf-set-selections <<< 'postfix postfix/mailname string "+additional+"'"},connection,false );
          ssh.executeCommand("commandline",
              new String[]{"debconf-set-selections <<< 'postfix postfix/main_mailer_type string 'Internet Site'\""},connection,false );
        }


        String result = ssh.executeCommand("install", new String[]{name},connection,false );

        //if install postfix and dovecot
        if(name.contains("postfix")){

            //add options to /etc/postfix/master.cf
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -M submission/inet='submission inet n       -       y       -       -       smtpd'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -P submission/inet/syslog_name=postfix/submission"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -P submission/inet/smtpd_tls_security_level=encrypt"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -P submission/inet/smtpd_sasl_auth_enable=yes"},connection,false );

            try{Thread.sleep(500); }catch (Exception e){}
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -M smtps/inet='smtps     inet  n       -       y       -       -       smtpd'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -P smtps/inet/syslog_name=postfix/smtps"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -P smtps/inet/smtpd_tls_wrappermode=yes"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -P smtps/inet/smtpd_sasl_auth_enable=yes"},connection,false );
            //end options to /etc/postfix/master.cf


            // create file /etc/postfix/virtual
            ssh.executeCommand("put_content_in_file_simple",
                    new String[]{ "","/etc/postfix/virtual"}, connection,false );

            try{Thread.sleep(500); }catch (Exception e){}

            //add options to /etc/postfix/main.cf
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_sasl_type = dovecot'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_sasl_path = private/auth'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_sasl_security_options = noanonymous'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'broken_sasl_auth_clients = yes'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_sasl_auth_enable = yes'"},connection,false );
            try{Thread.sleep(1000); }catch (Exception e){}

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_tls_security_level = may'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_tls_received_header = yes'"},connection,false );

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_tls_auth_only = no'"},connection,false );

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_tls_loglevel = 1'"},connection,false );

            try{Thread.sleep(1000); }catch (Exception e){}

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_use_tls = yes'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtp_tls_note_starttls_offer = yes'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_tls_session_cache_timeout = 3600s'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtp_tls_security_level=may'"},connection,false );
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_relay_restrictions = permit_mynetworks permit_sasl_authenticated defer_unauth_destination'"},connection,false );


            try{Thread.sleep(1000); }catch (Exception e){}

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'home_mailbox= Maildir/'"},connection,false );

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'virtual_alias_maps= hash:/etc/postfix/virtual'"},connection,false );

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'virtual_alias_domains = '"},connection,false );

            //update line in /etc/postfix/postconf.ch
            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'mydestination = "+additional+", mail."+additional+", localhost'"},connection,false );

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtpd_tls_session_cache_database=btree:${data_directory}/smtpd_scache'"},connection,false );

            ssh.executeCommand("executecommand",
                    new String[]{"postconf -e 'smtp_tls_session_cache_database=btree:${data_directory}/smtp_scache'"},connection,false );


            try{Thread.sleep(1000); }catch (Exception e){}
            //update/generate /etc/postfix/virtual.db
            ssh.executeCommand("commandline",
                    new String[]{"postmap /etc/postfix/virtual"},connection,false );

            ssh.executeCommand("commandline",
                    new String[]{"postconf -X 'mailbox_command'"},connection,false );

            try{Thread.sleep(500); }catch (Exception e){}


            // add rules to firewal
            ssh.executeCommand("firewall_add_rule", new String[]{"Postfix"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"25/tcp"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"587/tcp"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"143/tcp"},connection,false );
            try{Thread.sleep(500); }catch (Exception e){}
            ssh.executeCommand("firewall_add_rule", new String[]{"993/tcp"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"110/tcp"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"995/tcp"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"2525/tcp"},connection,false );
            try{Thread.sleep(500); }catch (Exception e){}
            ssh.executeCommand("firewall_add_rule", new String[]{"Dovecot POP3"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"Dovecot IMAP"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"Dovecot Secure IMAP"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"Dovecot Secure POP3"},connection,false );

            ssh.executeCommand("firewall_add_rule", new String[]{"Postfix SMTPS"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"Postfix Submission"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"465/tcp"},connection,false );

            try{Thread.sleep(500); }catch (Exception e){}
            ssh.executeCommand("commandline",
                    new String[]{"printf \"\\nmail_location = maildir:~/Maildir\\nmail_privileged_group = mail\" >> /etc/dovecot/dovecot.conf"},connection,false );


            Map<String, InputStream> files = new HashMap<>();

            // file : /etc/dovecot/conf.d/10-master.conf
            String content = ssh.executeCommand( "get_file_content",
                    new String[]{"/etc/dovecot/conf.d/10-master.conf"}, connection, false);
            if(!content.isEmpty()) {
                String[] listSplit = content.split("\\r?\\n");
                StringJoiner newData10Master = new StringJoiner("\n");

                boolean start = false;
                for (String st : listSplit) {

                    if (st.contains("unix_listener /var/spool/postfix/private/aut") && !st.contains("#"))
                        start = true;

                    if (start) {
                        newData10Master.add("#" + st);
                        if (st.contains("}"))
                            start = false;
                    } else {
                        newData10Master.add(st);
                    }


                    if (st.contains("service auth {") || st.contains("service auth{") || st.contains("service auth  {")) {
                        newData10Master.add("  unix_listener /var/spool/postfix/private/auth {");
                        newData10Master.add("    mode = 0666");
                        newData10Master.add("    user = postfix");
                        newData10Master.add("    group = postfix");
                        newData10Master.add("  }");
                    }

                }

                files.put("10-master.conf", new ByteArrayInputStream(newData10Master.toString().getBytes()));
            }


            // file: /etc/dovecot/conf.d/10-auth.conf
            String content2 = ssh.executeCommand( "get_file_content",
                    new String[]{"/etc/dovecot/conf.d/10-auth.conf"}, connection, false);


            if(!content2.isEmpty()){
                StringJoiner newData10Auth = new StringJoiner("\n");
                String[] listSplit2 = content2.split("\\r?\\n");
                // we put this on first line
                newData10Auth.add("auth_mechanisms = plain login");
                // and the rest auth_mechanisms we just comments
                for(String st : listSplit2)
                    newData10Auth.add((st.contains("auth_mechanisms") && !st.contains("#") ? "#":"")+st);


                files.put("10-auth.conf", new ByteArrayInputStream(newData10Auth.toString().getBytes()));
            }

            if(files.size()>0){
              try{Thread.sleep(1000);}catch (Exception e){}
              ssh.sftpUpload( connection, files, "/etc/dovecot/conf.d/", "root");
            }


            ssh.executeCommand("commandline",
                    new String[]{"systemctl restart dovecot"}, connection,false );

            try{Thread.sleep(500); }catch (Exception e){}
            // reload service postfix
            ssh.executeCommand("commandline",
                    new String[]{"service postfix reload"}, connection,false );

            // reload service postfix
            ssh.executeCommand("commandline",
                    new String[]{"systemctl restart postfix"}, connection,false );
        }

        //if install BIND9
        if(name.compareTo("Bind9") == 0){
            ssh.executeCommand("firewall_add_rule", new String[]{name},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"53/udp"},connection,false );
            ssh.executeCommand("firewall_add_rule", new String[]{"53/tcp"},connection,false );

            try{Thread.sleep(1000);}catch (Exception e){}

            String content = ssh.executeCommand( "get_file_content", new String[]{"/etc/bind/named.conf.options"}, connection, false);

            if(!content.isEmpty()){

                StringJoiner newData = new StringJoiner("\n");
                String[] listSplit = content.split("\\r?\\n");

                for(String st : listSplit){
                    if(!st.contains("dnssec-validation") && !st.contains("auth-nxdomain") &&
                            !st.contains("listen-on-v6")){
                        newData.add(st.replaceAll("\"","\\\\\"")
                                .replace("'","\\\""));

                        if(st.contains("directory")){
                            newData.add("\tdnssec-validation auto;");
                            newData.add("\tauth-nxdomain no;");
                            newData.add("\t//listen-on-v6 { any; };");
                        }
                    }
                }

                try{Thread.sleep(1000);}catch (Exception e){}
                ssh.executeCommand( "put_content_in_file_simple", new String[]{newData.toString(),
                                                 "/etc/bind/named.conf.options"}, connection, false);
            }
        } // end BIND9

        // if install mysql
        if(name.compareTo("Mysql") == 0){
            try{Thread.sleep(1000); }catch (Exception e){}

            result = result + ssh.executeCommand("secure_database", new String[]{}, connection,false );
            ssh.executeCommand("put_content_in_file_simple", new String[]{"[mysqld]\n skip-log-bin", "/etc/mysql/conf.d/disable_binary_log.cnf"},connection,false );
        } // END mysql


        //if install fail2ban
        if(name.compareTo("fail2ban") == 0){
            String checkApp = ssh.executeCommand("check_app_is_install", new String[]{ "postfix" }, connection,true);

            String contentF2B =
                    "[sshd]\n" +
                    "enabled   = true\n" +
                    "maxretry  = 5\n" +
                    "findtime  = 1d\n" +
                    "bantime   = 4w\n" +
                    "filter   = sshd\n" +
                    "logpath  = /var/log/auth.log\n" +
                    "ignoreip  = 127.0.0.1/8\n\n"+

                    "[ssh-iptables]\n" +
                    "enabled  = true\n" +
                    "filter   = sshd\n" +
                    "logpath  = /var/log/auth.log\n" +
                    "maxretry = 5\n\n"+

                    "[postfix]\n" +
                    "enabled = "+(checkApp.contains("(none)")? "false":"true")+"\n" +
                    "mode    = more\n" +
                    "port    = smtp,465,submission\n" +
                    "logpath = %(postfix_log)s\n" +
                    "backend = %(postfix_backend)s\n" +
                    "maxretry = 5\n" +
                    "findtime = 60\n" +
                    "bantime = 86400\n\n"+

                    "[postfix-sasl]\n" +
                    "enabled   = "+(checkApp.contains("(none)")? "false":"true")+"\n" +
                    "filter   = postfix[mode=auth]\n" +
                    "port     = smtp,465,submission,imap,imaps,pop3,pop3s\n" +
                    "maxretry = 5\n" +
                    "findtime = 60\n" +
                    "bantime  = 86400\n" +
                    "logpath  = %(postfix_log)s\n" +
                    "backend  = %(postfix_backend)s\n\n"+

                    "[postfix-sasl2]\n" +
                    "enabled = "+(checkApp.contains("(none)")? "false":"true")+"\n" +
                    "port = smtp\n" +
                    "filter = postfix-sasl2\n" +
                    "logpath = /var/log/mail.log\n" +
                    "maxretry = 5\n\n"+

                    "[dovecot]\n" +
                    "enabled = "+(checkApp.contains("(none)")? "false":"true")+"\n" +
                    "port    = pop3,pop3s,imap,imaps,submission,465,sieve\n" +
                    "logpath = %(dovecot_log)s\n" +
                    "backend = %(dovecot_backend)s\n" +
                    "findtime = 60\n" +
                    "bantime = 86400\n"+
                    "maxretry = 5\n\n"+

                    "[roundcube-auth]\n" +
                    "enabled  = false\n" +
                    "filter   = roundcube-auth\n" +
                    "port     = http,https\n" +
                    "logpath  = /var/log/mail.log\n" +
                    "maxretry = 5\n";

            ssh.executeCommand( "put_content_in_file_simple", new String[]{contentF2B,
                    "/etc/fail2ban/jail.local"}, connection, false);


            Map<String, InputStream> files = new HashMap<>();
            String contentDovecot=
                    "# Fail2Ban filter Dovecot authentication and pop3/imap server\n" +
                            "#\n" +
                            "\n" +
                            "[INCLUDES]\n" +
                            "\n" +
                            "before = common.conf\n" +
                            "\n" +
                            "[Definition]\n" +
                            "\n" +
                            "_auth_worker = (?:dovecot: )?auth(?:-worker)?\n" +
                            "_daemon = (?:dovecot(?:-auth)?|auth)\n" +
                            "\n" +
                            "prefregex = ^%(__prefix_line)s(?:%(_auth_worker)s(?:\\([^\\)]+\\))?: )?(?:%(__pam_auth)s(?:\\(dovecot:auth\\))?: |(?:pop3|imap)-login: )?(?:Info: )?<F-CONTENT>.+</F-CONTENT>$\n" +
                            "\n" +
                            "failregex = ^authentication failure; logname=<F-ALT_USER1>\\S*</F-ALT_USER1> uid=\\S* euid=\\S* tty=dovecot ruser=<F-USER>\\S*</F-USER> rhost=<HOST>(?:\\s+user=<F-ALT_USER>\\S*</F-ALT_USER>)?\\s*$\n" +
                            "            ^(?:Aborted login|Disconnected)(?::(?: [^ \\(]+)+)? \\((?:auth failed, \\d+ attempts(?: in \\d+ secs)?|tried to use (?:disabled|disallowed) \\S+ auth|proxy dest auth failed)\\):(?: user=<<F-USER>[^>]*</F-USER>>,)?(?: method=\\S+,)? rip=<HOST>(?:[^>]*(?:, session=<\\S+>)?)\\s*$\n" +
                            "            ^pam\\(\\S+,<HOST>(?:,\\S*)?\\): pam_authenticate\\(\\) failed: (?:User not known to the underlying authentication module: \\d+ Time\\(s\\)|Authentication failure \\(password mismatch\\?\\)|Permission denied)\\s*$\n" +
                            "            ^[a-z\\-]{3,15}\\(\\S*,<HOST>(?:,\\S*)?\\): (?:unknown user|invalid credentials|Password mismatch)\\s*$\n" +
                            "            <mdre-<mode>>\n" +
                            "\n" +
                            "mdre-aggressive = ^(?:Aborted login|Disconnected)(?::(?: [^ \\(]+)+)? \\((?:no auth attempts|disconnected before auth was ready,|client didn't finish \\S+ auth,)(?: (?:in|waited) \\d+ secs)?\\):(?: user=<[^>]*>,)?(?: method=\\S+,)? rip=<HOST>(?:[^>]*(?:, session=<\\S+>)?)\\s*$\n" +
                            "\n" +
                            "mdre-normal = \n" +
                            "\n" +
                            "# Parameter `mode` - `normal` or `aggressive`.\n" +
                            "# Aggressive mode can be used to match log-entries like:\n" +
                            "#   'no auth attempts', 'disconnected before auth was ready', 'client didn't finish SASL auth'.\n" +
                            "# Note it may produce lots of false positives on misconfigured MTAs.\n" +
                            "# Ex.:\n" +
                            "# filter = dovecot[mode=aggressive]\n" +
                            "mode = normal\n" +
                            "\n" +
                            "ignoreregex = \n" +
                            "\n" +
                            "journalmatch = _SYSTEMD_UNIT=dovecot.service\n" +
                            "\n" +
                            "datepattern = {^LN-BEG}TAI64N\n" +
                            "              {^LN-BEG}\n\n";

            files.put("dovecot.conf", new ByteArrayInputStream(contentDovecot.getBytes()));

            if(files.size()>0){
                try{Thread.sleep(1000);}catch (Exception e){}
                ssh.sftpUpload(connection, files, "/etc/fail2ban/filter.d/", "root");
            }
            // reload service postfix
            ssh.executeCommand("commandline",
                    new String[]{"systemctl restart fail2ban"}, connection,false );

         } // end fail2ban

         ssh.disconnect(connection.getSession());

        return result;
    }


    /**
     * simple test method
     * @param request
     * @return
     */
    @GetMapping("/add-domain-check")
    public String ucccccccc(HttpServletRequest request) {
        String id = request.getParameter("id");
        //ssh.executeCommand("commandline",
          //      new String[]{"printf \"\\nmail_location = maildir:~/Maildir\" >> /etc/dovecot/dovecot.conf"},true,true );

    /*
        Map<String, InputStream> files = new HashMap<>();

        // file : /etc/dovecot/conf.d/10-master.conf
       String content = ssh.executeCommand( "get_file_content",
               new String[]{"/etc/dovecot/conf.d/10-master.conf"}, true, false);
        if(!content.isEmpty()) {
            String[] listSplit = content.split("\\r?\\n");
            StringJoiner newData10Master = new StringJoiner("\n");

            boolean start = false;
            for (String st : listSplit) {

                if (st.contains("unix_listener /var/spool/postfix/private/aut") && !st.contains("#"))
                       start = true;

                if (start) {
                    newData10Master.add("#" + st);
                    if (st.contains("}"))
                        start = false;
                } else {
                    newData10Master.add(st);
                }


                if (st.contains("service auth {") || st.contains("service auth{") || st.contains("service auth  {")) {
                    newData10Master.add("  unix_listener /var/spool/postfix/private/auth {");
                    newData10Master.add("    mode = 0666");
                    newData10Master.add("    user = postfix");
                    newData10Master.add("    group = postfix");
                    newData10Master.add("  }");
                }

            }

            files.put("10-master.conf", new ByteArrayInputStream(newData10Master.toString().getBytes()));
        }



            // file: /etc/dovecot/conf.d/10-auth.conf
            String content2 = ssh.executeCommand( "get_file_content",
                    new String[]{"/etc/dovecot/conf.d/10-auth.conf"}, false, false);


            if(!content2.isEmpty()){
                  StringJoiner newData10Auth = new StringJoiner("\n");
                  String[] listSplit2 = content2.split("\\r?\\n");
                   // we put this on first line
                   newData10Auth.add("auth_mechanisms = plain login");
                   // and the rest auth_mechanisms we just comments
                   for(String st : listSplit2)
                     newData10Auth.add((st.contains("auth_mechanisms") && !st.contains("#") ? "#":"")+st);


                files.put("10-auth.conf", new ByteArrayInputStream(newData10Auth.toString().getBytes()));
             }


            try{Thread.sleep(1000);}catch (Exception e){}

            if(files.size()>0)
            ssh.sftpUpload( files, "/etc/dovecot/conf.d/", "root");


            ssh.disconnect();*/

           // ssh.executeCommand( "put_content_in_file_simple", new String[]{newData.toString(),
             //       "/etc/bind/named.conf.options"}, false, true);



        return "eeee";
    }
}
