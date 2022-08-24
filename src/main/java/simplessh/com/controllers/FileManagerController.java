package simplessh.com.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import simplessh.com.Helpers;
import simplessh.com.dao.Connection;
import simplessh.com.dao.DownloadFile;
import simplessh.com.services.RunCommand;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author Corneli F.
 *
 *
 * File manager controller
 */

@RestController
@RequestMapping("/api/v1/")
public class FileManagerController {

    @Autowired
    private RunCommand ssh;

    /**
     * get list of files folders inside directory
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/get-list-of-files")
    public List<Map<String,String>> getFileFileList(@RequestHeader("id") String id, HttpServletRequest request) {
        String path = request.getParameter("directory");
        return getList(ssh.connect(id),path);
    }

    /**
     * process list
     * @param connection
     * @param path
     * @return
     */
   private List<Map<String,String>> getList(Connection connection, String path){
       String fileList = ssh.executeCommand("show_folder_content_ls_short_and_full", new String[]{path},connection,true );
       List<Map<String,String>> rows = new ArrayList<>();
       try{
           String[] split221 = fileList.split("@@@@@@");
           String[] listSplitShort = split221[0].split("\\r?\\n");
           String[] listSplitLong = split221[1].split("\\r?\\n");

           try{
               for(int j=0; j< listSplitShort.length; j++) {
                      Map<String, String> row = new HashMap<>();
                       row.put("name", listSplitShort[j]);
                       row.put("type", (listSplitLong[j + 2].substring(0, 1).contains("d") ||
                               listSplitLong[j + 2].substring(0, 1).contains("l")) ? "1" : "2");
                       row.put("size", Helpers.getFileSize(listSplitLong[j + 2]));
                       String d = listSplitLong[j + 2].replace(listSplitShort[j], "");

                       row.put("data", Helpers.getFileInfo(d, null));
                       row.put("group", Helpers.getFileInfo(d, 2));
                       row.put("permission", Helpers.getFileInfo(d, 0));
                       rows.add(row);
                }
           }catch (Exception e){ }

       }catch (Exception e){}

       return rows.stream().sorted(Comparator.comparing(e->e.get("type"))).collect(Collectors.toList());
   }


    /**
     * get file content
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/get-file-content")
    public String getFileContent(@RequestHeader("id") String id, HttpServletRequest request) {
        String path = request.getParameter("pathFile");


        Connection conn= ssh.connect(id);
        String content = ssh.getStringFileContent(path, conn);
        ssh.disconnect(conn.getSession());
        return content;
    }

    /**
     * get content put in tmp file and upload to server after move back to directory where was
     * we choos this method because some file are big and this method work fast plus no need to play around with
     * escapes characters
     * @param id
     * @param list
     * @return
     */
    @PutMapping(path = "/save-file-content" , consumes = "application/json", produces = "application/json")
    public String saveContent(@RequestHeader("id") String id, @RequestBody List<Map<String, String>> list) {
        String message = "File updated";

        Connection connection = ssh.connect(id);//open the connection
        try {
           Map<String, List<Map<String, String>>> listMap =
                           list.stream().collect(Collectors.groupingBy(e->e.get("path")));
           listMap.forEach((k,v)->{
                Map<String, InputStream> file =  v.stream().collect(Collectors.toMap(e->e.get("fileName"),
                                                 e->new ByteArrayInputStream(e.get("content").getBytes())));
                 ssh.sftpUpload(connection, file, k, v.get(0).get("owner"));
            });

        } catch (Exception e) {
            System.out.println("An error during the upload:"+e.getMessage());
            message =e.getMessage();
        }finally {
            ssh.disconnect(connection.getSession());
        }

      return message;
    }

    /**
     * rename file folder
     * @param data
     * @return
     */
    @PutMapping(path = "/rename-file" , consumes = "application/json", produces = "application/json")
    public String renameFile(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
       return ssh.executeCommand("rename",
                 new String[]{data.getOrDefault("fromName",""),
                              data.getOrDefault("toName","")},  ssh.connect(id), true );
     }

    /**
     * will create new file or folder
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/new-file-folder" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> newFileFolder(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
        String type = data.getOrDefault("typeNew","");
        Connection connection = ssh.connect(id);
        ssh.executeCommand(type.contains("file") ? "new_empty_file" : "new_directory",
                new String[]{data.getOrDefault("name","") },  connection, false );

        return  getList(connection,data.getOrDefault("currentPath",""));
    }

    /**
     * remove file or follder
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/remove-file-folder" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> removeFileFolder(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
        Connection connection = ssh.connect(id);
        String checkDir= ssh.executeCommand("check_if_directory_exist", new String[]{"/var/trash/"}, connection, false );

        if(!checkDir.contains("yes"))
            ssh.executeCommand("new_directory", new String[]{"/var/trash/"}, connection, false );

            ssh.executeCommand("move",
                new String[]{data.getOrDefault("fileList",""), "/var/trash/"},  connection, false );

        return  getList(connection,data.getOrDefault("currentPath",""));
    }

    /**
     * paste cut file or directory
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/paste-file-folder" , consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> pasteFileFolder(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
        String typePaste=data.getOrDefault("typePaste","");
        Connection connection = ssh.connect(id);
        ssh.executeCommand(typePaste.contains("move") ? "move" : "copy",
                new String[]{data.getOrDefault("fileList",""), data.getOrDefault("currentPath","")},  connection, false );

        return  getList(connection,data.getOrDefault("currentPath",""));
    }

    /**
     * empty file content
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/empty-file-content", consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> emptyFile(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
        Connection connection = ssh.connect(id);
        ssh.executeCommand("empty_file_content",
                      new String[]{data.getOrDefault("filePath","") },  connection, false );

        return  getList(connection,data.getOrDefault("currentPath",""));
    }

    /**
     * change owner of file or directory
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/change-owner-permission", consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> changeOwnerPermission(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
       String type= data.getOrDefault("type","");
       String yesSubPermission= data.getOrDefault("yesSubPermission","");
       String subPermission= data.getOrDefault("subPermission","");
       String paths= data.getOrDefault("filePath","");

       Connection connection = ssh.connect(id);

       if(type.contains("owner")){
        ssh.executeCommand("add_path_file_to_group",
                new String[]{data.getOrDefault("owner",""), paths },  connection, false );
       }else if(type.contains("folder")){
          ssh.executeCommand("file_permission",
               new String[]{data.getOrDefault("permissions",""), paths },  connection, false );

         if(!yesSubPermission.isEmpty() && !subPermission.isEmpty()){
             ssh.executeCommand("all_folders_permission",
                     new String[]{paths, subPermission  },  connection, false );

             ssh.executeCommand("all_files_permission",
                     new String[]{paths, subPermission },  connection, false );
         }

       }else if(type.contains("file")){

           ssh.executeCommand(paths.contains(" ")? "file_permission_all" : "file_permission",
                   new String[]{data.getOrDefault("permissions",""),
                           paths },  connection, false );

       }
        return  getList(connection, data.getOrDefault("currentPath",""));
    }

    /**
     * empty trash
     * @param id
     * @param request
     * @return
     */
    @DeleteMapping("/empty-trash")
    public List<Map<String,String>> emptyTrash(@RequestHeader("id") String id, HttpServletRequest request) {
        String currentUrl = request.getParameter("currentPath");
        Connection connection = ssh.connect(id);
        ssh.executeCommand("empty_trash", new String[]{""}, connection,false );
      return  getList(connection, currentUrl);
    }

    /**
     * put in zip or unzip file or directories
     * @param id
     * @param data
     * @return
     */
    @PutMapping(path = "/add-to-archive-unzip", consumes = "application/json", produces = "application/json")
    public List<Map<String,String>> addToZipUnzip(@RequestHeader("id") String id, @RequestBody Map<String, String> data) {
     String type= data.getOrDefault("type","");
     String filePath= data.getOrDefault("filePath","");
     String currentPath= data.getOrDefault("currentPath","");

     Connection connection = ssh.connect(id);

    if(type.contains("unzip")){
        String end = Stream.of(filePath.split("\\.")).reduce((first, last)->last).get();
        ssh.executeCommand((end.contains("gz") ||end.contains("tar") ? "tarunzip":"unzip"), new String[]{filePath, currentPath}, connection,false );
    }else{
        SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd_HH_mm_ss");
        Date date = new Date(System.currentTimeMillis());
        ssh.executeCommand("zip", new String[]{(currentPath +"/"+ formatter.format(date) + ".zip"), filePath}, connection,false );
    }

    return  getList(connection,currentPath);
   }
    /*
    @GetMapping(value="/download-file", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public @ResponseBody byte[] downloadFile(HttpServletRequest request)  throws IOException {
        ssh.connect();
        String path = request.getParameter("pathFile");
        InputStream stream= ssh.downloadFileStream(path);

        return stream !=null? org.apache.commons.io.IOUtils.toByteArray(stream) :null;
    }*/

    /**
     * upload file to server
     * @param id
     * @param request
     * @param files
     * @return
     */
    @PutMapping(path = "/upload-to-server")
    public List<Map<String,String>> uploadToServer(@RequestHeader("id") String id, HttpServletRequest request,
                                                   @RequestParam("files") MultipartFile[] files) {

        String currentPath= request.getParameter("currentPath");


        Map<String, InputStream> listF = new HashMap<>();

        for(MultipartFile file : files){
           try {
            listF.put(file.getOriginalFilename(), file.getInputStream());
            }catch (Exception e){}
        }

        Connection connection = ssh.connect(id);

        String owner=  ssh.executeCommand("get_folder_group", new String[]{currentPath}, connection,false );

        ssh.sftpUpload(connection,listF, currentPath, owner.trim());
       return  getList(connection,currentPath);
    }

    /**
     * download file
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping("/download-file")
    public void downloadPDFResource( HttpServletRequest request, HttpServletResponse response ) throws IOException {
        String pathToFile= request.getParameter("pathToFile");
        String fileName= request.getParameter("fileName");

        String mimeType = "application/octet-stream";
        response.setContentType(mimeType);
        response.setHeader("Content-Disposition", String.format("inline; filename=\"" + fileName + "\""));

        Connection connection = ssh.connect(request.getParameter("id"));
        DownloadFile downloadFile =ssh.downloadFileStream(pathToFile, connection);
        try {
            InputStream inp= downloadFile.getFile();
            FileCopyUtils.copy(inp, response.getOutputStream());
        }catch (Exception e){

        }


        ssh.disconnectSFTP(downloadFile.getChannelDownload(),
                           downloadFile.getChannelSftpDownload(),
                           connection.getSession());

/*
        Channel channel =  null;
        ChannelSftp channelSftpInt = null;
        ssh.connect();
        try{
            channel=ssh.getSession().openChannel("sftp");
            channel.connect();
            channelSftpInt = (ChannelSftp) channel;
            InputStream inp= channelSftpInt.get(pathToFile);
            FileCopyUtils.copy(inp, response.getOutputStream());
        }catch(Exception e){
            System.out.println("Error Run Download:"+e);
        }finally {
           if(channel != null)
                channel.disconnect();
           if(channelSftpInt != null)
                channelSftpInt.disconnect();
           ssh.disconnect();
        }*/
   }

    /**
     * get size of all files folders inside a directory, very utils staff
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/get-size-folder")
    public String getFolderSize(@RequestHeader("id") String id, HttpServletRequest request) {
       return ssh.executeCommand("get_all_fil_folder_size", new String[]{request.getParameter("directory")}, ssh.connect(id),true );
    }
 }
