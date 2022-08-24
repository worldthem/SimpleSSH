import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, getPageNr } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import Pagination from '../../pagination/Pagination';

/**
Controller : controllers.cp.UsersAdminController
*/

class Users extends HelpersClass {

   constructor(props) {
      super(props);
      this.initState({ rows : [],
                       title: "Users list",

                    });
    }

  componentDidMount(){
     this.getData(getPageNr());
  }

  setCurrentPage=(pageNr=0)=>{
       window.location.href= window.ADMIN_BASE_URL+'users?page='+pageNr+'&search='+getUrlParam("search");
       this.setState({currentPage:pageNr < 1 ? 1 : pageNr });
       this.getData(pageNr-1);
    }

 getData=(pageNr=0)=>{
     this.showLoad();
             axios.get(window.API_URL+'cp/users/get-list?search='+getUrlParam("search")+
                                                  '&pageNr='+pageNr,this.headers() )
                  .then(res => {

                     this.setState({rows: res.data.content,
                                    currentPage: res.data.pageable.pageNumber +1,
                                    totalCount: res.data.totalElements,
                                    pageSize: res.data.pageable.pageSize,
                     });
                     this.hideLoad();
                   }).catch(error => {
                      this.hideLoad();
                   });


       this.showLoad();
 }

   getRoles =(roles)=>{
      var res="";
      for(const i in roles){
          try{
             res = res +(res ==""? "":", ")+roles[i]["name"].replace("ROLE_","");
           }catch(err){}
      }

      return res;
   }


 //Show products from category and search
  redirectTo=(e)=>{
     window.location.href= window.ADMIN_BASE_URL+"users?search="+document.getElementById("searchEnter").value;
     window.location.reload();
  }

  render() {
    return (
        <div class="card">
          <div class="header headerBg">
            <h4 class="title">
                 {this.l(this.state.title)} &nbsp;&nbsp;&nbsp;
                 <a class="btn" href={window.ADMIN_BASE_URL+"users/edit-insert/0"} >
                    {this.l('Add new one')}
                </a>
            </h4>
          </div>

            <div class="col-md-2">
              <select name="action" class="form-control" id="actionType">
                <option value="">{this.l('Action')}</option>
                <option value="del">{this.l('Delete')}</option>
              </select>
            </div>

            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.bulkActionImpl(e,"users-bulk-action")}>
                {this.l('Apply')}
              </button>
            </div>
           <div class="col-md-5"><br/></div>
            <div class="col-md-2">
              <input type="text" class="form-control" name="s" id="searchEnter" placeholder={this.l("Search")} />
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.redirectTo(e)}>{this.l("Search")}</button>
            </div>
            <div class="col-md-1">
               <a href={window.ADMIN_BASE_URL+"users" } onClick={e=>this.resetBtn(e, "users")} class="btn btn_small btn_active">
                 {this.l("Reset")}
               </a>
            </div>

            <div class="clearfix"></div>

            <div class="content table-responsive table-full-width">
              <table class="table table-hover table-striped">
                <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <SetBulk cssClass="checkboxBulk"/>
                  </th>
                  <th style={{ width: '40px' }}>{this.l('ID')}</th>
                  <th>{this.l('First name')}</th>
                  <th>{this.l('Last name')}</th>
                  <th>{this.l('Email')}</th>
                  <th>{this.l('Role')}</th>
                  <th>{this.l('Registration Date')}</th>
                  <th>{this.l('Orders')}</th>
                  <th style={{ width: '40px' }}> </th>
                  <th style={{ width: '40px' }}> </th>
                  <th style={{ width: '40px' }}> </th>
                 </tr>
                </thead>
                  <tbody>
                     {this.state.rows.map( row =>
                         <tr>
                                <td>
                                   <input type="checkbox" name="id" class="checkboxBulk" value={row.userid}/>
                               </td>
                                <td>
                                  <a href={window.ADMIN_BASE_URL+"users/edit-insert/"+row.userid} target="_blank">
                                    <i class="fa fa-link"></i> {row.userid}
                                  </a>
                               </td>
                                 <td>
                                     {row.firstName}
                                 </td>
                                <td>
                                     {row.lastName}
                               </td>
                                <td>
                                      {row.email}
                                </td>
                                <td>
                                     {this.getRoles(row.roles)}
                                </td>
                                <td>
                                      {row.created_at}
                                </td>
                                <td>
                                  <a href={window.ADMIN_BASE_URL+"admin?userid="+row.userid}>
                                    {this.l("View orders")}
                                  </a>
                               </td>
                               <td class="width_table_btn">
                                 <a href={window.ADMIN_BASE_URL+"users/edit-insert/"+row.userid} title="Edit" class="fa_edit"></a>
                               </td>
                               <td class="width_table_btn" >
                                 <a href="#" onClick={e=>this.deleteRow(e, row.userid, "users-remove")}
                                    style={{display:row.userid>1? "":"none"}} title="Delete" class="fa_delete">
                                 </a>
                               </td>
                                <td class="width_table_btn">
                                   <a href="#" onClick={e=>this.showHide(e,row.userid, (row.locked ? "1":"2"),"users-show-hide" )} title="Show/Hide" class={row.locked ? "fa_unpublish":"fa_publish"}></a>
                               </td>
                           </tr>
                         )}
                  </tbody>
              </table>
            </div>
              <Pagination
                  className="pagination-bar"
                  currentPage={this.state.currentPage}
                  totalCount={this.state.totalCount}
                  pageSize={this.state.pageSize}
                  onPageChange={page => this.setCurrentPage(page)}
                />
        </div>

    );
  }
}

export default Users;