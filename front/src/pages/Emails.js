import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import { headers, hideLoad, showLoad, showAlert } from './../Helpers.js';
import axios from 'axios';
import serialize from 'form-serialize';


class Emails extends React.Component {
 sessionStorageName = 'list-of-emails';
 constructor(props) {
       super(props);
       this.state = {rows : [],
                     postfixServer:"",
                     accounts: [],
                     accountType:"",
                     showAdd: "none",
                     sslBox:"none",
                     sslType:""
                      }
 }

   componentDidMount(){
     try{
       let data = sessionStorage.getItem(this.sessionStorageName);
       if(data!=null && data !="")
       this.setState({rows: JSON.parse(data) });
     }catch(err){}
   }

   // getListOfUser
   getData =(e)=>{
     e.preventDefault();
     showLoad();
     axios.get(window.API_URL+'get-list-of-emails',  headers() )
                .then(res => {
                     this.setState({rows: res.data });
                     sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
                     hideLoad();
                  }).catch(error => {
                     alert(error);
                     hideLoad();
                 });
   }


  // add new one
  addNewOne =(e)=>{
     e.preventDefault();
     const form = e.currentTarget
     const body = serialize(form, {hash: true, empty: true})

     showLoad();
     axios.put(window.API_URL+'add-new-email', body, headers()).
           then(res => {
               this.setState({rows: res.data });
               sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
               hideLoad();
               alert("Added!");
           }). catch(error => {
               alert(error);
               hideLoad();
           });
   }


 addSSL=(e)=>{
  e.preventDefault();
  const form = e.currentTarget
  const body = serialize(form, {hash: true, empty: true})

  showLoad();
  axios.put(window.API_URL+'setup-ssl-to-postfix', body, headers()).
        then(res => {
            alert(res.data);
            hideLoad();
        }). catch(error => {
            alert(error);
            hideLoad();
        });
}

   // add new one
   addNewUser =(e)=>{
     e.preventDefault();
     const form = e.currentTarget

     let name = window.prompt("Enter the user name", "");
     if(name == null || name =="") {
        if(name =="")
          alert( "The field should not be empty");
        return null;
     }

     let password = window.prompt("Enter the user password", "");
     if(password == null || password =="") {
       if(password =="")
         alert( "The field should not be empty");

       return null;
     }

     let body= {name:name, password:password, path:""}

     showLoad();
     axios.put(window.API_URL+'add-new-user', body, headers())
          .then(res => {
             this.setState({accounts: res.data });
             hideLoad();
             alert("Added!");
        }).catch(error => {
             alert(error);
             hideLoad();
        });
   }

  //remove user
  removeOne = (e, email="", account="")=>{
   e.preventDefault();

   if(!window.confirm("Are you sure you want to remove the "+email+" ?"))
   return null;

    showLoad();
    axios.delete(window.API_URL+'remove-email?email='+email+'&account='+account, headers() )
         .then(res => {
              hideLoad();
              this.setState({rows: res.data });
              sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));

              alert("Removed!");
          }).catch(error => {
              alert(error);
              hideLoad();
          });
  }

 addBtn =(e, action="")=>{
  e.preventDefault();

  this.setState({sslBox: "none" });

  showLoad();
  axios.get(window.API_URL+'get-list-of-users',  headers() )
       .then(res => {
                 hideLoad();
                 this.setState({accounts: res.data, showAdd:"block" });
        }).catch(error => {
                  alert(error);
                  hideLoad();
      });
 }

 info=(e, userName="")=>{
    e.preventDefault();
     if(userName=="")
      return null;

    var txt =
          "<h4>IMAP info</h4>"+
          "Hostname: "+this.state.postfixServer+"<br/>"+
          "User: "+userName+"<br/>"+
          "Password: ***** (your user password)<br/>"+
          "Port: 143<br/>"+
          "Security: STARTTLS<br/>"+
          "Auth method: Normal Password<br/><br/>"+

          "<h4>SMTP info</h4>"+
          "Hostname: "+this.state.postfixServer+"<br/>"+
          "User: "+userName+"<br/>"+
          "Password: ***** (your user password)<br/>"+
          "Port: 587<br/>"+
          "Security: STARTTLS<br/>"+
          "Auth method: Normal Password<br/><br/>"+

        "<h4>This is the config for smtp for Roundcube Web mail <br/>(add this lines to the end of file: /config/config.inc.php)</h4>"+
        "<code>"+
         "$config['smtp_server'] = 'tls://"+this.state.postfixServer+"'<br/>"+
                  "$config['smtp_port'] = 587;<br/>"+
                  "$config['smtp_user'] = '%u';<br/>"+
                  "$config['smtp_pass'] = '%p';<br/>"+
                  "$config['smtp_auth_type'] = 'PLAIN';<br/>"+
                  "$config['smtp_conn_options'] = array(<br/>"+
                     "&nbsp;&nbsp;'ssl'         => array(<br/>"+
                     "&nbsp;&nbsp;'verify_peer'      => false,<br/>"+
                     "&nbsp;&nbsp;'verify_peer_name' => false,<br/>"+
                  "&nbsp;),<br/>"+
                ");</code><br/>";

    showAlert(txt);
 }

  accType=(e)=>{
   this.setState({accountType:e.target.value});
  }

  installSSLBox=(e)=>{
     e.preventDefault();
     this.setState({sslBox:this.state.sslBox=="none"?"block":"none", showAdd: "none"});
  }

  sslType=(e)=>{
   this.setState({sslType:e.target.value});
  }

  render() {
    return (
       <>

         <form onSubmit={this.addNewOne} action="#" method="POST" style={{display: this.state.showAdd}}>
            <div class="row shadow-sm bg-body rounded paddingBottomTopForm" >
                 <div class="col-md-3">
                 <small>Enter the email</small>
                   <input type="email" name="email" class="form-control" required={true} placeHolder="email@yourdomain.com"/>
                 </div>
                 <div class="col-md-3">
                    <small>Account type</small>
                    <select name="account" class="form-control" onClick={this.accType} required={true} >
                       <option value="">Select the account</option>
                       <option value="1">Account</option>
                       <option value="2">Forward Email</option>
                    </select>
                 </div>
                 {this.state.accountType !="" ?
                   <>
                     {this.state.accountType =="2" ?
                      <div class="col-md-3" >
                        <small>Enter forward email </small>
                        <input type="email" name="account" class="form-control" required={true} />
                      </div>
                      :
                      <div class="col-md-3">
                           <small>
                               Select user &nbsp;
                               <a href="#" onClick={this.addNewUser}>Add user</a> | &nbsp;
                               <a href={window.BASE_URL+"#/users-ftp"}>Edit users</a>
                             </small>
                           <select name="account" class="form-control" required={true} >
                              <option value="">Select the account</option>
                             {this.state.accounts.map(acc=>
                               <>
                                 {acc.name != "root" ?
                                   <option value={acc.name}>{acc.name}</option>
                                 :<></>}
                               </>
                             )}
                           </select>
                       </div>
                      }
                   </>:<></>}

                 <div class="col-md-2"> <br/>
                   <button class="btn btn-primary btn_small" type ="submit" >Add New Email</button>
                 </div>

           </div>
         </form>

         <form onSubmit={this.addSSL} action="#" method="POST" style={{display: this.state.sslBox}}>
             <div class="row shadow-sm bg-body rounded paddingBottomTopForm">
                      <div class="col-md-2">
                        <small>Select SSL type</small>
                        <select name="typeSSL" class="form-control" onClick={this.sslType} required={true} >
                          <option value="">Select SSL type</option>
                          <option value="1">Let’s Encrypt SSL</option>
                          <option value="2">Other SSL</option>
                          <option value="3">Return back how it was</option>
                        </select>
                       </div>

                      {this.state.sslType =="2" ?
                        <>
                         <div class="col-md-3">
                            <small><bold>Cert path *</bold></small>
                            <input type="text" name="cert" class="form-control" required={true} placeHolder="/etc/ssl/certs/ssl-cert-snakeoil.pem"/>
                          </div>
                          <div class="col-md-3">
                            <small><bold>Key path *</bold></small>
                            <input type="text" name="key" class="form-control" required={true} placeHolder="/etc/ssl/private/ssl-cert-snakeoil.key"/>
                          </div>
                           <div class="col-md-3">
                              <small>CApath path</small>
                              <input type="text" name="capath" class="form-control" placeHolder="/etc/ssl/certs"/>
                           </div>
                        </>
                      :<></>}


                  <div class="col-md-2">
                    {this.state.sslType !="2" ?<><br/></>:<></>}
                    <button class="btn btn-primary btn_small" type ="submit" >Setup</button>
                  </div>

            </div>
          </form>



           <div class="height20px"></div>

           <div class="row shadow-sm bg-body rounded paddingBottomTopForm">
             <div class="col-md-6">
               <a href="#" class="btn btn btn-success btn_small" onClick={this.getData}>
                 <i class="bi bi-arrow-clockwise"></i> Show Emails
               </a>&nbsp;&nbsp;

               <a href="#" class="btn btn-info btn_small" onClick={this.addBtn}>
                 <i class="bi bi-plus-circle"></i> Add new email
               </a>
             </div>
              <div class="col-md-6 text_align_right">
                   <a href="#" class="btn btn-info btn_small" onClick={this.installSSLBox}>
                      <i class="bi bi-plus-circle"></i> Add SSL to Mail server
                   </a>
              </div>
           </div>

           <div class="clear"></div>
       <div class="row">
         <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" style={{width:"40px"}}>Info</th>
                <th scope="col">Email</th>
                <th scope="col" class="text_align_center">Account/Forward</th>
                <th scope="col" class="text_align_center">Remove</th>
             </tr>
            </thead>
            <tbody>
            {this.state.rows.map(row=>
             <tr>
                 <td> <a href="#" onClick={e=>this.info(e,(row.account.includes("@")? "":row.account))}><i class="bi bi-info-circle"></i></a></td>
                 <td> {row.name} </td>
                 <td class="text_align_center"> {row.account} </td>
                  <td class="text_align_center">
                    <a href="#" onClick={e=>this.removeOne(e, row.name, row.account)}>
                       <i class="bi bi-x-circle-fill"></i>
                    </a>
                  </td>
               </tr>
             )}
            </tbody>
          </table>
            <div class="col-md-12">
                <p class="text_align_center">
                   <a href="#" class="btn btn btn-success btn_small" onClick={this.getData}>
                      <i class="bi bi-arrow-clockwise"></i> Show Emails
                   </a>
                </p>
            </div>
         </div>

      </>
    );
  }
}

export default Emails;