import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, getPageNr } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import Pagination from '../../pagination/Pagination';
import serialize from 'form-serialize';


class PaymentSetting extends HelpersClass {

   constructor(props) {
      super(props);
      this.initState({ row : {},
                       activated: false,
                       adminForm:"",
                       title: "Payments list",
                       pageTitle: "Payments",
                    });
    }

  componentDidMount(){
       this.getData();
  }

  componentWillReceiveProps(nextProps) {
     this.getData(nextProps.match.params.id);
   }

 getData=()=>{
     this.showLoad();
             axios.get(window.API_URL+'cp/payments/settings?id='+this.props.match.params.id+"&wlang="+this.getLang(), this.headers() )
                  .then(res => {
                     //alert(JSON.stringify(res.data));
                     this.setState({
                                   row: res.data.payment,
                                   activated: res.data.activated,
                                   adminForm: res.data.adminForm
                                  });

                     this.hideLoad();
                   }).catch(error => {
                      this.hideLoad();
                   });
     this.showLoad();
 }

    formSave =(e)=>{
      e.preventDefault()
      const form = e.currentTarget
      const body = serialize(form, {hash: true, empty: true})

      //alert(JSON.stringify(body))


     // Create an object of formData
     const formData = new FormData();

     const formContainer = document.getElementById("formEditModule");
     const inputs = formContainer.getElementsByTagName('input');
       // here we put input type file
       for(var index = 0; index < inputs.length; ++index) {
          if( inputs[index].type=="file"){
             formData.append( inputs[index].name, inputs[index].files[0]);
             }
       }

        //here we put the rest
        for(var data in body){
            var value = typeof body[data] =="object" ? JSON.stringify(body[data]) : body[data];
            formData.append( data, value);
       }


     // Request made to the backend api
     // Send formData object
     this.showLoad();
     axios.put(window.API_URL+'cp/payments/store',
                 formData,
                 this.headers()).
           then(res => {
                this.success(res.data);
           }). catch(error => {
             alert(error);
             this.hideLoad();
           });
    }

  setEnable=(e)=>{
     this.setState({activated: e.target.checked});
  }

  render() {
    return (

        <div class="card">
          <div class="header headerBg">
              <div class="title">
                 { this.state.row.title}
              </div>
               {this.switchLanguage(window.ADMIN_BASE_URL+"checkout-payment-settings/"+this.props.match.params.id) }
            </div>

          <div class="clearfix"></div>
          <div class="content">
            <form class="formSave" id="formEditModule" onSubmit={e=>this.formSave(e, "pages-insert-update")} action="#" method="POST">
              <input type="hidden" name="payment" value={this.props.match.params.id} />
              <input type="hidden" name="id" value={this.props.match.params.id} />
              <input type="hidden" name="lang" value={this.getLang()} />

             <table class="table_admin_settings">
              <tbody>
                  <tr>
                     <th>{this.l("Enable")}</th>
                     <td>
                        <label class="switch show_edit">
                           <input type="checkbox" class="checkbox" checked={this.state.activated} onChange={this.setEnable} name="enable" value="yes" />
                           <span class="slider round"></span>
                        </label>
                    </td>
                  </tr>
              </tbody>
             </table>

              <div dangerouslySetInnerHTML={{__html: this.state.adminForm}} />

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

export default PaymentSetting;