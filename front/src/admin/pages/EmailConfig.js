import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput,
        toJsonObj, random, reactSetVal, setValueByClass, fromJson } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';


class EmailConfig extends HelpersClass{
  constructor(props) {
    super(props);
    this.initState({
          row: {},
          title:'Email Settings',
          sendTestResponse:'',
        });
  }

  componentDidMount() {
     this.showLoad();
     this.setState({ lang: this.getLang() });
     axios.get(window.API_URL+'cp/get-one-line-settings-by-param?param=_email_settings', this.headers())
          .then(res => {
              var value1 = fromJson(res.data.value1);
               setInput(value1, "en");

             this.setState({row: res.data });
             this.hideLoad();
           }).catch(error => {
              this.hideLoad();
           });
  }

  formUpdate =(e)=>{
     e.preventDefault()
     const form = e.currentTarget
     const body = serialize(form, {hash: true, empty: false})

      var data ={ id: this.state.row.id,
                  param: "_email_settings",
                  value:"",
                  value1:JSON.stringify(body),
                  value2:""
                };

    // Request made to the backend api
    // Send formData object
    this.showLoad();
    axios.put(window.API_URL+'cp/insert-update-settings',
                data,
                this.headers()).
          then(res => {
               this.success(res.data);
               if(res.data=="ok"){

               setTimeout(function () {
                   window.location.reload();
                }, 200)

               }
          }). catch(error => {
            alert(error);
            this.hideLoad();
          });

    }

   sendTestMail =(e)=>{
        e.preventDefault()

       // Request made to the backend api
       // Send formData object
        this.showLoad();
        this.setState({sendTestResponse:""});
       axios.get(window.API_URL+'cp/send-test-email?to='+
                               document.getElementById("sendTestEmail").value+
                              '&text='+document.getElementById("sendTestText").value, this.headers()).
             then(res => {
                  this.success(res.data);
                  this.setState({sendTestResponse:res.data});
            }). catch(error => {
               alert(error);
               this.hideLoad();
             });

       }

  render() {
    return (

        <div class="card">
             <div class="header headerBg">
               <h4 class="title">
                  {this.l(this.state.title)}
               </h4>
             </div>

          <div class="col-md-6">
            <form action="#" method="post" onSubmit={this.formUpdate}>
              <table class="table_admin_settings">
                <tr>
                  <th>{this.l('Global "From" Name')}</th>
                  <td>
                    <div class="col-md-12">
                      <input type="text" class="form-control" name="fromname" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>{this.l('Global "From" Email')}</th>
                  <td>
                    <div class="col-md-12">
                      <input type="text" class="form-control" name="fromemail" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>{this.l('SMTP Host Address')}</th>
                  <td>
                    <div class="col-md-12">
                      <input type="text" class="form-control" name="host" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>{this.l('SMTP Host Port')}</th>
                  <td>
                    <div class="col-md-12">
                      <input type="text" class="form-control" name="port" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>{this.l('SMTP Server Username')}</th>
                  <td>
                    <div class="col-md-12">
                      <input type="text" class="form-control" name="username" autoComplete={false} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>{this.l('SMTP Server Password')}</th>
                  <td>
                    <div class="col-md-12">
                      <input type="password" class="form-control" placeholder="*********" name="password" autoComplete={false} />
                    </div>
                  </td>
                </tr>
              </table>
              <div class="col-md-12">
                <input type="submit" class="btn btn_small" value={this.l('Update')} />
              </div>
            </form>
          </div>
          <div class="col-md-6">
            <form action="#" method="post" onSubmit={this.sendTestMail}>
              <h3>{this.l('Send test mail')}</h3>
              <br />
              <div class="col-md-12"> {this.l('To')} <br />
                <input type="text" class="form-control" id="sendTestEmail" placeholder="your-email@domain.com" required="" />
                <br />
              </div>
              <div class="col-md-12"> {this.l('Text')} <br />
                <textarea class="form-control" placeholder="Test emil from"  id="sendTestText" required="">
                        Test emil from
                      </textarea>
              </div>
              <div class="col-md-12">
                <br />
                <br />
                <input type="submit" class="btn btn_small" value={this.l('Send')} />
              </div>
            </form>
            <div class="height20px"></div>
            <h4>{this.state.sendTestResponse}</h4>
          </div>
          <div class="height20px"></div>
        </div>

    );
  }
}

export default EmailConfig;