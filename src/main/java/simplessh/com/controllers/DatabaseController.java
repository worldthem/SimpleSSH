package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import simplessh.com.dao.Connection;
import simplessh.com.dao.DownloadFile;
import simplessh.com.request.DataBaseNewRequest;
import simplessh.com.services.RunCommand;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Corneli F.
 *
 * Database controller
 */
@RestController
@RequestMapping("/api/v1/")
public class DatabaseController {

    @Autowired
    private RunCommand ssh;

    private String[] privilegies = {"ALL PRIVILEGES","CREATE","DROP","DELETE","INSERT","SELECT","UPDATE" };

    /**
     * Get list of database list
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/get-list-of-database-users")
    public List<Map<String,String>> getList(@RequestHeader("id") String id, HttpServletRequest request) {
        String type=request.getParameter("dataType");

        String data = ssh.executeCommand(type.contains("database")? "mysql_dbList_full":"mysql_show_users_list",
                                          new String[]{""}, ssh.connect(id),true );
        return getDataList(data);
    }


    /**
     * parse string and transform to list of map
     * convert to List<Map<String,String>>
     * @param data
     * @return
     */
    private List<Map<String,String>> getDataList(String data){
        data = data.trim().replaceAll("\t", " ");

        List<Map<String,String>> rows = new ArrayList<>();
        String[] split = data.split("\\r?\\n");
        for(String st : split){
            Map<String, String> map = new HashMap<>();
            if(st.contains(" ")){
                String[] split1 = st.split(" ");
                map.put("name",split1[0]);
                map.put("host",split1.length>2? split1[2] : split1[1]);
                map.put("user",split1[1]);
            }else{
                map.put("name",st);
                map.put("host","");
                map.put("user", "");
              }

            if(rows.stream().filter(e->e.get("name").compareTo(map.get("name"))==0).collect(Collectors.counting())==0 &&
               "Database".compareTo(map.get("name"))!=0 && "sys".compareTo(map.get("name"))!=0 &&
               "mysql".compareTo(map.get("name"))!=0 && "db".compareTo(map.get("name"))!=0 &&
               "performance_schema".compareTo(map.get("name"))!=0 && "information_schema".compareTo(map.get("name"))!=0 &&
               "mysql.session".compareTo(map.get("name"))!=0 && "mysql.sys".compareTo(map.get("name"))!=0 &&
               "mysql.infoschema".compareTo(map.get("name"))!=0 && "debian-sys-maint".compareTo(map.get("name"))!=0 &&
               "User".compareTo(map.get("name"))!=0
            )
            rows.add(map);
         }

     return rows;
   }


    @PutMapping(path = "/add-new-database", consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> addNewDatabase(@RequestHeader("id") String id, @RequestBody DataBaseNewRequest data) {
        String privileges = data.getPrivileges() == null ? "ALL PRIVILEGES" :
                                       String.join(",", data.getPrivileges());

        LinkedHashMap<String, String[]> map2 = new LinkedHashMap<>(){{
            put("mysql_new_database", new String[]{data.getName()});
            put("mysql_new_user", new String[]{data.getUser(), data.getHost(), data.getPassword()});
            put("mysql_user_grand_permision", new String[]{privileges, data.getName(), "'"+data.getUser() +"'@'"+data.getHost()+"'"});
            put("mysql_flush", new String[]{});
        }};

        Connection connection = ssh.connect(id);
        ssh.executeCommandMultiple(connection,map2);

        String dbListWithUsers = ssh.executeCommand( "mysql_dbList_full", new String[]{""}, connection,true);
        return getDataList(dbListWithUsers);
    }

    /**
     * remove a database
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/remove-database")
    public List<Map<String,String>> removeDatabase(@RequestHeader("id") String id, HttpServletRequest request) {
        String name = request.getParameter("name");

        LinkedHashMap<String, String[]> map2 = new LinkedHashMap<>(){{
            put("mysql_remove_db", new String[]{name});
            put("mysql_remove_db_from_sql_table", new String[]{name});
            put("mysql_flush", new String[]{});
        }};
        Connection connection = ssh.connect(id);
        ssh.executeCommandMultiple(connection,map2);

        String data = ssh.executeCommand("mysql_dbList_full", new String[]{""}, connection,true);
        return getDataList(data);
    }

    /**
     * export data from database
     * @param request
     * @param response
     * @throws IOException
     */

    @RequestMapping("/export-database")
    public void downloadPDFResource(HttpServletRequest request, HttpServletResponse response ) throws IOException {
        String name= request.getParameter("name");
        // check if path /var/easyvps path exist and open the connection
        Connection connection = ssh.connect(request.getParameter("id"));
        ssh.checkForVarEasyvpsPath(connection);

        LinkedHashMap<String, String[]> map1 = new LinkedHashMap<>(){{
            put("new_empty_file", new String[]{"/var/easyvps/"+name+".sql"});
            put("file_permission", new String[]{"666","/var/easyvps/"+name+".sql"});
            put("mysql_export", new String[]{name, "/var/easyvps/"+name+".sql"});
        }};

        ssh.executeCommandMultiple(connection,map1);

        String mimeType = "application/octet-stream";
        response.setContentType(mimeType);
        response.setHeader("Content-Disposition", String.format("inline; filename=\"" + name + ".sql\""));

        DownloadFile inp= ssh.downloadFileStream("/var/easyvps/"+name+".sql", connection);
        FileCopyUtils.copy(inp.getFile(), response.getOutputStream());

        ssh.disconnectSFTP(inp.getChannelDownload(),
                           inp.getChannelSftpDownload(),
                           connection.getSession());
    }

    /**
     * import data to database
     * @param id
     * @param request
     * @param file
     * @return
     */
    @PutMapping(path = "/import-database")
    public String importDb(@RequestHeader("id") String id, HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        String dbname= request.getParameter("dbname");
        // check if path /var/easyvps path exist
        Connection connection = ssh.connect(id);

        ssh.checkForVarEasyvpsPath(connection);

        Map<String, InputStream> listF = new HashMap<>();
        try {
            listF.put(file.getOriginalFilename(), file.getInputStream());
        }catch (Exception e){}

        ssh.uploadFile(listF,  "/var/easyvps/", connection );

        try{Thread.sleep(2000);}catch (Exception e){}

        LinkedHashMap<String, String[]> map2 = new LinkedHashMap<>(){{
            put("file_permission", new String[]{"666","/var/easyvps/"+file.getOriginalFilename()});
            put("mysql_import", new String[]{dbname, "/var/easyvps/"+file.getOriginalFilename()});
        }};

        ssh.executeCommandMultiple(connection, map2);
        ssh.disconnect(connection.getSession());

        return "Data base imported.";
    }

    /**USERS PART**/

    /**
     * get list of database
     * @return
     */
    @GetMapping("/get-list-of-mysql-database")
    public List<Map<String,String>> getListOfDb(@RequestHeader("id") String id) {
        String dataDb = ssh.executeCommand("mysql_dbList",  new String[]{""}, ssh.connect(id), true);
        return getDataList(dataDb);
    }

    /**
     * add new user and asign to database
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/add-new-database-user", consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> addNewDatabaseUser(@RequestHeader("id") String id, @RequestBody DataBaseNewRequest data) {
        String privileges = data.getPrivileges() == null ? "ALL PRIVILEGES" :
                String.join(",", data.getPrivileges());

        LinkedHashMap<String, String[]> map2 = new LinkedHashMap<String, String[]>(){{
            put("mysql_new_user", new String[]{data.getUser(), data.getHost(), data.getPassword()});
            put("mysql_user_grand_permision", new String[]{privileges, data.getName(), "'"+data.getUser() +"'@'"+data.getHost()+"'"});
            put("mysql_flush", new String[]{});
        }};

        Connection connection = ssh.connect(id);
        ssh.executeCommandMultiple(connection,map2);

        String dbListWithUsers = ssh.executeCommand("mysql_show_users_list", new String[]{""}, connection,true);
        return getDataList(dbListWithUsers);
    }

    /**
     * remove user
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/remove-database-user")
    public List<Map<String,String>> removeDatabaseUser(@RequestHeader("id") String id, HttpServletRequest request) {
        String name = request.getParameter("name");

        Connection connection = ssh.connect(id);
        ssh.executeCommand("mysql_delete_user", new String[]{name}, connection,false);
        String data = ssh.executeCommand("mysql_dbList_full", new String[]{""}, connection,true);
        return getDataList(data);
    }

    /**
     * chance user password
     * @param id
     * @param data
     * @return
     */

    @PutMapping(path = "/user-mysqldb-change-password", consumes = "application/json", produces = "application/json")
    public String changePassDatabaseUser(@RequestHeader("id") String id, @RequestBody Map<String,String> data) {
        String name = data.getOrDefault("name","");
        String host = data.getOrDefault("host","");
        String password = data.getOrDefault("password","");

        LinkedHashMap<String, String[]> map = new LinkedHashMap<>(){{
            put("mysql_user_change_password", new String[]{"'"+name+"'@'"+host+"'", password});
            put("mysql_old_user_change_password", new String[]{"'"+name+"'@'"+host+"'", password});
            put("mysql_flush", new String[]{});
        }};
        Connection connection = ssh.connect(id);
        ssh.executeCommandMultiple(connection,map);
        ssh.disconnect(connection.getSession());

        return "Password changed, if not than enter a password what contain one or more upper case letter, lower case letter, @, and numbers!" ;
    }
}
