package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.response.ListMapResponse;
import simplessh.com.services.RunCommand;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @author Corneli F.
 *
 * Terminal controller
 */

@RestController
@RequestMapping("/api/v1/")
public class TerminalController {
    @Autowired
    private RunCommand ssh ;

    /**
     * execute ny comand you enter and return the result
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/execute-command" , consumes = "application/json", produces = "application/json")
    public ListMapResponse executeCommmand(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
        String name = data.getOrDefault("name","");
        String mysql = data.getOrDefault("mysql","");

        Map<String, String> result= ssh.executeCommandErr( (!mysql.isEmpty()?   "mysql_command" :"commandline"), new String[]{name}, ssh.connect(id),true);

        ListMapResponse response = new ListMapResponse();
        if(!mysql.isEmpty() && name.toLowerCase(Locale.ROOT).contains("select")){
            response.setRows(getListOfColumnsPRC(result.get("data")));
            response.setResponse(result.get("error"));
        }else {
            response.setRows(new ArrayList<>());
            response.setResponse(result.get("data"));
        }


        return response;
    }

    /**
     * this is when you execute the sql command and it will return the result in nice table format
     *
     * @param data
     * @return
     */

    private List<Map<String,String>> getListOfColumnsPRC(String data){
        data = data.trim().replaceAll("\t", "~~@~~");
        String[] listSplit =  data.split("\\r?\\n");
        String header[] = listSplit[0].split("~~@~~");

        List<Map<String,String>> res= new ArrayList<>();

        for(int i=0;i<listSplit.length;i++){
            if (i > 0) {
                String[] splitRows= listSplit[i].split("~~@~~");
                Map<String,String> map = new HashMap<>();
                try{
                    for(int j=0; j<header.length;j++) {
                        map.put(header[j], j < splitRows.length ? splitRows[j].replaceAll("\\\\\\\\", "\\\\") : "");
                    }
                }catch(Exception e){System.out.println("err:"+e);}

                res.add(map);
            }
        }

        return res;
    }
}
