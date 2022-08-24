import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';

import TextEditor from './../layouts/TextEditor.js';
import CategoriesSelect from './../layouts/CategoriesSelect.js';

/**
Controller : controllers.cp.PagesAdminController
*/
class UsersEdit extends HelpersClass{
  constructor(props) {
    super(props);
    this.initState({ row : {},
                     categories : [],
                     title: "Edit User",
                     roles: [],
                     userRole:""
                   });
  }

   componentDidMount(){
      this.getData(this.props.match.params.id);
   }


  componentWillReceiveProps(nextProps) {
      this.getData(nextProps.match.params.id);
    }



  getData=(id="")=>{
        this.showLoad();

        this.setState({ lang: this.getLang() });

        axios.get(window.API_URL+'cp/users/get-one?userid='+id,this.headers())
             .then(res => {
               var users= res.data.user;
                  delete users.password;
                  setInput(users, this.getLang());
                //alert(JSON.stringify(users))
                this.setState({row: res.data.user,
                               userRole: users.roles !=null && users.roles.length >0 ? users.roles[0]["id"] : "0",
                               roles: res.data.roles});
                this.hideLoad();
             }).catch(error => {
                alert(error);
                this.hideLoad();
             });
    }


  render() {
    return (
       <div class="card">
          <div class="header headerBg">
            <div class="title">
               { this.props.match.params.id =="0"? this.l('Create new') : this.l('Edit')}
            </div>
         </div>
          <div class="content">
            <form class="formSave" onSubmit={e=>this.formSave(e, "users-insert-update")} action="#" method="POST">
              <input type="hidden" name="userid" value={this.props.match.params.id} />
              <input type="hidden" class="form-control" name="locked"
                   value={this.props.match.params.id>0? this.state.row.locked : false} />

              <div class="col-md-6">
                <p>
                  <label>{this.l('First Name')}</label> <br />
                  <input type="text" class="form-control" name="firstName"  required/>
                </p>
              </div>

               <div class="col-md-6">
                  <p>
                    <label>{this.l('Last Name')}</label> <br />
                    <input type="text" class="form-control" name="lastName"  required/>
                  </p>
                </div>
                <div class="clear"></div>
                 <div class="col-md-6">
                  <p>
                    <label>{this.l('Email')}</label> <br />
                    <input type="email" class="form-control" name="email"  required/>
                  </p>
                </div>
                 <div class="col-md-6">
                      <p>
                        <label>{this.l('DOB')}(mm/dd/yyyy)</label> <br />
                        <input type="date" class="form-control" placeholder="dd/mm/yyyy" pattern="\d{4}-\d{2}-\d{2}" name="dob" />
                      </p>
                 </div>
                 <div class="col-md-6">
                   <p>
                     <label>{this.l('Role')}</label> <br />
                      <select name="roles[0][id]" class="form-control" required >
                       <option value=""> {this.l("Select Role")}</option>
                       {this.state.roles.map(role=>
                          <option value={role.id} selected={this.state.userRole==role.id}> {role.name.replace("ROLE_","")}</option>
                        )}
                      </select>
                   </p>
                 </div>

                  <div class="col-md-6">
                       <p>
                         <label>{this.l('Password')}</label> <br />
                         <input type="text" name="password" class="form-control" placeholder="*****"
                            required ={this.props.match.params.id =="0"? true:false}/>
                           <small> <i> {this.l("Leave empty if you don't want to change")} </i></small>
                       </p>
                  </div>


              <div class="height10px"></div>
              <div class="text-center">
                <input type="submit" class="btn" value={this.l('Save')} />
              </div>
            </form>
          </div>
        </div>

    );
  }
}
export default UsersEdit;