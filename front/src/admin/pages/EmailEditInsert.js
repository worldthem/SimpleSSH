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
class EmailEditInsert extends HelpersClass{
  dataStatusOrders= ["success", "pending", "processing", "canceled", "refunded"];
  dataStatusAccount= ["new-account","reset-password"];

  constructor(props) {
    super(props);
    this.initState({ row : {},
                     categories : [],
                     title: "Email Template",
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

        axios.get(window.API_URL+'cp/pages-get-one?pageid='+id,this.headers())
             .then(res => {
                setInput(res.data, this.getLang());
                this.setState({row: res.data , lang: this.getLang()});

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
             {this.props.match.params.id !="0"? (<>
             {this.duplicateContent('pages-duplicate?pageid='+this.props.match.params.id)}
             {this.switchLanguage(window.ADMIN_BASE_URL+"pages//edit-add-emails/"+this.props.match.params.type+"/"+this.props.match.params.id) }
            </>):(<></>)}
          </div>
          <div class="content">
            <form class="formSave" onSubmit={e=>this.formSave(e, "pages-insert-update")} action="#" method="POST">
              <input type="hidden" name="type" value={this.props.match.params.type} />
              <input type="hidden" name="pageid" value={this.props.match.params.id} />

              <input type="hidden" name="lang" value={this.state.lang} />

               <div class="col-md-6">
                 <p>
                      <label>{this.l('Select type') } </label> <br/>
                      <select class="form-control" name="direction">
                            <optgroup label="Orders">
                             {this.dataStatusOrders.map(type=>
                               <option value={type} select={type==this.state.row.direction}> {type} </option>
                             )}
                            </optgroup>
                            <optgroup label="Account">
                             {this.dataStatusAccount.map(type=>
                              <option value={type} select={type==this.state.row.direction}> {type} </option>
                             )}
                            </optgroup>

                      </select>
                  </p>
                </div>
               <div class="col-md-6"></div>
               <div class="clear"><br/></div>
              <div class="col-md-6">
                <p>
                  <label>{this.l('Title')}</label> <br />
                  <input type="text" class="form-control" name="title"  required/>
                </p>
              </div>
              <div class="col-md-6">
                <p>
                  <label>{this.l('Subject')}</label> <br />
                  <input type="text" class="form-control" name="subject" required/>
                </p>
              </div>
              <div class="clear"></div>
              <div class="col-md-12">
                <h3> {this.l("Replace this short code with your need")}:</h3>
                     <b>[order_number]</b>  - {this.l("This will show the order number")} <br />
                     <b>[products]</b>  - {this.l("Product List")} <br />
                     <b>[billing_shiping]</b> - {this.l("Billing information")} <br />
                     <b>[order_amount]</b> - {this.l("Total order ammount")}<br />
                     <b>[first_name]</b> - {this.l("Billing first name")} <br />
                     <b>[last_name]</b> - {this.l("Billing last name")} <br /><br />
                       {this.l("This is for new account and reset password")}<br />
                     <b>[email]</b> - {this.l("User Login(email)")}<br />
                     <b>[reseturl]</b> - {this.l("Reset Link (for reset password)")}<br />
              </div>
              
              <div class="height20px"></div>
              <div class="col-md-12">
                 <TextEditor html={this.lang(this.state.row.text)} textareaName="text"/>
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
export default EmailEditInsert;