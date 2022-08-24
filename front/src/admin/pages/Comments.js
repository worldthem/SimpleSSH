import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, getPageNr } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import Pagination from '../../pagination/Pagination';


class Comments extends HelpersClass {
  constructor(props) {
    super(props);
    this.initState({
       rows:[],
    });
  }

   componentDidMount(){
      this.getData(getPageNr());
    }

    componentWillReceiveProps(nextProps) {

     }

    setCurrentPage=(pageNr=0)=>{
         var search = getUrlParam("search");
         var userid = getUrlParam("userid");
         var status = getUrlParam("status");
         window.location.href= window.ADMIN_BASE_URL+'comments?page='+pageNr+
                                                 (search !=""? "&search="+search:"")+
                                                 (userid !=""? "&userid="+userid:"")+
                                                 (status !=""? "&status="+status:"");
         this.setState({currentPage:pageNr < 1 ? 1 : pageNr });
         this.getData(pageNr-1);
      }

   getData=(pageNr=0)=>{
       this.showLoad();
       var search = getUrlParam("search");
       var userid = getUrlParam("userid") =="" ? "0" : getUrlParam("userid");
       var status = getUrlParam("status") =="" ? "0" : getUrlParam("status");

       axios.get(window.API_URL+'cp/get-list-of-comments?status='+getUrlParam("status")+'&search='+getUrlParam("search")+
                      '&pageNr='+pageNr+'&userid='+getUrlParam("userid"), this.headers() )
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
   }

  redirectTo=(e, type, val="")=>{
       e.preventDefault();
       var typeShow = type=="search"? "search="+document.getElementById("searchEnter").value :
                                      (type=="status"? "status="+e.target.value : "userid="+val);

       window.location.href= window.ADMIN_BASE_URL+"comments?"+typeShow;
      // window.location.reload();
      this.getData(0);
  }

  render() {
    return (

        <div class="card">
          <div class="header">
            <h4 class="title">{this.l('Comments/Reviews')}</h4>
          </div>

            <div class="col-md-2">
              <select name="action" class="form-control" id="actionType">
                <option value="">{this.l('Action')}</option>
                <option value="del">{this.l('Remove')} </option>
                <option value="1">{this.l('Approve')} </option>
                <option value="2">{this.l('Unapprove')} </option>
              </select>
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.bulkActionImpl(e,"comments-bulk-action")}>
                 {this.l('Apply')}
              </button>
            </div>

            <div class="col-md-1"> <br /> </div>
            <div class="col-md-3 text_align_right">
              <select class="form-control" onChange={e=>this.redirectTo(e,"status")}>
                <option value=""> All</option>
                <option value="1"> {this.l('Approved')}</option>
                <option value="2"> {this.l('Unapproved')} </option>
              </select>
            </div>
            <div class="col-md-1"> <br /> </div>

            <div class="col-md-2">
              <input type="text" class="form-control" name="s" id="searchEnter" placeholder={this.l('Search')} />
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.redirectTo(e,"search")}> {this.l('Search')} </button>
            </div>
             <div class="col-md-1">
               <a href={window.ADMIN_BASE_URL+"comments" } onClick={e=>this.resetBtn(e, "comments")} class="btn btn_small btn_active">
                 {this.l("Reset")}
               </a>
             </div>
            <div class="clear"></div>
            <div class="content table-responsive table-full-width">
              <table class="table table-hover table-striped">
                <thead>
                <tr>
                  <th>
                    <SetBulk cssClass="checkboxBulk"/>
                  </th>
                  <th>{this.l('Status')}</th>
                  <th>{this.l('Author')}</th>
                  <th>{this.l('IP')}</th>
                  <th>{this.l('Comment')}</th>
                  <th>{this.l('Product')}</th>
                  <th>{this.l('Date')}</th>
                  <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody> {this.state.rows.map((row) =>
                  <tr>
                    <td> <input type="checkbox" name="id" class="checkboxBulk" value={row.commentid} />
                    </td>
                    <td class="width_table_btn">
                       <a href="#" onClick={e=>this.showHide(e,row.commentid, (row.status=="2" ? "1":"2"),"comment-show-hide" )} title="Show/Hide" class={row.status=="2" ? "fa_unpublish":"fa_publish"}></a>
                    </td>
                    <td>
                       {row.userid != null ? (
                         <>
                            <a href={window.ADMIN_BASE_URL+"users/edit-insert/"+row.userid}>
                                  <b> {row.firstName} {row.lastName} </b>
                                  ( {row.email} )
                            </a> &nbsp;|&nbsp;
                            <a href={window.ADMIN_BASE_URL+"comments?userid="+row.userid} onClick={e=>this.redirectTo(e,"userid",row.userid)}>
                              <i class="fa fa-eye"></i>
                            </a>
                         </>) :
                        ( <b> {row.author} | {row.email} </b> )}

                        <span class={'stars' + row.stars}></span>
                    </td>
                    <td> {row.ip}</td>
                    <td style={{ maxWidth: '600px' }}> {row.comment} </td>
                    <td>
                      <a href={window.ADMIN_BASE_URL+"products/edit-product/"+row.productid}>{this.lang(row.ptitle)}</a>
                    </td>
                    <td> {row.created}</td>

                    <td>
                      <a href="#" class="fa_delete" onClick={e=>this.deleteRow(e, row.commentid, "comment-remove")}></a>
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

export default Comments;