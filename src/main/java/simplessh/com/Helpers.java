package simplessh.com;


import javax.swing.*;
import java.io.*;
import java.util.List;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


/**
 * @author Corneli F.
 *
 * Helpers file
 */
public class Helpers {



 public static String getJarPath(){
       String path = Helpers.class.getProtectionDomain().getCodeSource().getLocation().getPath();
       String newPath = "";
       try {

           String[] split = path.split("/");
           for (int i = 0; i < split.length - 1; i++) {
               if (!split[i].isEmpty())
                   newPath = i == 0 ? "/" + split[i] : newPath + "/" + split[i];
           }

       }catch (Exception e){newPath = ".";}
     return newPath;
 }



    /**
     * According to the syntax of the shell command, the string is escaped by
     * enclosing it with single quote.
     *
     * eg. 11'22 ==> '11'\''22'
     *
     *
     */
    public static String escapeShellSingleQuoteString(String s, boolean addOuterQuote) {
        String replace = s.replace("'", "'\\''");
        return addOuterQuote ?  "'" + replace + "'" : replace;
    }


     public static String getFileSize(String val){
        val = val.trim().replaceAll(" +", " ");
        String typeSize = "kb";
        long sizefinal = 4;

       try{
            String[] sizeGet = val.split(" ");
            String sd = sizeGet[3].replace("kB","");

            if(isNumeric(sd)){
                sizefinal = Long.parseLong(sd);
               if(sizefinal > 1000l && sizefinal<1000000l){
                   typeSize = "MB";
                   sizefinal = sizefinal/1000l;
               }else if(sizefinal > 1000000l ){
                   typeSize = "GB";
                   sizefinal = sizefinal/1000000l;
               }
           }
       }catch (Exception e){ System.out.println("err size:"+e); }

       return  sizefinal +typeSize;
   }

    public static  boolean isNumeric(String str) {
        return str.matches("-?\\d+(\\.\\d+)?");  //match a number with optional '-' and decimal.
    }

    public static String getFileInfo(String fullRow, Integer splitKey) {
        String[] split = fullRow.replaceAll(" +", " ").split(" ");
        try{
            StringJoiner date = new StringJoiner(" ");
            for (int i=4;i<split.length;i++)
                date.add(split[i]);

            return splitKey==null? split[0]+"; "+split[2]+"; "+date.toString() : split[splitKey];
        }catch (Exception e){
            return fullRow;
        }
    }

    /**
     * According to the syntax of the shell command, the string is escaped by
     * enclosing it with double quote.
     *
     * eg. 11\22"33$44`55 ==> "11\\22\"33\$44\`55"
     *
     *
     */
    public static String escapeShellDoubleQuoteString(String s ) {
        final List<String> targets = Arrays.asList( "\"", "$", "`");
        String escape = escape(s, "\\", targets);
          escape = escape.replace("'", "'\\''");
          //escape = escape.replaceAll("\\\"", "\\\\\"");

        return  escape;
    }

    private static String escape(String s, String escaper, List<String> targets) {
        s = s.replace(escaper, escaper + escaper);
        for (String t : targets) {
            s = s.replace(t, escaper + t);
        }
        return s;
    }


    /**
     * Get comand from json and convert them in full comand
     * @param name
     * @param array
     * @return
     */



    public static String getFileContent(File file){
        if (!file.exists() ) { //&& !file.mkdirs()
            return "";
        }
        String data = "";

        try{
            BufferedReader br = new BufferedReader(new FileReader(file));
            String line;

            while ((line = br.readLine()) != null) {
                data = data + line;
            }
            br.close();

        }catch (Exception e){
            System.out.println( "Error read file: " + e);
            return "";
        }
        return data;
    }
/*
    public static List<ConfigAccount> getConfigAccounts(){
        String json = Helpers.getFileContent(new File(getJarPath()+"/config/config.json"));

        if(!json.isEmpty()) {
           try{
             Type type = new TypeToken<List<ConfigAccounts>>(){}.getType();
             return (new Gson()).fromJson(json, type);
           }catch (Exception e){
               System.out.println("Error getting data:"+e.getMessage());
           }
       }
      return new ArrayList<>();
    }

    private void updateFile (List<ConfigAccounts> acc){
        //save data to config.json
        File directory = new File(Helpers.getJarPath()+"/config/");
        if (! directory.exists())
            directory.mkdir();

        try{
            Gson gson = new GsonBuilder().serializeNulls().create();
            String content = gson.toJson(acc);

            FileWriter myWriter = new FileWriter( Helpers.getJarPath()+"/config/config.json");
            myWriter.write(content);
            myWriter.close();
        } catch (Exception e){
            System.out.println("Error save file:"+e);
        }

    }


    public static String getConfigData(String id, String key){
        String json = Helpers.getFileContent(new File(getJarPath()+"/config/config.json"));
        if(json.isEmpty())
            return "";
            try{
                Type type = new TypeToken<List<ConfigAccounts>>() {}.getType();
                List<ConfigAccounts> map = (new Gson()).fromJson(json, type);
                if(map.size()>0){
                    ConfigAccounts conf= map.stream().filter(e->e.getId().compareTo(id)==0).
                                                            findAny().orElse(null);
                    return conf != null? conf.getByName(key) :"";
                 }

            }catch (Exception e){ }

        return "";
     }*/
 
    public static void showHideTimmer(JComponent node){
        node.setVisible(true);
        ScheduledExecutorService executor =  Executors.newSingleThreadScheduledExecutor();
        executor.schedule(
                () -> node.setVisible(false)
                , 3
                , TimeUnit.SECONDS);
    }
 

    public static String getAlphaNumericString(int n) {

        // chose a Character random from this String
        String AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "0123456789"
                + "abcdefghijklmnopqrstuvxyz";

        // create StringBuffer size of AlphaNumericString
        StringBuilder sb = new StringBuilder(n);

        for (int i = 0; i < n; i++) {

            // generate a random number between
            // 0 to AlphaNumericString variable length
            int index
                    = (int)(AlphaNumericString.length()
                    * Math.random());

            // add Character one by one in end of sb
            sb.append(AlphaNumericString
                    .charAt(index));
        }

        return sb.toString();
    }



}
