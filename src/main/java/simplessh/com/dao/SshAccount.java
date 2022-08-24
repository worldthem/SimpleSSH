package simplessh.com.dao;

public class SshAccount {
    private String sshHost;
    private String platform;
    private String sshLog;
    private String sshPass;
    private String mysqlLog;
    private String mysqlPass;
    private String id;

    public String getByName(String name){
        switch (name)
        {    case "id":
               return id;
             case "sshHost":
                return sshHost;
             case "platform":
                return platform;
             case "sshLog":
                return sshLog;
            case "sshPass":
                return sshPass.replace("(","\\(").replace(")","\\)").replace("$","\\$");

            case "mysqlLog":
                return mysqlLog;
            case "mysqlPass":
                return mysqlPass;
             default:
                return "";

        }
    }

    public String getId() {
        return id== null? "":id;
    }
    public void setId(String id) {
        this.id = id;
    }


    public String getSshHost() {
        return sshHost == null? "": sshHost;
    }

    public void setSshHost(String sshHost) {
        this.sshHost = sshHost;
    }

    public String getPlatform() {
        return platform == null? "": platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getSshLog() {
        return sshLog  == null? "": sshLog;
    }

    public void setSshLog(String sshLog) {
        this.sshLog = sshLog;
    }

    public String getSshPass() {
        return sshPass == null? "":  sshPass;
    }

    public void setSshPass(String sshPass) {
        this.sshPass = sshPass;
    }

    public String getMysqlLog() {
        return mysqlLog  == null? "": mysqlLog;
    }

    public void setMysqlLog(String mysqlLog) {
        this.mysqlLog = mysqlLog;
    }

    public String getMysqlPass() {
        return mysqlPass  == null? "": mysqlPass;
    }

    public void setMysqlPass(String mysqlPass) {
        this.mysqlPass = mysqlPass;
    }
}
