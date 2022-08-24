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
class PagesList extends HelpersClass {
   editUrl = {tabs : "pages/edit-add-tabs/",
              pages: "pages/edit-add-pages/",
              emails: "pages/edit-add-emails/"
              }

   title = {tabs : "Product Tabs",
            pages: "Pages",
            emails: "Emails",
           }

   constructor(props) {
      super(props);
      this.initState({ rows : [],
                       title: "Pages List",
                       type:"",
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
       window.location.href= window.ADMIN_BASE_URL+'pages-list/'+this.state.type+'?page='+pageNr+
                                               (search !=""? "&search="+search:"");
       this.setState({currentPage:pageNr < 1 ? 1 : pageNr });
       this.getData(pageNr-1, this.state.type);
    }

 getData=(pageNr=0, type="")=>{
     this.showLoad();
     axios.get(window.API_URL+'cp/pages-list?type='+type+'&search='+getUrlParam("search")+
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
 }

  getEditUrl=()=>{
       try{
          return this.editUrl[this.state.type]+ this.state.type+"/";
       }catch(err){}
          return this.editUrl["pages"]+"/pages/"+this.state.type+"/";
  }
  getTitle=()=>{
         try{
            return this.title[this.state.type] ;
         }catch(err){}
            return this.title["pages"] ;
    }


 //Show products from category and search
  redirectTo=(e, type)=>{
     var typeShow = type=="search"? "?search="+document.getElementById("searchEnter").value :
                                    "?catid="+e.target.value;

     window.location.href= window.ADMIN_BASE_URL+"pages-list/"+this.state.type+typeShow;
     window.location.reload();
  }

  render() {
    return (

        <div class="card">
          <div class="header headerBg">
            <h4 class="title">
                 {this.l(this.getTitle())} &nbsp;&nbsp;&nbsp;
                 <a class="btn" href={window.ADMIN_BASE_URL+this.getEditUrl()+"0"} >
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
                  <th style={{ width: '40px' }}>{this.l('ID')}</th>
                  <th style={{ width: '90px' }}>{this.l('Position')}</th>
                  <th>{this.l('Title')}</th>
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
                                    <a href="#" onClick={e=>this.showHide(e,row.pageid, (row.status=="2" ? "1":"2"),"pages-show-hide" )} title="Show/Hide" class={row.status=="2" ? "fa_unpublish":"fa_publish"}></a>
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

export default PagesList;