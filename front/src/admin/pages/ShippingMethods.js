import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, getPageNr, setInput, toJsonObj, random, showDivs } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';
import Pagination from '../../pagination/Pagination';

class ShippingMethods extends HelpersClass{


  constructor(props) {
    super(props);
    this.initState({
       rows: [],
       countries:[],
      });
  }

 componentDidMount(){
   this.getData(getPageNr());
 }

 getData=(pageNr=0)=>{
       this.showLoad();

    axios.get(window.API_URL+'cp/get-all-shipping-methods?pageNr='+pageNr,this.headers() )
         .then(res => {
           this.setState({rows: [], countries:[]});
           this.setState({
                 rows: res.data.shipping.content,
                 currentPage: res.data.shipping.pageable.pageNumber +1,
                 totalCount: res.data.shipping.totalElements,
                 pageSize: res.data.shipping.pageable.pageSize,

                countries: res.data.countries });

            this.hideLoad();
          }).catch(error => {
             this.hideLoad();
          });
 }

  setCurrentPage=(pageNr=0)=>{ //alert(pageNr-1);
     window.location.href= window.ADMIN_BASE_URL+'checkout-shipping?page='+pageNr;
     this.setState({currentPage:pageNr < 1 ? 1 : pageNr });
     this.getData(pageNr-1);
  }


// save or add data
    timeout = null;

    update =(e, id, url="")=>{
         e.preventDefault()
         var body = this.serialiseDiv("blockData"+id);

         if(e.target.type=="text" || e.target.type=="password" ||
             e.target.type=="number" || e.target.type=="email"){

                // Clear the timeout if it has already been set.
                // This will prevent the previous task from executing
                // if it has been less than <MILLISECONDS>
                clearTimeout(this.timeout);

                // Make a new timeout set to go off in 1000ms (1 second)
                var _this = this;
                this.timeout = setTimeout(function () {
                    _this.sendDataPut(body, "insert-update-shipping-method");
                }, 1300);

             }else{
                this.sendDataPut(body, "insert-update-shipping-method");
             }
     }



  render() {
    return (
        <div class="card">
          <div class="header">
            <h4 class="title">
              {this.l('Shipping method')}
            </h4>
          </div>
          <div class="add_new_top">
            <form action="#" method="post" onSubmit={e=>this.formSave(e, "insert-update-shipping-method")}>
              <div class="col-md-2">
                <label>{this.l('Title')}</label> <br />
                <div class="blockMultilang">
                    {this.state.allLanguages.map((language,i)=>
                        <div class={"langDivInsert"} style={{display:i>0 ? "none":"" }}>
                          <span class="inputLang">{language}</span>
                          <input type="text" class="form-control" required={true}
                            onClick={e=>showDivs("langDivInsert")}
                              name={'shipping_name['+language+']'} />
                        </div>
                     )}
                </div>
              </div>
              <div class="col-md-2">
                <label> {this.l('Select country') } </label> <br />
                <select class="form-control" name="country">
                 <option value="0">  {this.l('For all countries (Worldwide)') }</option>
                  {this.state.countries.map(country=>
                   <option value={country.id}>{country.country}</option>
                   )}
                </select>
             </div>
              <div class="col-md-2">
                <label>
                  {this.l('Weight')} kg
                  <br />
                  <input type="text" name="weight" class="form-control" />
                   <small> {this.l("Leave empty if you don't use Weight") }</small>
                </label>
              </div>

              <div class="col-md-2">
                   <label>  {this.l('Shipping calculation') } <br />
                        <select name="type_shipping" class="form-control" required={true}>
                         <option  value="2"> {this.l('Fixed') }</option>
                         <option value="3" > {this.l('Percentage from Total') }</option>
                       </select>
                   </label>
               </div>
                <div class="col-md-2">
                  <label>  {this.l('Fixed Or') } %<br />
                    <input type="text" name="price" class="form-control" placeholder="25" required={true}/>
                  </label>
                 <small> {this.l('Fixed Price 25$ OR  Percentage 25% from basket total') }</small>
                </div>
                 <div class="col-md-2" style={{background: "#A2A2A2"}}>
                    <label>  {this.l('Free') } <br />
                     <input type="text" name="free_delivery" class="form-control" placeholder="1000" />
                    </label>
                  <small> {this.l("Free when basket total is bigger than this amount, leave empty if don't need") }}</small>
                </div>

                 <div class="col-md-12 text_align_right"><br />
                    <button type="submit" class="btn btn_small"> {this.l('Add new one') }</button>
                </div>

              <div class="clear"></div>
            </form>
          </div>

          <form action="#" method="post">
            <div class="col-md-2">
              <select name="action" class="form-control" id="actionType">
                <option value="">{this.l('Action')}</option>
                <option value="del"> {this.l('Remove')} </option>
                <option value="1"> {this.l('Show')} </option>
                <option value="2"> {this.l('Hide')} </option>
              </select>
            </div>

            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.bulkActionImpl(e,"shipping-method-action")}>
                {this.l('Apply')}
              </button>
            </div>

            <div class="clear"></div>

            <div class="content table-responsive table-full-width">
              <table class="table table-hover table-striped">
                <thead>
                 <tr>
                  <th style={{ width: '40px' }}>
                    <SetBulk cssClass="checkboxBulk"/>
                  </th>
                  <th style={{ width: '30px' }}>{this.l('ID')}</th>
                  <th style={{ width: '50px' }}> {this.l('Show') +" / "+ this.l('Hidden') }</th>
                  <th> {this.l('Title') }</th>
                  <th> {this.l('Country') }</th>
                  <th> {this.l('Weight(kg)') }</th>
                  <th> {this.l('Shipping Calculation') }</th>
                  <th> {this.l('Fixed Price OR  Percentage') }(%)</th>
                  <th> {this.l('Free delivery') }</th>
                  <th style={{ width: '40px' }}></th>
                  <th style={{ width: '40px' }}></th>
                 </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((row) => (
                    <tr id={"blockData"+row.id}>
                      <td>
                         <input type="hidden" name="id" value={row.id} />
                         <input type="checkbox" class="checkboxBulk" value={row.id}/>
                      </td>
                      <td>{row.id}</td>
                      <td>
                         <a href="#" onClick={e=>this.showHide(e,row.id, (row.status=="2" ? "1":"2"),"shipping-method-show-hide" )} title="Show/Hide" class={row.status=="2" ? "fa_unpublish":"fa_publish"}></a>
                      </td>
                      <td>
                         <div class="blockMultilang">
                           {this.state.allLanguages.map((language, i)=>
                               <div class={"langDiv"+row.id} style={{display:i>0 ? "none":"" }}>
                                 <span class="inputLang">{language}</span>
                                 <input type="text" class="form-control"
                                         onChange={e=>this.update(e, row.id)} onClick={e=>showDivs("langDiv"+row.id)}
                                        defaultValue={this.lang(row.shipping_name, language)} required={true} name={'shipping_name:'+language} />
                               </div>
                            )}
                          </div>
                      </td>
                        <td>
                          <select defaultValue={row.country} class="form-control" name="country" onChange={e=>this.update(e, row.id)}>
                            <option value="0">  {this.l('For all countries (Worldwide)') }</option>
                            {this.state.countries.map((country, i)=>
                             <option value={country.id}>{country.country}</option>
                             )}
                          </select>
                       </td>
                        <td>
                            <input type="text" name="weight" defaultValue={row.weight} onChange={e=>this.update(e, row.id)} class="form-control" />
                       </td>

                       <td>
                          <select name="type_shipping" defaultValue={row.type_shipping} onChange={e=>this.update(e, row.id)} class="form-control" required={true}>
                            <option  value="2"> {this.l('Fixed') }</option>
                            <option value="3" > {this.l('Percentage from Total') }</option>
                          </select>
                       </td>

                       <td>
                          <input type="text" name="price" defaultValue={row.price}
                                onChange={e=>this.update(e, row.id)} class="form-control" placeholder="25" required={true}/>
                       </td>
                      <td>
                        <input type="text" name="free_delivery" defaultValue={row.free_delivery}
                                             onChange={e=>this.update(e, row.id)}/>
                      </td>
                      <td>
                        <a href="#" class="fa_delete" onClick={e=>this.deleteRow(e, row.id, "shipping-method-remove")}> </a>
                      </td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>

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

export default ShippingMethods;