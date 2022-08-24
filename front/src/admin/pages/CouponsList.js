import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random,
        getPageNr, showEditFields, serialiseByDiv } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import Pagination from '../../pagination/Pagination';


class CouponsList extends HelpersClass {

 types = {fix:"Fixed amount",percent:"Percentage from cart amount"};

  constructor(props) {
    super(props);
   this.initState({
      rows: [],
     });
  }

   componentDidMount(){
       this.getData(getPageNr());
    }

    setCurrentPage=(pageNr=0)=>{
         var search = getUrlParam("search");
         window.location.href= window.ADMIN_BASE_URL+'coupons-list?page='+pageNr+
                                                (search !=""? "&search="+search:"");

         this.setState({currentPage:pageNr < 1 ? 1 : pageNr });
         this.getData(pageNr-1);
      }

   getData=(pageNr=0)=>{
       this.showLoad();
               axios.get(window.API_URL+'cp/get-list-of-coupons?search='+getUrlParam("search")+
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

 updateData =(e, cl, i)=>{
   e.preventDefault();
   var data = serialiseByDiv(cl);

   this.showLoad();
   axios.put(window.API_URL+'cp/coupon-insert-update',
               data,
               this.headers()).
         then(res => {
              this.success(res.data);
              if(res.data=="ok"){
              var rows = this.state.rows;
              rows[i] = data;
              this.setState({rows:rows});
             // setTimeout(function () {
             //     window.location.reload();
             //  }, 200)

              }
         }). catch(error => {
           alert(error);
           this.hideLoad();
         });
 }


  redirectTo=(e, type)=>{
      window.location.href= window.ADMIN_BASE_URL+"coupons-list?search="+document.getElementById("searchEnter").value;
      this.getData(0);
   }


  render() {
    return (
      <div class="card">
          <div class="header">
            <h4 class="title">{this.l('Cuppon')}</h4>
          </div>
          <div class="add_new_top">
            <form action="#" method="post" onSubmit={e=>this.formSave(e, "coupon-insert-update")}>
              <div class="col-md-2">
                <label>{this.l('Discount type')} <br />
                  <select name="type" class="form-control">
                   {Object.entries(this.types).map(([k,v])=>
                      <option value={k}>{this.l(v)}</option>
                   )}
                  </select>
                </label>
              </div>
              <div class="col-md-2">
                <label>{this.l('Cupon Name')} <br />
                  <input type="text" name="title" required="" class="form-control" />
                </label>
              </div>
              <div class="col-md-3">
                <label>{this.l('Coupon amount')} <br />
                  <input type="text" name="amount" required="" class="form-control" />
                </label>
              </div>
              <div class="col-md-1">
                <br />
                <button type="submit" class="btn btn_small"> {this.l('Add new one')}</button>
              </div>
              <div class="clear"></div>
            </form>
          </div>
            <div class="clear"></div>
            <div class="col-md-2">
              <select name="action" class="form-control" id="actionType">
                <option value="">{this.l('Action')}</option>
                <option value="del">{this.l('Remove')} </option>
              </select>
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.bulkActionImpl(e,"coupons-action-bulk")}> {this.l('Apply')} </button>
            </div>
            <div class="col-md-5"><br/></div>
            <div class="col-md-2">
              <input type="text" class="form-control" name="s" id="searchEnter" placeholder={this.l("Search")} />
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.redirectTo(e,"search")}>{this.l("Search")}</button>
            </div>
            <div class="col-md-1">
               <a href={window.ADMIN_BASE_URL+"pages/posts" } onClick={e=>this.resetBtn(e, "coupons-list")} class="btn btn_small btn_active">
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
                  <th>{this.l('ID')}</th>
                  <th>{this.l('Name')}</th>
                  <th>{this.l('Coupon amount')}</th>
                  <th>{this.l('Discount type')}</th>
                  <th style={{ width: '100px' }}> </th>
                  <th>{this.l('Usage')}</th>
                  <th style={{ width: '40px' }}></th>
                  <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                   {this.state.rows.map((row,i) =>
                   <tr class={"cl_"+row.id}>
                    <td>
                        <input type="checkbox" class="checkboxBulk" value={row.id}/>
                        <input type="hidden" name="id" value={row.id}/>
                        <input type="hidden" name="used" value={row.used}/>
                    </td>
                    <td>{row.id}</td>
                    <td>
                      <div class="edit_text">{row.title}</div>
                      <input type="text" class="form-control data_1_get hide_edit" name="title" defaultValue={row.title} />
                    </td>
                    <td>
                      <div class="edit_text">{row.amount}</div>
                      <input type="text" class="form-control data_2_get hide_edit" name="amount" defaultValue={row.amount} />
                    </td>
                    <td>
                      <div class="edit_text">{this.types[row.type]}</div>
                      <select name="type" class="form-control hide_edit">
                        {Object.entries(this.types).map(([k,v])=>
                            <option value={k} selected={row.type==k}>{this.l(v)}</option>
                        )}
                      </select>
                    </td>
                     <td><a href="#" class="btn btn_small hide_edit" onClick={e=>this.updateData(e,"cl_"+row.id,i)}>{this.l("update")}</a></td>
                    <td> {row.used}</td>
                    <td>
                        <a href="#" class="fa_edit" onClick= {e=>showEditFields(e, "cl_"+row.id)}> </a>
                    </td>
                    <td>
                      <a href="#" onClick={e=>this.deleteRow(e, row.id, "coupon-remove")} title="Delete" class="fa_delete"></a>
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

export default CouponsList;