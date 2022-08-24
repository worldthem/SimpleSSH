package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.dao.Connection;
import simplessh.com.services.RunCommand;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @author Corneli F.
 *
 * System (Ubuntu or any other system users)
 * Users controller
 *
 * this users controller are for email user for ftp and your system there are one user for all this 3
 */
@RestController
@RequestMapping("/api/v1/")
public class UsersFtpController {
    @Autowired
    private RunCommand ssh;

    /**
     * get list of your system users
     * @param id
     * @return
     */
    @GetMapping("/get-list-of-users")
    public List<Map<String,String>> getListOfUsers(@RequestHeader("id") String id) {
        return getUsersList(ssh.connect(id));
    }

    /**
     * remove users of your system
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/add-remove-user-from-sudo")
    public String addRemoveFromSudo(@RequestHeader("id") String id, HttpServletRequest request) {
        String name = request.getParameter("name");
        String type = request.getParameter("type");

        String result = ssh.executeCommand((type.contains("add") ? "make_user_sudoer" :"remove_user_sudo"),
                                           new String[]{ name }, ssh.connect(id), true );

        return result;
    }

    /**
     * change password of your system user
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/user-change-password" , consumes = "application/json", produces = "application/json")
    public String changePassword(@RequestHeader("id") String id, @RequestBody Map<String, String> data ) {
        String name = data.getOrDefault("name","");
        String password = data.getOrDefault("password","");

         ssh.executeCommand("set_password_to_ftp_account", new String[]{name, password}, ssh.connect(id), true);
        return "Password Changed!";
      }

    /**
     * change path of your system user
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/user-change-path" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> changePath(@RequestHeader("id") String id, @RequestBody Map<String, String> data ) {
        String name = data.getOrDefault("name","");
        String path = data.getOrDefault("path","");
        Connection connection = ssh.connect(id);
        ssh.executeCommand("ftp_set_directory", new String[]{path, name.trim()}, connection, false);
        return getUsersList(connection);
    }

    /**
     * remove user from your system
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/remove-user")
    public List<Map<String,String>> removeUser(@RequestHeader("id") String id, HttpServletRequest request ) {
        String name = request.getParameter("name");
        Connection connection = ssh.connect(id);
        ssh.executeCommand("remove_ftp_account", new String[]{name.trim()}, connection, false);

        return getUsersList(connection);
    }

    /**
     * add new user to your system
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/add-new-user" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> addUser(@RequestHeader("id") String id, @RequestBody Map<String, String> data ) {
        String name = data.getOrDefault("name","");
        String password = data.getOrDefault("password","");
        String path = data.getOrDefault("path","");

        LinkedHashMap<String, String[]> map21 = new LinkedHashMap<>(){{
            put("add_ftp_account", new String[]{name});
            put("set_password_to_ftp_account", new String[]{name, password});

            if(path != null && !path.isEmpty())
             put("ftp_set_directory", new String[]{path, name});

            put("add_user_to_group", new String[]{name, "www-data"});
        }};

        Connection connection = ssh.connect(id);
        ssh.executeCommandMultiple(connection,map21);


        return getUsersList(connection);
    }

    /**
     * will get the users list and put in this format List<Map<String,String>>
     * @param connection
     * @return
     */
    private List<Map<String,String>> getUsersList(Connection connection){
        String data = ssh.executeCommand("view_ftp_account", new String[]{}, connection, true );
        String[] listSplit = data.split("\\r?\\n");
        List<Map<String,String>> list = new ArrayList<>();
        for(String s : listSplit){
            //if(!s.contains("root")) {
                String[] split1 = s.split(":");
                list.add(new HashMap<>(){{
                    put("name",s.contains(":")? split1[0]: s);
                    put("path",split1.length>1? split1[1]: "");
                }});
            //}
        }
        return list;
    }
}
