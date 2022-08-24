package simplessh.com.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import simplessh.com.Helpers;
import simplessh.com.dao.SshAccount;
import simplessh.com.services.KeyStoreService;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileWriter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Corneli F.
 *
 * SSH accounts controller
 */

@RestController
@RequestMapping("/api/v1/")
public class SshAccountsController {

    @Autowired
    private KeyStoreService keyStoreService;

    /**
     * get list of ssh account
     * @return
     */
    @GetMapping("/get-list-of-accounts")
    public List<SshAccount> getList() {
         List<SshAccount> acc = keyStoreService.getSshAcconts();

        acc.forEach(e->{  e.setSshPass("*****"); if(!e.getMysqlPass().isEmpty()) e.setMysqlPass("*****"); });

        return acc;
    }

    /**
     * insert update ssh account
     * @param data
     * @return
     */
    @PutMapping(path = "/add-update-settings-account", consumes = "application/json", produces = "application/json")
    public List<SshAccount> addDataInTheTable(@RequestBody SshAccount data ) {
        List<SshAccount> acc = keyStoreService.getSshAcconts();
        if(data.getId().isEmpty()){
            data.setId(Helpers.getAlphaNumericString(7));
            acc.add(data);
        }else{
            acc.forEach(e->{  if(e.getId().compareTo(data.getId())==0){
                                 e.setPlatform(data.getPlatform());
                                 e.setSshHost(data.getSshHost());
                                 e.setSshLog(data.getSshLog());
                                 if(data.getSshPass().compareTo("*****")!=0)
                                   e.setSshPass(data.getSshPass());

                                 e.setMysqlLog(data.getMysqlLog());
                                 if(data.getMysqlPass().compareTo("*****")!=0)
                                   e.setMysqlPass(data.getMysqlPass());
            }});

        }

        //save data to keystore unde the entry name: sshAccounts
        keyStoreService.setKeyStoreValue("sshaccounts", (new Gson()).toJson(acc));

        List<SshAccount> returnData = acc;
        returnData.forEach(e->{  e.setSshPass("*****"); if(!e.getMysqlPass().isEmpty()) e.setMysqlPass("*****"); });

        return returnData;
    }

    /**
     * remove ssh account by key
     * @param request
     * @return
     */
    @DeleteMapping("/remove-setting-account")
    public List<SshAccount> removeAccount(HttpServletRequest request) {
        String id = request.getParameter("id");
        List<SshAccount> acc = keyStoreService.getSshAcconts().stream().filter(e->e.getId()
                                          .compareTo(id)!=0).collect(Collectors.toList());

        //save data to keystore unde the entry name: sshaccounts
         keyStoreService.setKeyStoreValue("sshaccounts", (new Gson()).toJson(acc));

        acc.forEach(e->{  e.setSshPass("*****"); if(!e.getMysqlPass().isEmpty()) e.setMysqlPass("*****"); });

        return acc;
    }

    /**
     * get list for bottom select
     * @return
     */
    @GetMapping("/get-header-list-of-accounts")
    public List<SshAccount> getListHeader() {
        List<SshAccount> acc = keyStoreService.getSshAcconts();
        acc.forEach(e->{  e.setSshPass("");  e.setMysqlLog("");   e.setMysqlPass(""); });
        return acc;
    }


}
