import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, goTo, getPageNr } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import Pagination from '../../pagination/Pagination';

/**
* Controller: ProductsAdminController
* On this page we see the list
**/
class ProductList extends HelpersClass{

    constructor(props) {
       super(props);
       //we do this way because this.state={} has been initialized in HelpersClass
       //the method initState() is in HelpersClass

       this.initState({ rows : [],
                        title: 'Product list',
                        showActionCat:"none",
                        categories:[],
                       });
     }


    componentDidMount(pageNr=0){
         this.getData(getPageNr());
    }

 setCurrentPage=(pageNr=0)=>{ //alert(pageNr-1);
     window.location.href= window.ADMIN_BASE_URL+"products-list?page="+pageNr+
                                                 "&catid="+getUrlParam("catid")+
                                                 "&search="+getUrlParam("search")+
                                                 "&userid="+getUrlParam("userid");
     this.setState({currentPage:pageNr < 1 ? 1 : pageNr });
     this.getData(pageNr-1);
  }
   getData=(pageNr=0)=>{
          this.showLoad();
          axios.get(window.API_URL+'cp/products-list?catid='+getUrlParam("catid")+
                                         "&search="+getUrlParam("search")+"&userid="+getUrlParam("userid")+
                                         "&pageNr="+pageNr,
                                         this.headers())
                .then(res => {
                console.log("pr:", res.data.list.content);
                    this.setState({rows: res.data.list.content,
                                   currentPage: res.data.list.pageable.pageNumber +1,
                                   totalCount: res.data.list.totalElements,
                                   pageSize: res.data.list.pageable.pageSize,
                                   categories :res.data.categories,
                    });
                    this.hideLoad();
                }).catch(error => {
                    this.hideLoad();
                 });
   }


   actionChose=(e)=>{
     this.setState({showActionCat:e.target.value =="move"? "":"none"});
   }


  // do some action like delete, move, block
  actionImpl=(e)=>{
    e.preventDefault();
      // check if action select is not select focus on it and return null
     if(document.getElementById("actionType").value==""){
        document.getElementById("actionType").focus();
       return null;
      }
     // check if action is == move  focus focus it and return null
      if(document.getElementById("actionType").value=="move" &&
           document.getElementById("categoryMoveTo").value=="" ){
           document.getElementById("categoryMoveTo").focus();
        return null;
      }

    var elementsBulk = document.getElementsByClassName("checkboxBulk");
    var ids=[];
     for(var i=0; i<elementsBulk.length; i++){
       if(elementsBulk[i].checked)
         ids.push(elementsBulk[i].value);
     }

     if(ids.length==0)
       return null;

   // do all the magical ajax post here well we use axios
    this.showLoad();
     axios.post(window.API_URL+'cp/products-action',
        { action: document.getElementById("actionType").value,
          categoryId: document.getElementById("categoryMoveTo").value,
          id: ids
        },
       this.headers() )
          .then(res => {
             this.hideLoad();
             window.location.reload();
           }).catch(error => {
             alert(error);
             this.hideLoad();
           });
    }

  //Show products from category and search
  redirectTo=(e, type)=>{
     var typeShow = type=="search"? "?search="+document.getElementById("searchEnter").value :
                               "?catid="+e.target.value;
     window.location.href= window.ADMIN_BASE_URL+"products-list"+typeShow;
     window.location.reload();
  }

 //Show products from category and search
  goWithUpd=(e, url)=>{
       e.preventDefault();
      window.location.href= window.ADMIN_BASE_URL+"products-list"+url;
      window.location.reload();
  }

  render(){
    return(
    <div class="card">
        <div class="header headerBg">
            <h4 class="title">
                  {this.l('Products List')} &nbsp;&nbsp;&nbsp;
               <a class="btn" href={window.ADMIN_BASE_URL+"products/add-product/new"} >
                   {this.l('Add new one')}
               </a>
          </h4>
        </div>

      <div class="col-md-2">
          <select name="action" class="form-control" id="actionType" onChange={this.actionChose}>
                <option value="">{this.l("Action")}</option>
                <option value="move">{this.l("Move to category")}</option>
                <option value="2">{this.l("Hide Products")}</option>
                <option value="1">{this.l("Make products Visible")}</option>
                <option value="del">{this.l("Delete")}</option>
            </select>
        </div>
        <div class="col-md-2" style={{display:this.state.showActionCat}}>
            <select name="category_id" id="categoryMoveTo" class="form-control">
                <option value="">{this.l("Select category")}</option>
                <option value="3"> Clothing</option>
            </select>
        </div>
         <div class="col-md-1">
          <button type="submit" class="btn btn_small" onClick={this.actionImpl}>{this.l("Apply")}</button>
         </div>

        <div class="gap_20px"> <br/> </div>

        <div class="col-md-2">
            <select class="form-control" onChange={e=>this.redirectTo(e,"cat")}>
                <option value="">{this.l("Show products from category")}</option>
                {this.state.categories.map(row=>
                   <option value={row.catid}> {this.lang(row.title)}</option>
                )}
            </select>
        </div>

         <div class="col-md-2">
           <input type="text" class="form-control" name="s" id="searchEnter" placeholder={this.l("Search Product")} />
         </div>
         <div class="col-md-1">
            <button type="submit" class="btn btn_small" onClick={e=>this.redirectTo(e,"search")}>{this.l("Search")}</button>
         </div>

         <div class="col-md-1">
            <a href={window.ADMIN_BASE_URL+"products-list" } onClick={e=>this.resetBtn(e, "products-list")} class="btn btn_small btn_active">{this.l("Reset")}</a>
         </div>
     <div class="clear"></div>

     <div class="content table-responsive table-full-width">
          <table class="table table-hover table-striped">
             <thead>
                 <tr>
                  <th style={{width:"40px"}} >
                  <SetBulk cssClass="checkboxBulk"/>
                 </th>
                 <th style={{width:"45px"}}>{this.l("ID")} </th>
                 <th style={{width:"50px"}}> </th>
                 <th style={{width:"100px"}}>{this.l("Price")}</th>
                 <th style={{width:"55px"}}>{this.l("Image")}</th>
                 <th>{this.l("Title")}</th>
                 <th>{this.l("Categories")}</th>
                 <th>{this.l("Author")}</th>
                 <th colspan="3" style={{width:"120px",textAlign:"right"}}>
                   <strong>{this.l("Products")} </strong>
                 </th>
             </tr>
             </thead>
              <tbody>

             {this.state.rows.map( row =>
                 <tr>
                   <td>
                        <input type="checkbox" name="id" class="checkboxBulk" value={row.productid}/>
                    </td>
                     <td>
                       <a href={window.ADMIN_BASE_URL+"products/edit-product/"+row.productid} target="_blank">
                         {row.productid}
                       </a>
                    </td>
                    <td>
                       <a href={window.BASE_URL+"view-product/"+row.productid} class="fa_view" target="_blank"> </a>
                    </td>

                    <td> {this.htmlPrice(row.price,row.salePrice)}</td>
                    <td>
                        <img style={{maxWidth:"40px"}} src={window.API_ASSETS+"imgproduct/thumb_"+row.image} alt={this.lang(row.title)}/>
                    </td>
                    <td>
                        <a href={window.ADMIN_BASE_URL+"products/edit-product/"+row.productid}> {this.lang(row.title)} </a>
                    </td>
                    <td>
                        <a href="#" onClick={e=>this.goWithUpd(e, "?catid="+row.catid)}> {this.lang(row.ctitle)}</a>
                    </td>
                     <td>
                        <a href={window.ADMIN_BASE_URL+"products-list?userid="+row.userid} onClick={goTo}> {row.firstName}</a>
                    </td>

                    <td class="width_table_btn">
                      <a href={window.ADMIN_BASE_URL+"products/edit-product/"+row.productid} title="Edit" class="fa_edit"></a>
                    </td>
                    <td class="width_table_btn">
                      <a href="#" onClick={e=>this.deleteRow(e,row.productid,"product-remove")} title="Delete" class="fa_delete">
                      </a>
                    </td>
                     <td class="width_table_btn">
                         <a href="#" onClick={e=>this.showHide(e,row.productid, (row.status=="2" ? "1":"2"),"product-show-hide" )} title="Show/Hide" class={row.status=="2" ? "fa_unpublish":"fa_publish"}></a>
                    </td>
                  </tr>
                 )}

             </tbody>
         </table>

          <div class="clear"></div>
          <Pagination
                className="pagination-bar"
                currentPage={this.state.currentPage}
                totalCount={this.state.totalCount}
                pageSize={this.state.pageSize}
                onPageChange={page => this.setCurrentPage(page)}
              />
     </div>



       </div>
    )
  }
}

export default ProductList;