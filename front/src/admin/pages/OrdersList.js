import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, getPageNr } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import Pagination from '../../pagination/Pagination';


class OrdersList extends HelpersClass{
 status= ["success", "pending", "processing", "canceled", "refunded"]

 constructor(props) {
        super(props);
        this.initState({
                  rows: [],
                  title: "Orders List",
           });
      }


     componentDidMount(){
          this.setState({type:this.props.match.params.type});
          this.getData(getPageNr(), this.props.match.params.type);
       }

       componentWillReceiveProps(nextProps) {
            if(nextProps.match.params.type != this.state.type){
               this.setState({type:nextProps.match.params.type});
               this.getData(getPageNr(), nextProps.match.params.type);
             }
        }

       setCurrentPage=(pageNr=0)=>{
            var search = getUrlParam("search");
            window.location.href= window.ADMIN_BASE_URL+'orders-list/'+this.state.type+'?page='+pageNr+
                                                    (search !=""? "&search="+search:"");
            this.setState({currentPage:pageNr < 1 ? 1 : pageNr });
            this.getData(pageNr-1, this.state.type);
         }

      getData=(pageNr=0)=>{
          this.showLoad();
          axios.get(window.API_URL+'cp/get-list-of-orders?status='+getUrlParam("status")+'&search='+getUrlParam("search")+
                    '&pageNr='+pageNr+'&userid='+(getUrlParam("userid") !="" ? "0" : getUrlParam("userid")) ,this.headers() )
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

 render() {
      return (
        <div class="card">
          <div class="header headerBg">
            <h4 class="title"> {this.l(this.state.title)} </h4>
          </div>

            <div class="col-md-2">
              <select name="action" class="form-control" id="actionType">
                <option value="">{this.l('Action')}</option>
                <option value="del">{this.l('Delete')}</option>
                 {this.status.map(s=>
                  <option value={s}>{this.l("Change status to")}: {s} </option>
                 )}
              </select>
            </div>

            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.bulkActionImpl(e,"pages-bulk-action")}>
                {this.l('Apply')}
              </button>
            </div>

           <div class="col-md-3">
              <select name="action" class="form-control" id="actionType">
                   <option value=""> {this.l('Show by status')}</option>
                   {this.status.map(s=>
                    <option value={s}>{this.l("Change status to")}: {s} </option>
                   )}
             </select>
           </div>
           <div class="col-md-2"><br/></div>
            <div class="col-md-2">
              <input type="text" class="form-control" name="s" id="searchEnter" placeholder={this.l("Search")} />
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.redirectTo(e,"search")}>{this.l("Search")}</button>
            </div>
            <div class="col-md-1">
               <a href={window.ADMIN_BASE_URL+"pages-list/"+this.state.type } onClick={e=>this.resetBtn(e, "pages-list/"+this.state.type)} class="btn btn_small btn_active">
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
                    <th>{this.l('NR')}.</th>
                    <th>{this.l('Status')}</th>
                    <th>{this.l('Name')}</th>
                    <th>{this.l('Date')}</th>
                    <th>{this.l('Payd in')}</th>
                    <th>{this.l('Shipp to')}</th>
                    <th>{this.l('Shipping')}</th>
                    <th>{this.l('View')}</th>
                    <th style={{ width: '40px' }}> </th>
                    <th style={{ width: '40px' }}> </th>
                 </tr>
                </thead>
                  <tbody>
                     {this.state.rows.map( row =>
                         <tr>
                                <td>
                                   <input type="checkbox" name="id" class="checkboxBulk" value={row.pageid}/>
                               </td>
                                <td>
                                  <a href={window.ADMIN_BASE_URL+this.getEditUrl()+row.pageid} target="_blank">
                                    {row.pageid}
                                  </a>
                               </td>
                                 <td>
                                     {this.lang(row.sort)}
                                 </td>
                                <td>
                                  {this.lang(row.title)}
                               </td>
                                <td class="width_table_btn">
                                 <a href={window.ADMIN_BASE_URL+this.getEditUrl()+row.pageid} title="Edit" class="fa_edit"></a>
                               </td>
                               <td class="width_table_btn">
                                 <a href="#" onClick={e=>this.deleteRow(e, row.pageid, "pages-remove")} title="Delete" class="fa_delete">
                                 </a>
                               </td>
                                <td class="width_table_btn">
                                    <a href="#" onClick={e=>this.showHide(e,row.pageid, (row.hide=="2" ? "1":"2"),"pages-show-hide" )} title="Show/Hide" class={row.hide=="2" ? "fa_unpublish":"fa_publish"}></a>
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

export default OrdersList;