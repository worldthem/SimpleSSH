import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, showEditFields } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';

class Currencies extends HelpersClass{
   constructor(props) {
      super(props);

       this.initState({ rows : {},
                        defaultData:{},
                        name:{},
                        title: "Currencies",
                     });
    }


     componentDidMount(){
        this.getData();
     }



     getData=( )=>{
       this.showLoad();
       axios.get(window.API_URL+'cp/get-list-of-currencies',this.headers() )
            .then(res => {

               // here is a big list of currencies, so we need to put on first place the activated currencies,
               // we do it bellow
               const jsonConfig = res.data.jsonFileData == null ? {} : res.data.jsonFileData;
               const dbData = res.data.dbData == null ? {} : res.data.dbData;
               const obj1 = {};
               for (const key in dbData){
                 obj1[key] = jsonConfig[key];
                 delete jsonConfig[key]
               }
               Object.assign(obj1, jsonConfig); // merge two objects
               // end

               this.setState({
                      rows: dbData,
                      defaultData: obj1
                });

               this.hideLoad();
             }).catch(error => {
                this.hideLoad();
             });

     }

   getArrayVal=(key1="", key2="", key3="")=>{

    try{
      if(key3 !=""){
        return this.state.rows[key1][key2][key3];
      }else if(key2 !="" && key3 ==""){
        return this.state.rows[key1][key2];
      }else {
        return this.state.rows[key1];
      }

    }catch(err){
       return  "";
    }
 }

  formSave=(e )=>{
       e.preventDefault()
       const form = e.currentTarget
       const body = serialize(form, {hash: true, empty: false})

       var data = {};

       for (const k in body){
         if(body[k]["enable"] =="yes"){
           data[k] = body[k];
         }
       }

      this.showLoad();
      axios.put(window.API_URL+'cp/update-currencies', {value1:JSON.stringify(data)}, this.headers() )
           .then(res => {
               if(res.data != "ok")
                  alert(res.data)
                 else
                  window.location.reload();

                 this.hideLoad();
            }).catch(error => {
                this.hideLoad();
             });
    }

    render() {
      return (
      <div class="card">
       <form class="formSave" action="#" method="POST" onSubmit={ this.formSave}>
          <div class="header headerBg">
            <h4 class="title">
                {this.l("Currencies")}
            </h4>
            <input type="submit" class="btn btn_small" value={this.l( 'Update')}  style={{float:"right"}}/>
         </div>


          <div class="content table-responsive table-full-width">
            <table class="table table-hover table-striped">
             <tbody>

              {Object.entries(this.state.defaultData).map(([key, value], i) => (
                <tr id={ 'edit_' + key} class={"options_each cl_"+key}>
                          <td style={{ verticalAlign: 'middle' }}>
                              <label class="switch show_edit">
                              <input type="checkbox" class="checkbox show_edit" defaultChecked={typeof this.state.rows[key] != "undefined"} name={key + '[enable]'} value="yes" />
                              <span class="slider round"></span> </label>
                          </td>
                          <td style={{ verticalAlign: 'middle' }}> {key} </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div class="edit_text">
                            {this.l('Code')} :
                            <span dangerouslySetInnerHTML={{ __html: this.getArrayVal(key, "code") == "" ? value : this.getArrayVal(key, "code") }} />
                             </div>
                            <div>
                                <input type="text" class="how_edit width140px"
                                       defaultValue={this.getArrayVal(key, "code") == "" ? value : this.getArrayVal(key, "code")}
                                       name={ key+'[code]'} />
                             </div>
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                              <label class="show_edit"> {this.l('Main Currency')} {this.getArrayVal(key, "main")}</label>
                              <br />
                              <label class="switch show_edit">
                               <input type="checkbox" class="checkbox show_edit" defaultChecked={this.getArrayVal(key, "main")} name={ key+'[main]'} value="yes" />
                                    <span class="slider round"></span>
                             </label>
                          </td>

                          <td style={{ verticalAlign: 'middle' }}>
                              <label> {this.l('Align')}
                                  <br />
                                  <select defaultValue={this.getArrayVal(key, "type")} name={ key+'[type]'} class="width140px">
                                      <option value="left">{this.l('Left')}</option>
                                      <option value="left-space">{this.l('Left with space')}</option>
                                      <option value="right">{this.l('Right')}</option>
                                      <option value="right-space">{this.l('Right with space')}</option>

                                  </select>
                              </label>
                          </td>
                           <td style={{ verticalAlign: 'middle' }}>
                               {this.l('Rate(to main currency)')} <br />
                                   <input type="text" class="show_edit width60px"
                                   defaultValue={this.getArrayVal(key, "rate") == "" ? "1" : this.getArrayVal(key, "rate")}
                                   name={key + '[rate]'} />

                           </td>

                      </tr>
                    ))}

               </tbody>
            </table>
          </div>
          <div class="col-md-12 text_align_right">
              <input type="submit" class="btn btn_small" value={this.l( 'Update')} /> </div>
          <div class="height15px"></div>
        </form>
      </div>
      );
    }
  }

export default Currencies;