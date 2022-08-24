import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, getPageNr } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import Pagination from '../../pagination/Pagination';

class PaymentsList extends HelpersClass {

   constructor(props) {
      super(props);
      this.initState({ rows : [],
                       activated:[],
                       title: "Payments list",
                       pageTitle: "Payments",
                    });
    }

  componentDidMount(){
     this.getData();
  }

 getData=()=>{
     this.showLoad();
             axios.get(window.API_URL+'cp/payments/list', this.headers() )
                  .then(res => {
                     this.setState({
                               rows: res.data.rows,
                               activated: res.data.activated
                              });

                     this.hideLoad();
                   }).catch(error => {
                      this.hideLoad();
                   });


       this.showLoad();
 }

  render() {
    return (

        <div class="card">
          <div class="header headerBg">
            <h4 class="title">
              {this.l(this.state.pageTitle)} &nbsp;&nbsp;&nbsp;
            </h4>
          </div>

            <div class="clearfix"></div>

            <div class="content table-responsive table-full-width">
              <table class="table table-hover table-striped">
                <thead>
                 <tr>
                      <th>{this.l('Name')}</th>
                      <th>{this.l('Description')}</th>
                      <th style={{ width: '100px' }}> </th>
                      <th style={{ width: '40px' }}> </th>
                 </tr>
                </thead>
                  <tbody>
                     {this.state.rows.map( row =>
                          <tr>
                            <td>
                              {this.lang(row.title)}
                           </td>
                           <td>
                              {this.lang(row.description)}
                           </td>
                            <td class="width_table_btn">
                             <a href={window.ADMIN_BASE_URL+'checkout-payment-settings/'+row.id} ><i class="fa fa-sliders"></i> {this.l('Settings') } </a>
                           </td>
                            <td class="width_table_btn">
                              <a href="#" onClick={e=>this.showHide(e,row.id, (this.state.activated.includes(row.id) ? "no":"yes"),"payments/show-hide" )} title="Show/Hide" class={this.state.activated.includes(row.id) ? "fa_publish":"fa_unpublish"}></a>
                           </td>
                          </tr>
                     )}
                  </tbody>
              </table>
            </div>
        </div>

    );
  }
}

export default PaymentsList;