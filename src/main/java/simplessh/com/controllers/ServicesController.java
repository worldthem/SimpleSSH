package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.Helpers;
import simplessh.com.dao.Connection;
import simplessh.com.services.RunCommand;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.*;

/**
 * @author Corneli F.
 *
 * Service controller
 */
@RestController
@RequestMapping("/api/v1/")
public class ServicesController {
    @Autowired
    private RunCommand ssh ;

    /**
     * get list of services
     * @param id
     * @return
     */
   @GetMapping("/get-list-of-services")
    public List<Map<String,String>> getList(@RequestHeader("id") String id) {
         //open the connection
        return getDataList(ssh.connect(id));
    }

    /**
     * service action like disable or enable or activate
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/services-action")
    public List<Map<String,String>> actionData(@RequestHeader("id") String id, HttpServletRequest request) {
        String actionBtn = request.getParameter("actionBtn");
        String name = request.getParameter("name");
        if(name == null)
            return new ArrayList<>();

        name = name.replace(".service","");

        Connection connection = ssh.connect(id);
        if(actionBtn.contains("disable")) {
            ssh.executeCommand("stop_services", new String[]{name}, connection,false);
            //try{Thread.sleep(1000);}catch (Exception e){}
            //ssh.executeCommand(id,"disable_services", new String[]{name}, true,false);

        } else if (actionBtn.contains("enable")) {
            String is=  ssh.executeCommand("is_enabled_service", new String[]{name}, connection,false);
            if(is.contains("enabled")) {
                ssh.executeCommand( "enable_services", new String[]{name}, connection, false);
                try {
                    Thread.sleep(1000);
                } catch (Exception e) {
                }
            }
            ssh.executeCommand("start_services", new String[]{name}, connection,false);
        }else if (actionBtn.contains("restart")) {

            ssh.executeCommand("restart_services", new String[]{name}, connection,false);
        }else if (actionBtn.contains("remove")) {
            ssh.executeCommand("remove_services", new String[]{name}, connection,false);
            //ssh.executeCommand("remove_file", new String[]{"/etc/systemd/system/"+name}, false,false,false);
        }

       return getDataList(connection);
   }

    /**
     *  service action like disable or enable or activate
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/action-service")
    public String actionService(@RequestHeader("id") String id, HttpServletRequest request) {
        String name = request.getParameter("name");
        String action = request.getParameter("actionService");
        return ssh.executeCommand(action+"_services",new String[]{name}, ssh.connect(id),true );
    }

    /**
     * get service data
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/get-service-data")
    public String getServiceData(@RequestHeader("id") String id, HttpServletRequest request) {
        String name = request.getParameter("name");

        return ssh.executeCommand("get_file_content",new String[]{"/etc/systemd/system/"+name},  ssh.connect(id),true);
    }

    /**
     * show status of service
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/service-show-status")
    public String showStatus(@RequestHeader("id") String id, HttpServletRequest request ) {
      String name = request.getParameter("name");
      return ssh.executeCommand("status_services", new String[]{name}, ssh.connect(id),true);
   }

    /**
     * add new serrvice
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/add-new-service" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> addNewOne(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
        String name = data.getOrDefault("name","");
        String description = data.getOrDefault("description","");
        String runCode = data.getOrDefault("runcode","/var/www/");

        String fileConten="[Unit]\n" +
                "Description="+description+"\n" +
                "After=syslog.target\n" +
                "After=network.target[Service]\n" +
                "User=username\n" +
                "Type=simple\n" +
                "\n" +
                "[Service]\n" +
                "ExecStart="+runCode+"\n" +
                "Restart=always\n" +
                "StandardOutput=syslog\n" +
                "StandardError=syslog\n" +
                "SyslogIdentifier="+name+"\n" +
                "\n" +
                "[Install]\n" +
                "WantedBy=multi-user.target";

        Connection connection = ssh.connect(id);
        ssh.executeCommand("put_content_in_file_simple", new String[]{fileConten, "/etc/systemd/system/"+name+".service"},connection,false);
        try{Thread.sleep(1000);}catch (Exception e){}
        ssh.executeCommand("start_services", new String[]{name+".service"},connection,false);
        try{Thread.sleep(1000);}catch (Exception e){}
        ssh.executeCommand("enable_services", new String[]{name+".service"},connection,false);

        try{Thread.sleep(1000);}catch (Exception e){}
        return getDataList(connection);
      }

    /**
     * get your services, the services you added, actually it save in /etc/systemd/system/
     * @param connection
     * @return
     */
     private List<String> getYourList(Connection connection){
         String fileList = ssh.executeCommand("show_folder_content_ls_short_and_full",
                                        new String[]{"/etc/systemd/system/"},connection,true);
         List<String> res = new ArrayList<>();
         try{
             String[] split221 = fileList.split("@@@@@@");
             String[] listSplitShort = split221[0].split("\\r?\\n");
             String[] listSplitLong = split221[1].split("\\r?\\n");

             for(int j=0; j< listSplitShort.length; j++) {
                 try{
                     if(listSplitLong[j+2].substring(0, 1).contains("-") && listSplitShort[j].contains(".service") ){
                         res.add(listSplitShort[j]);
                     }
                 }catch (Exception e){ }
             }
         }catch (Exception e){  }

         return res;
     }

    /**
     * ger list of all services
     * @param connection
     * @return
     */
    private List<Map<String,String>> getDataList(Connection connection){
        List<Map<String,String>> list = new ArrayList<>();
        String data = ssh.executeCommand("show_services", new String[]{""}, connection,false);

        data = data.replaceAll(" +"," ") ;

        if(data.isEmpty())
            return list;

        List<String> yourList = getYourList(connection);

        String[] listSplit = data.split("\\r?\\n");
        for(String st : listSplit){
                String[] split1 = st.split(" ");


            try {
                if(split1[1].contains(".service")) {
                    StringJoiner description = new StringJoiner(" ");
                    for (int j=5; j<split1.length; j++)
                        description.add(split1[j]);


                    list.add(new HashMap<>(){{
                        put("name",        split1[1]);
                        put("description", description.toString());
                        put("status",      split1[2] + "; " + split1[3] + "; " + split1[4]);
                        put("allow",        yourList.contains(split1[1]) ? "yes":"");

                    }});
                 }
            }catch (Exception e){}



        }
        return list;
    }

}
