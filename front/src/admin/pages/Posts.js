import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, getPageNr } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import Pagination from '../../pagination/Pagination';

/**
Controller : controllers.cp.PagesAdminController
*/
class Posts extends HelpersClass {

   constructor(props) {
      super(props);
      this.initState({ rows : [],
                       title: "Posts",
                       categories:[],
                    });
    }

  componentDidMount(){
     this.getData(getPageNr());
  }

  setCurrentPage=(pageNr=0)=>{
       var search = getUrlParam("search");
       window.location.href= window.ADMIN_BASE_URL+'page/posts?page='+pageNr+
                                              (search !=""? "&search="+search:"");

       this.setState({currentPage:pageNr < 1 ? 1 : pageNr });
       this.getData(pageNr-1);
    }

 getData=(pageNr=0)=>{
     this.showLoad();
             axios.get(window.API_URL+'cp/pages-list-with-categories?type=posts&search='+getUrlParam("search")+
                                                  '&pageNr='+pageNr,this.headers() )
                  .then(res => {
                     this.setState({rows: res.data.pages.content,
                                    currentPage: res.data.pages.pageable.pageNumber +1,
                                    totalCount: res.data.pages.totalElements,
                                    pageSize: res.data.pages.pageable.pageSize,
                                    categories: res.data.categories,
                     });
                     this.hideLoad();
                   }).catch(error => {
                      this.hideLoad();
                   });


       this.showLoad();


 }

 //Show products from category and search
  redirectTo=(e, type)=>{
     var typeShow = type=="search"? "&search="+document.getElementById("searchEnter").value :
                                    "&catid="+e.target.value;

     window.location.href= window.ADMIN_BASE_URL+"pages/posts?type=posts"+typeShow;
     window.location.reload();
  }

  render() {
    return (

        <div class="card">
          <div class="header headerBg">
            <h4 class="title">
                 {this.l('Blog')} &nbsp;&nbsp;&nbsp;
                 <a class="btn" href={window.ADMIN_BASE_URL+"pages/edit-add-posts/posts/0"} >
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
              <button type="submit" class="btn btn_small" onClick={e=>this.bulkActionImpl(e,"pages-bulk-action")}>
                {this.l('Apply')}
              </button>
            </div>
           <div class="col-md-5"><br/></div>
            <div class="col-md-2">
              <input type="text" class="form-control" name="s" id="searchEnter" placeholder={this.l("Search")} />
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.redirectTo(e,"search")}>{this.l("Search")}</button>
            </div>
            <div class="col-md-1">
               <a href={window.ADMIN_BASE_URL+"pages/posts" } onClick={e=>this.resetBtn(e, "pages/posts")} class="btn btn_small btn_active">
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
                  <th style={{ width: '90px' }}>{this.l('Position')}</th>
                  <th>{this.l('Title')}</th>
                  <th>{this.l('Category')}</th>
                  <th style={{ width: '40px' }}> </th>
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
                                  <a href={window.ADMIN_BASE_URL+"pages/edit-add-posts/"+row.type+"/"+row.pageid} target="_blank">
                                   {row.pageid}
                                  </a>
                               </td>
                                 <td>
                                     {this.lang(row.sort)}
                                 </td>
                                <td>
                                  {this.lang(row.title)}
                               </td>
                               <td>
                                  {this.getCatNameByIds(row.catin, this.state.categories) }

                               </td>
                                <td class="width_table_btn">
                                 <a href={window.ADMIN_BASE_URL+"pages/edit-add-posts/"+row.type+"/"+row.pageid} title="Edit" class="fa_edit"></a>
                               </td>
                               <td class="width_table_btn">
                                 <a href="#" onClick={e=>this.deleteRow(e, row.pageid, "pages-remove")} title="Delete" class="fa_delete"></a>
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

export default Posts;