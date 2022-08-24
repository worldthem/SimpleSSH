package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.dao.Connection;
import simplessh.com.response.ListMapResponse;
import simplessh.com.services.RunCommand;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.*;

/**
 * @author Corneli F.
 *
 * Firewall controller
 */
@RestController
@RequestMapping("/api/v1/")
public class FirewallController {
    @Autowired
    private RunCommand ssh ;

    /**
     * get list of firewall
     * @param id
     * @return
     */
   @GetMapping("/get-list-of-firewall-rules")
    public List<Map<String,String>> getList(@RequestHeader("id") String id) {
         return getDataList(ssh.connect(id));
    }

    /**
     * enable disable firewall
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/enable-disable-firewall")
    public List<Map<String,String>> actionData(@RequestHeader("id") String id, HttpServletRequest request ) {
        String actionBtn = request.getParameter("actionBtn");

        Connection connection = ssh.connect(id);
        if(actionBtn.contains("disable")) {
            ssh.executeCommand("firewall_disable", new String[]{}, connection,true );
            return new ArrayList<>();
        }

            LinkedHashMap<String, String[]> map21 = new LinkedHashMap<>() {{
                put("firewall_enable", new String[]{""});
                put("firewall_add_rule", new String[]{"ssh/tcp"});
                put("firewall_add_rule", new String[]{"22/tcp"});
                put("firewall_add_rule", new String[]{"2222/tcp"});
                put("firewall_add_rule", new String[]{"Nginx HTTP"});
                put("firewall_add_rule", new String[]{"80/tcp"});
                put("firewall_add_rule", new String[]{"443/tcp"});
                put("firewall_add_rule", new String[]{"143/tcp"});
                put("firewall_add_rule", new String[]{"53/udp"});
                put("firewall_add_rule", new String[]{"53/tcp"});
            }};


            ssh.executeCommandMultiple(connection,map21);

            return getDataList(connection);

    }

    /**
     * add new rule to firewall
     * @param id
     * @param request
     * @return
     */
    @PutMapping(path = "/add-new-firewall-rule")
    public List<Map<String,String>> addNewOne(@RequestHeader("id") String id, HttpServletRequest request) {
        String name = request.getParameter("name");
        Connection connection = ssh.connect(id);
        ssh.executeCommand("firewall_add_rule", new String[]{name}, connection, false );
        return getDataList(connection);
      }

    /**
     * remove rule from firewall
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/remove-firewall-rule")
    public List<Map<String,String>> remove(@RequestHeader("id") String id, HttpServletRequest request ) {
        String name = request.getParameter("name");
        Connection connection = ssh.connect(id);
        ssh.executeCommand("firewall_remove_rule", new String[]{name}, connection, false );
        return getDataList(connection);
    }


    /**
     * firewall list
     * @param connection
     * @return
     */
    private List<Map<String,String>> getDataList(Connection connection){
        List<Map<String,String>> list = new ArrayList<>();

        String data = ssh.executeCommand("firewall_list", new String[]{""}, connection,true );

        data = data.replaceAll("ALLOW","@ALLOW - ")
                .replaceAll("DENY", "@DENY - ")
                .replaceAll("DISABLED", "@DISABLED - ")
                .replaceAll(" +", " ");

        if(data.isEmpty())
            return list;


        String[] listSplit = data.split("\\r?\\n");
        for(String st : listSplit){
            if(st.contains("@")) {
                String[] split1 = st.split("@");

                list.add(new HashMap<>(){{
                    put("name",   split1[0]);
                    put("type",   split1[1]);

                }});
            }
        }
        return list;
    }


}
