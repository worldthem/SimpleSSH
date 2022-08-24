package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.dao.Connection;
import simplessh.com.request.AddUpdateRow;
import simplessh.com.response.GetTableFullData;
import simplessh.com.response.ListMapResponse;
import simplessh.com.response.ListStringResponse;
import simplessh.com.services.RunCommand;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
/**
 * @author Corneli F.

 * Data base controller
 */
@RestController
@RequestMapping("/api/v1/")
public class DatabaseTables {
    @Autowired
    private RunCommand ssh ;
    private Integer perPage =100;

    /**
     * get list of database or tables
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/get-list-of-database-tables")
    public List<String> getList(@RequestHeader("id") String id, HttpServletRequest request) {

        return getDataList(ssh.connect(id), request.getParameter("database"));
    }

    /**
     * convert to List<Map<String,String>>
     * @param database name of database
     * @return
     */
    private List<String> getDataList(Connection connection, String database){
      String data = ssh.executeCommand("mysql_show_table_from_db",
                                        new String[]{database}, connection,true );

        data = data.trim().replaceAll("\t", " ");

        List<String> rows = new ArrayList<>();
        String[] split = data.split("\\r?\\n");
        for(String st : split){
            if(!st.isEmpty() && !st.contains("Tables_in_"+database)){
              rows.add(st);
            }
        }

        return rows;
    }

    /**
     * add new table for database
     * @param id
     * @param data
     * @param request
     * @return
     */
    @PutMapping(path = "/add-new-database-table", consumes = "application/json", produces = "application/json")
    public ListStringResponse addNewDatabase(@RequestHeader("id") String id, @RequestBody List<Map<String,String>> data,
                                                    HttpServletRequest request) {

       String databaseName = request.getParameter("database");
       String tableName = request.getParameter("table");
       String sql =  "CREATE TABLE IF NOT EXISTS "+databaseName+"."+tableName+" ("+generateSqlForFields(data)+")";
       Connection connection = ssh.connect(id);
       String response = ssh.executeCommand("mysql_command", new String[]{sql}, connection, false );

       return new ListStringResponse(getDataList(connection, databaseName),response);
    }

    /**
     * litle helper will generate sql for fields of table when add new table
     * example: title varchar(255) NOT NULL, start_date DATE
     * @param data
     * @return
     */
    private String generateSqlForFields( List<Map<String,String>> data){
        String keyName = "";
        StringJoiner sqlFields = new StringJoiner(",");
        for(Map <String, String> entry : data){
            String name =   entry.getOrDefault("fname","");
            String type =  entry.getOrDefault("ftype","");
            String collation = entry.getOrDefault("fcollation","");
            String length =  entry.getOrDefault("flength","");
            String nullData =  entry.getOrDefault("fnull","");
            String defaultData =  entry.getOrDefault("fdefault","");
            String primaryKey = entry.getOrDefault("fprimary","");
            String autoIncrement = entry.getOrDefault("fautoincrement","");

            // check if is text than not need length
            String fieldSql =  !type.contains("TEXT")&!type.contains("DATE") && !type.contains("TIME") &&
                    !type.contains("YEAR") && !type.contains("JSON")&& !type.contains("BOOLEAN") ?
                    "("+length+") "+(!collation.isEmpty() ? " COLLATE "+collation:""): "";

            if(!defaultData.isEmpty())
                fieldSql = type+fieldSql+" DEFAULT '"+defaultData+"'"+(nullData.isEmpty()?" NOT NULL":"");

            if(defaultData.isEmpty() && !nullData.isEmpty())
                fieldSql = type+fieldSql+" DEFAULT NULL" ;

            if(defaultData.isEmpty() && nullData.isEmpty())
                fieldSql = type+fieldSql+" NOT NULL" ;

            sqlFields.add(name+" "+fieldSql+(!autoIncrement.isEmpty()?" AUTO_INCREMENT":""));

            if(!primaryKey.isEmpty()){
                keyName = name;
            }
        }

        if(!keyName.isEmpty())
        sqlFields.add("PRIMARY KEY("+keyName+")");

        return  sqlFields.toString();
    }

    /**
     * remove table from database
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/remove-database-table")
    public ListStringResponse remove(@RequestHeader("id") String id, HttpServletRequest request) {
        String databaseName = request.getParameter("database");
        String tableName = request.getParameter("table");
        Connection connection = ssh.connect(id);
        String response = ssh.executeCommand("mysql_delete_table", new String[]{ databaseName+"."+tableName}, connection, false );
        return new ListStringResponse(getDataList(connection, databaseName),response);
    }

    /**
     * get list of columns from table
     * @param request
     * @return
     */
    @GetMapping("/get-list-of-database-table-structure")
    public List<Map<String,String>> getListStructure(@RequestHeader("id") String id, HttpServletRequest request) {

        String databaseName = request.getParameter("database");
        String tableName = request.getParameter("table");
         Connection connection = ssh.connect(id);

        return getListOfColumnsIMPL(connection,databaseName, tableName);
    }

    private List<Map<String,String>> getListOfColumnsIMPL(Connection connection, String databaseName,String tableName){
        String data = ssh.executeCommand("mysql_show_column_from_table_from_db",
                new String[]{ databaseName+"."+tableName }, connection, true );

     return getListOfColumnsPRC(data);
    }

    /**
     * will transform the string bellow in  List<Map<String,String>>
     * Field  Type	         Null	Key	  Default	 Extra
     * e1     int	         NO	    PRI	  NULL	     auto_increment
     * e2	  varchar(255)  YES	          NULL
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

    /**
     * remove column from table
     * @param request
     * @return
     */
    @DeleteMapping("/remove-database-table-column")
    public ListMapResponse removeField(@RequestHeader("id") String id, HttpServletRequest request) {
        String databaseName = request.getParameter("database");
        String tableName = request.getParameter("table");
        String column = request.getParameter("column");
        Connection connection = ssh.connect(id);
        String response = ssh.executeCommand("mysql_delete_field_from_table",
                           new String[]{ databaseName+"."+tableName, column}, connection, false );

        return new ListMapResponse(getListOfColumnsIMPL(connection,databaseName, tableName), response);
    }

    /**
     * add edit table column
     * @param data
     * @param request
     * @return
     */
    @PutMapping(path = "/add-edit-database-table-column", consumes = "application/json", produces = "application/json")
    public ListMapResponse addEditDatabase(@RequestHeader("id") String id, @RequestBody List<Map<String,String>> data,
                                             HttpServletRequest request) {

        String databaseName = request.getParameter("database");
        String tableName = request.getParameter("table");
        String typeEditAdd = request.getParameter("typeEditAdd");

        String sql = typeEditAdd.contains("add")?
                      "Alter table "+databaseName+"."+tableName+" ADD( "+generateSqlForFields(data)+" )":
                      "Alter table "+databaseName+"."+tableName+" MODIFY "+generateSqlForFields(data);
        Connection connection = ssh.connect(id);
        String response = ssh.executeCommand("mysql_command", new String[]{sql}, connection, false);
        return new ListMapResponse(getListOfColumnsIMPL(connection,databaseName, tableName), response);
    }


    /**
     * get list of table data
     * @param request
     * @return
     */
    @GetMapping("/get-list-of-database-table-data")
    public GetTableFullData getListData(@RequestHeader("id") String id, HttpServletRequest request) {
        String databaseName = request.getParameter("database");
        String tableName = request.getParameter("table");
        String page = request.getParameter("page");

        Integer pageNr = Integer.parseInt(page);
        Integer pination = pageNr==1? 0 : ((pageNr - 1) * perPage);
        GetTableFullData retturnDAta ;

        String dataSplit = ssh.executeCommand( "mysql_show_data_first_call",
                                  new String[]{databaseName+"."+tableName,  pination+", "+perPage}, ssh.connect(id),true );

        try{

                String[] split =  dataSplit.split("---------split---------");
                 // get total of rows
                String[] countSplit =  split[1].split("\\r?\\n");
                String totalRows = countSplit[1].trim();
                       totalRows = totalRows.contains("COUNT") ? countSplit[2].trim() : totalRows;

            retturnDAta = new GetTableFullData(getListOfColumnsPRC(split[0]),// get list of columns
                                            getListOfColumnsPRC(split[2]), // get list of data
                                            totalRows
                                            );
                }catch (Exception e){

            retturnDAta = new GetTableFullData();
                }

         return retturnDAta;
        /*
        String data = ssh.executeCommand("mysql_show_column_from_table_from_db",
                             new String[]{ databaseName+"."+tableName }, false, false);
         getListOfColumnsPRC(data);

        //select '---------split---------' AS '';
         */

        //return new ListMapResponse(getListOfDataIMPL(databaseName, tableName, "0"), totalRows );
    }



    /**
     * add data in the table
     * @param data
     * @param request
     * @return
     */
    @PutMapping(path = "/add-new-data-to-table", consumes = "application/json", produces = "application/json")
    public ListMapResponse addDataInTheTable(@RequestHeader("id") String id, @RequestBody AddUpdateRow data,
                                                       HttpServletRequest request) {

        String databaseName = request.getParameter("database");
        String tableName = request.getParameter("table");
        String typeBtn = request.getParameter("typeBtn");

        String page = request.getParameter("page");

        Integer pageNr = Integer.parseInt(page);
        Integer pination = pageNr==1? 0 : ((pageNr - 1) * perPage);

        StringJoiner columns = new StringJoiner(", ");
        StringJoiner values  = new StringJoiner(", ");
        StringJoiner updateData  = new StringJoiner(", ");

        for(Map.Entry<String,String> entry:data.getData().entrySet()){
            String val = entry.getValue();
            if(!val.isEmpty() && val.compareTo("NULL")!=0){
                columns.add(entry.getKey());
                val = val.replaceAll("\\\\", "\\\\\\\\\\\\\\\\").replaceAll("'", "\\\\'").replaceAll("\"", "\\\\\"").replaceAll("\\$", "\\\\\\$");
                values.add("'"+val+"'");
            }

            if(val.compareTo("NULL") != 0)
              updateData.add("p."+entry.getKey()+" = '"+val+"'");

        }

        String sql = typeBtn.contains("add") ?
                   "SET NAMES 'utf8'; INSERT INTO " + databaseName + "." + tableName + " ( " + columns + ") VALUES (" + values + ")":
                   "SET NAMES 'utf8'; UPDATE " + databaseName + "." + tableName + " p SET " + updateData + " WHERE " + data.getWhere();

        Connection connection = ssh.connect(id);
        String response = ssh.executeCommand("mysql_command", new String[]{sql}, connection, false);

        String rows = ssh.executeCommand("mysql_show_data_from_table",
                         new String[]{ databaseName+"."+tableName, pination+","+perPage }, connection, true);

        return new ListMapResponse(getListOfColumnsPRC(rows), response);
    }


    /**
     * remove table row
     * @param request
     * @return
     */
    @DeleteMapping("/remove-database-row")
    public ListMapResponse removeDatabaseRow(@RequestHeader("id") String id, HttpServletRequest request) {
        String databaseName = request.getParameter("database");
        String tableName = request.getParameter("table");
        String where = request.getParameter("where");
        String page = request.getParameter("page");

        Integer pageNr = Integer.parseInt(page);
        Integer pination = pageNr==1? 0 : ((pageNr - 1) * perPage);

        String sql =  "DELETE FROM " + databaseName + "." + tableName + " p WHERE " + where;
        Connection connection = ssh.connect(id);
        String response = ssh.executeCommand("mysql_command",
                                     new String[]{ sql}, connection, false);


        String rows = ssh.executeCommand("mysql_show_data_from_table",
                new String[]{ databaseName+"."+tableName, pination+","+perPage }, connection, true);

        return new ListMapResponse(getListOfColumnsPRC(rows), response);
    }

    /**
     * add data in the table
     * @param data
     * @param data
     * @return
     */
    @PutMapping(path = "/execute-query", consumes = "application/json", produces = "application/json")
    public ListMapResponse addDataInTheTable(@RequestHeader("id") String id, @RequestBody Map<String ,String>data ) {
        String sql = "SET NAMES 'utf8'; "+data.getOrDefault("query","");

        Map<String, String> rows = ssh.executeCommandErr("mysql_command",
                new String[]{ sql }, ssh.connect(id), true );

        return new ListMapResponse( getListOfColumnsPRC(rows.get("data")), rows.get("error"));
    }
}
