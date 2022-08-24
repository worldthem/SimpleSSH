import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, HashRouter, Redirect} from 'react-router-dom';

import axios from 'axios';
import { headers, hideLoad, showLoad, showAlert, getCookie } from './Helpers.js';

import Home from './pages/Home';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Installations from './pages/Installations';
import UsersFtp from './pages/UsersFtp';
import Domains from './pages/Domains';
import FileManager from './pages/FileManager';
import Database from './pages/Database';
import DatabaseUsers from './pages/DatabaseUsers';
import DatabaseTables from './pages/DatabaseTables';
import DatabaseTablesStructure from './pages/DatabaseTablesStructure';
import DatabaseTablesData from './pages/DatabaseTablesData';
import Firewall from './pages/Firewall';
import Services from './pages/Services';
import Terminal from './pages/Terminal';
import Settings from './pages/Settings';
import Emails from './pages/Emails';
import SystemUsers from './pages/SystemUsers';
import Logs from './pages/Logs';

import Login from './layouts/Login.js'

class DefaultTemplate extends React.Component {

constructor(props) {
       super(props);
       this.state = { accounts : [],
                      activeAcc:"",
                      isLogin: (getCookie("tokenauth") =="" || getCookie("tokenauth") == null ? true : false)
                   }
  }

   componentDidMount(){
         const idStorage = localStorage.getItem("id");

         if(idStorage !="" && idStorage !=null)
           this.setState({activeAcc: idStorage});

           this.getData();
    }


 // getList Of User
  getData =()=>{
    axios.get(window.API_URL+'get-header-list-of-accounts',  headers() )
         .then(res => {
              this.setState({accounts: res.data, isLogin: false });
               console.log(JSON.stringify(res.data));
              const idStorage = localStorage.getItem("id");
              if((idStorage =="" || idStorage ==null) && res.data.length>0){
                localStorage.setItem("id", res.data[0]["id"]);
                this.setState({activeAcc: res.data[0]["id"]});
              }

          }).catch(error => {
                if (error.response && (error.response.status===401 || error.response.status===403)) {
                    this.setState({isLogin: true});
                 } else {
                    this.setState({isLogin: false});
                }

          });
   }


   setAcc=(e)=>{
     sessionStorage.clear();
     localStorage.setItem("id", e.target.value);
     this.setState({activeAcc: e.target.value});
     window.location.reload();
    }

    getLogs=(e)=>{
      e.preventDefault();
      axios.get(window.API_URL+'get-logs',  headers() )
           .then(res => {
              showAlert(res.data);
           }).catch(error => { });
    }




render() {
  return (
        <>
        <div id="ajaxGif"></div>

        {this.state.isLogin ? <Login/> :<>

             <a href="#" class="logsBtnBottom" title="Logs" onClick={this.getLogs}> <i class="bi bi-info-lg"></i> Logs</a>

             {this.state.accounts.length>1 ?
              <select class="topAccountSelect" onChange={this.setAcc}>
               {this.state.accounts.map(acc=>
                 <option value={acc.id} selected={this.state.activeAcc ==acc.id}>{acc.sshHost+"@"+acc.sshLog}</option>
                )}
              </select>:<></>}

         <Header/>

         <HashRouter>
           <main class="flex-shrink-0">
             <div class="container-fluid">
               <div class="row">
                <div class="col-md-12" style={{padding:"0 20px"}}>
                       <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/installations' component={Installations} />
                        <Route exact path='/users-ftp' component={UsersFtp} />
                        <Route exact path='/domains' component={Domains} />
                        <Route exact path='/fil-manager' component={FileManager} />
                        <Route exact path='/database-mysql' component={Database} />
                        <Route exact path='/database-mysql/:dbname' component={DatabaseTables} />
                        <Route exact path='/database-mysql-table-structure/:dbname/:tbname' component={DatabaseTablesStructure} />
                        <Route exact path='/database-mysql-table-data/:dbname/:tbname' component={DatabaseTablesData} />
                        <Route exact path='/database-mysql-users' component={DatabaseUsers} />
                        <Route exact path='/firewall' component={Firewall} />
                        <Route exact path='/services' component={Services} />
                        <Route exact path='/terminal' component={Terminal} />
                        <Route exact path='/settings' component={Settings} />
                        <Route exact path='/emails' component={Emails} />
                        <Route exact path='/system-users' component={SystemUsers} />
                        <Route exact path='/system-logs' component={Logs} />

                       </Switch>
                   </div>
                  </div>
                </div>
            </main>
         </HashRouter>
         <Footer/>
          </>}
        </>
    );
  }
}

export default DefaultTemplate;