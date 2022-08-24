package simplessh.com.services;

import com.jcraft.jsch.*;
import org.apache.commons.io.Charsets;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import simplessh.com.Helpers;
import simplessh.com.Variables;
import simplessh.com.dao.Connection;
import simplessh.com.dao.DownloadFile;
import simplessh.com.dao.SshAccount;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;


/**
 *
 get list fo domains
 sudo nginx -T | grep "server_name " | sed 's/.*server_name \(.*\);/\1/' | sed 's/ /\n/'

 getlist  of domains
 String command1="echo MyPassword | sudo -S nginx -T | grep \"server_name \" | sed 's/.*server_name \\(.*\\);/\\1/' | sed 's/ /\\n/'";

 create new file with text
 echo MyPassword | sudo -S printf "Sdfev\n 33\n3"  > /home/ecommerc/test/ttt2.conf

 get the list of files from directory
 echo MyPassword | sudo -S gio tree /etc/nginx/conf.d

 run multiple command
 echo MyPassword | sudo -S printf "Sdfev4\n 22\n2"  > /home/ecommerc/test/ttt4.conf && printf "Sdfev5\n 5\n5"  > /home/ecommerc/test/ttt5.conf

 $ mysql -u root -p'MyPassword' -e "PURGE BINARY LOGS TO 'mysql-bin.03';"

 $ mysql -u root -p'MyPassword' -e "PURGE BINARY LOGS BEFORE '2008-12-15 10:06:06';"

 sudo apt install zip unzip

 Automate mysql_secure_installation with echo command via a shell script
 https://stackoverflow.com/questions/24270733/automate-mysql-secure-installation-with-echo-command-via-a-shell-script/35004940
 https://gist.github.com/Mins/4602864

 mysql_secure_installation <<EOF\n
 n
 somepass
 somepass
 y
 y
 y
 y
 y
 EOF

 //SET GLOBAL validate_password_policy=LOW;
 sudo /usr/bin/mysql -u root -e "DELETE FROM mysql.user WHERE User=''; DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1'); DROP DATABASE IF EXISTS test; select plugin_name, plugin_status from information_schema.plugins where plugin_name like 'validate%'; install plugin validate_password soname 'validate_password.so'; SET GLOBAL validate_password_policy=LOW; FLUSH PRIVILEGES;"
 
 */
@Service
public class RunCommand {
   /*
    private ChannelSftp channelSftp = null;
    private Channel channelDownload = null;
    private ChannelSftp channelSftpDownload = null;
    */

    @Autowired
    private KeyStoreService service ;

    private static final Logger logger = LogManager.getLogger(RunCommand.class);

    public RunCommand(){
        //System.out.println("Call here");
    }

    /**
     * connect to your system
     * @param id
     * @return
     */
    public Connection connect(String id){
             SshAccount account = service.getSshAccount(id);
             Session session = null;

             try {
                java.util.Properties config = new java.util.Properties();
                config.put("StrictHostKeyChecking", "no");
                JSch jsch = new JSch();
                session = jsch.getSession(account.getSshLog(), account.getSshHost(), 22);
                session.setPassword(account.getSshPass());
                session.setConfig(config);
                session.connect();

                logger.info("Connected to "+account.getSshHost());

            } catch (Exception e) {
                System.out.println("Error connecting: " + e.getMessage());
            }

        return new Connection(account, session) ;
    }

    /**
     * disconnect
     * @param session
     */
    public void disconnect(Session session){
        try{
            session.disconnect();
            logger.info("Disconnected");
         }catch (Exception e){
            logger.error("Error disconnected: "+e.getMessage());
        }
    }

    /**
     *  When send comand to server we need to enter also the pass for the root user so we do it here
     * @param arr
     * @return
     */
    private String[] createMysql(String password, String[] arr){
        String[] pass = {password};
        String[] result = new String[arr.length + 1];
        System.arraycopy(pass, 0, result, 0, 1);
        System.arraycopy(arr, 0, result, 1, arr.length);
        return result;
    }

    /**
     * execute multiple command
     * @param connection
     * @param map
     * @return
     */
    public String executeCommandMultiple(Connection connection, LinkedHashMap<String, String[]> map){
           for(Map.Entry<String, String[]> entry:  map.entrySet()) {
             executeCommand(entry.getKey(),  entry.getValue(), connection, false );
             try{Thread.sleep(2000);}catch (Exception e){}
          }
        return "";
    }


    /**
     * execute single comand
     * @param command
     * @param array
     * @param connection
     * @param close
     * @return
     */
    public String executeCommand( String command,  String[] array, Connection connection, boolean close){
        Map<String, String>  execute = executeCommandErr(command, array, connection, close );
        String error=execute.getOrDefault("error","");
               error = (error.toLowerCase(Locale.ROOT).contains("sudo") ||
                        error.toLowerCase(Locale.ROOT).contains("warning") ||
                        error.isEmpty()) &&
                       !error.toLowerCase(Locale.ROOT).contains("sql syntax") &&
                       !error.toLowerCase(Locale.ROOT).contains("at line")  ? "": error+"\n";

        return error+execute.getOrDefault("data","");
     }

    /**
     * execute comand it self
     * @param command
     * @param array
     * @param connection
     * @param close
     * @return
     */
    public Map<String, String> executeCommandErr( String command, String[] array, Connection connection, boolean close ){

        SshAccount sshAccount = connection.getSshAccount();
        String commandName = command;
        command = command(sshAccount.getPlatform(), command, (commandName.contains("mysql_") ? createMysql(sshAccount.getMysqlPass(), array) : array));



       if((commandName.contains("mysql_") || commandName.contains("mysqldump")) &&
               (sshAccount.getMysqlPass() == null || sshAccount.getMysqlPass().isEmpty())){
            command = command.replace("mysql -u  -p''","/usr/bin/mysql -u root");
            command = command.replace("mysql -u root -p''","/usr/bin/mysql -u root");
            command = command.replace("mysql -u mysqluser -p''","/usr/bin/mysql -u root");
            command = command.replace("mysqldump -u mysqluser -p''","/usr/bin/mysqldump -u root");
        }

        logger.info("Command: "+(commandName.contains("mysql_") ? command : "sudo -S "+command));

        command = commandName.contains("mysql_") ?
                 command.replace("mysqluser", sshAccount.getMysqlLog()) : "echo '"+sshAccount.getSshPass()+"' | sudo -S "+command;



        StringBuilder returnComandData = new StringBuilder();
        Map<String, String> result = new HashMap<>();

        ChannelExec channel = null;
        CompletableFuture<String> cf = null;
        String error="";
        try{
            channel = (ChannelExec) connection.getSession().openChannel("exec");
            channel.setCommand(command);
            channel.setInputStream(null);
            channel.setErrStream(System.err);
            InputStream in = channel.getInputStream();
            // channel.setPty(true);
            channel.connect();


             InputStream inErr =  channel.getErrStream();
             cf = CompletableFuture.supplyAsync(() -> inputStreamToString(inErr,"err")).orTimeout(1, TimeUnit.SECONDS);

            while(true){
                returnComandData.append(inputStreamToString(in,""));

                if(channel.isClosed()){
                    System.out.println("exit-status: "+channel.getExitStatus());
                    break;
                }

                try{ Thread.sleep(1000);  }catch(Exception ee){  }
            }
            error = cf!=null? cf.get(): "";

            System.out.println("DONE");

        } catch(Exception e){
            System.out.println("Error Run:"+e);
        } finally {
            if(close) disconnect(connection.getSession());
            if (channel != null)  channel.disconnect();
        }

        result.put("data", returnComandData.toString());
        result.put("error", error);

        return  result;
    }

    /**
     * will read InputStream and put in string
     * @param inputStream
     * @return
     */
    public String inputStreamToString(InputStream inputStream, String type){
        StringBuilder textBuilder = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader
                (inputStream, Charset.forName(StandardCharsets.UTF_8.name())))) {

            int c;
            while ((c = reader.read()) != -1) {
                textBuilder.append((char) c);
            }
        }catch (Exception e){
            System.out.println("err read:"+e.getMessage());
        }
         //System.out.println(textBuilder.toString());
        if(type.contains("err"))
        logger.error("Error: "+textBuilder);
      return textBuilder.toString();
    }




    public String readResponse(InputStream inStreamFromServer, int timeout) {

        BufferedReader reader = new BufferedReader(new InputStreamReader(inStreamFromServer, Charsets.UTF_8));
        char[] buffer = new char[8092];
        boolean timeoutNotExceeded;
        StringBuilder result = new StringBuilder();
        final long startTime = System.nanoTime();
        try{
         while ((timeoutNotExceeded = (TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime) < timeout))) {
            if (reader.ready()) {
                int charsRead = reader.read(buffer);
                if (charsRead == -1) {
                    break;
                }
                result.append(buffer, 0, charsRead);
            } else {
                try {
                    Thread.sleep(timeout / 200);
                } catch (InterruptedException ex) {
                    System.out.println("InterruptedException ex="+ ex.getMessage());
                }
            }
         }
        }catch (Exception e){ System.out.println(e.getMessage()); }
        //if (!timeoutNotExceeded) throw new SocketTimeoutException("Command timeout limit was exceeded: " + timeout);

        return result.toString();
    }

    /**
     * upload file to the server
     * @param connection
     * @param files
     * @param path
     * @param owner
     */
    public void sftpUpload(Connection connection, Map<String, InputStream> files, String path, String owner){
        String checkDir= executeCommand("check_if_directory_exist", new String[]{"/var/easyvps/"}, connection, false );

        if(!checkDir.contains("yes")) {
            LinkedHashMap<String, String[]> map1 = new LinkedHashMap<>() {{
                put("new_directory", new String[]{"/var/easyvps/"});
                put("only_folder_permision", new String[]{"775", "/var/easyvps/"});
            }};
            executeCommandMultiple(connection, map1);
        }

        uploadFile(files,  "/var/easyvps/", connection );

        try{ Thread.sleep(1000);  }catch(Exception ee){
            System.out.println(ee.getMessage());
        }

        // move accept multiple files separated by coma like {f_path1, f_path2,...} we put it here

        String dest = files.size()>1?  "{/var/easyvps/"+String.join(",/var/easyvps/", files.keySet())+"} " :
                                       "/var/easyvps/"+ files.keySet().toArray()[0];

         String destFinal = files.size()>1?   path+String.join("  "+path, files.keySet()) :
                                                 path+files.keySet().toArray()[0];

           LinkedHashMap<String, String[]> map2 = new LinkedHashMap<>() ;
           map2.put("move", new String[]{dest, path});
           map2.put("add_path_file_to_group", new String[]{owner, destFinal });

        // if(!checkDir.contains("yes"))
          // map2.put("only_folder_permision", new String[]{"7","/var/easyvps/"});

         executeCommandMultiple(connection,map2);
    }

  public String uploadFile(Map<String, InputStream> files, String path, Connection connection ){
     Channel channel=null;
     ChannelSftp channelSftp = null;
     try{
        channel=connection.getSession().openChannel("sftp");
        channel.connect();
        channelSftp = (ChannelSftp) channel;
        channelSftp.cd(path);
         for(Map.Entry<String, InputStream> entry : files.entrySet()){
            channelSftp.put(entry.getValue(), entry.getKey());
         }
         System.out.println("DONE");
     }catch(Exception e){
        System.out.println("Error uploadFile: "+e );
     }finally {
          if (channel != null)  channel.disconnect();
          if (channelSftp != null)  {
              channelSftp.disconnect();
           }
     }
     return "";
  }

    /**
     * download file fromyour system to your computer
     * @param remoteFileName
     * @param remoteFilePath
     * @param connection
     * @return
     */
    public String downloadFile(String remoteFileName, String remoteFilePath, Connection connection ){
        Channel channel =  null;
        ChannelSftp channelSftp = null;
        try{
            File directory = new File("./download/");
            if (! directory.exists()){
                directory.mkdir();
                // If you require it to make the entire directory path including parents,
                // use directory.mkdirs(); here instead.
            }
            channel=connection.getSession().openChannel("sftp");
            channel.connect();
            channelSftp = (ChannelSftp) channel;

            //channelSftp.get(remoteFilePath+remoteFileName, "./download/"+remoteFileName);
            InputStream stream = channelSftp.get(remoteFilePath+remoteFileName);

        }catch(Exception e){
            System.out.println("Error Run Download:"+e);
            //session=null;
        }finally {
            if(channel != null)  channel.disconnect();
            if(channelSftp != null){
                channelSftp.disconnect();
             }
        }


        return "";
    }

    /**
     * donload file like a inputstream
     * @param remoteFile
     * @param connection
     * @return
     */
    public DownloadFile downloadFileStream(String remoteFile, Connection connection ){
        Channel channelDownload = null;
        ChannelSftp channelSftpDownload = null;
        try{
            channelDownload=connection.getSession().openChannel("sftp");
            channelDownload.connect();
            channelSftpDownload = (ChannelSftp) channelDownload;

            InputStream inp= channelSftpDownload.get(remoteFile);
            return new DownloadFile(channelDownload, channelSftpDownload, inp) ;
        }catch(Exception e){
            System.out.println("Error Run Download:"+e);
            disconnectSFTP(channelDownload, channelSftpDownload, connection.getSession());
        }

        return new DownloadFile(channelDownload, channelSftpDownload, null);
  }

    /**
     * will download the file and get the content of the file and put in string
     * @param remoteFile
     * @param connection
     * @return
     */
   public String getStringFileContent(String remoteFile, Connection connection){
       DownloadFile download = downloadFileStream(remoteFile, connection);

       InputStream inp = download.getFile();
       StringBuffer buf = new StringBuffer();
       try {
           InputStream file = new BufferedInputStream(inp);
           int c;
           while ((c = file.read()) != -1) {
               buf.append((char) c);
           }
       }catch (Exception e){}

       if(download.getChannelDownload() != null){
           download.getChannelDownload().disconnect();
       }

       if(download.getChannelSftpDownload() != null){
           download.getChannelSftpDownload().disconnect();
        }

       return buf.toString();
   }


    /**
     * disconnect from sftp
     * @param channelDownload
     * @param channelSftpDownload
     * @param session
     */
  public void disconnectSFTP(Channel channelDownload, ChannelSftp channelSftpDownload, Session session){
      if(channelDownload != null){
          channelDownload.disconnect();
       }

      if(channelSftpDownload != null){
          channelSftpDownload.disconnect();
       }

      disconnect(session);
  }

    /**
     * will check if path /var/easyvps exist if not than create it
     */
  public void checkForVarEasyvpsPath(Connection connection){
        String checkDir = executeCommand("check_if_directory_exist", new String[]{"/var/easyvps/"}, connection, false );

        if(!checkDir.contains("yes")) {
          LinkedHashMap<String, String[]> map1 = new LinkedHashMap<>() {{
              put("new_directory", new String[]{"/var/easyvps/"});
              put("only_folder_permision", new String[]{"775", "/var/easyvps/"});
          }};

          executeCommandMultiple(connection, map1);
      }
  }


    /**
     * Generate command
     * @param platform
     * @param name
     * @param array
     * @return
     */
    public String command(String platform, String name, String[] array)  {
        try {
            String fileName = platform.isEmpty() ? "Ubuntu" : platform;
            Map<String,String> map = Variables.map.get(fileName);

            String command ="";
            if(map.containsKey(name)){
                command = map.get(name);
                for (int i = 0; i <array.length ; i++) {
                    command = command.replace("%"+i, array[i]);
                }
            }
            return command;
        }catch (Exception e){
            System.out.println("Error file:"+e);
        }
        return "";
    }


}
