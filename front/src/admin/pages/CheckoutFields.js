import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, showEditFields } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';


class CheckoutFields extends HelpersClass {
  constructor(props) {
    super(props);

     this.initState({ row : {},
                      fields:{},
                      name:{},
                      title: "Checkout fields",
                      lang: 'en',
                      type :""
                   });
  }


   componentDidMount(){
      this.getData(this.props.match.params.type);
      this.setState({typeStyle: this.props.match.params.type == "var" ? "none":"", type: this.props.match.params.type});
   }

   componentWillReceiveProps(nextProps) {
     if(nextProps.match.params.type != ""){
        this.getData(nextProps.match.params.type);
        this.setState({typeStyle: nextProps.match.params.type=="var"? "none":"", type: nextProps.match.params.type});
     }
   }


   getData=(type)=>{
     this.showLoad();
     this.setState({type : type });
     axios.get(window.API_URL+'cp/get-billing-shipping-data/'+type,this.headers() )
          .then(res => {
             this.setState({
               row: res.data.dbFields == null ? {} : res.data.dbFields,
               fields: res.data.configFields == null ? {} : res.data.configFields,
               name: res.data.title == null ? {} : res.data.title,
             });

             this.hideLoad();
           }).catch(error => {
              this.hideLoad();
           });

   }

 getArrayVal=(key1="", key2="", key3="")=>{

  try{
    if(key3 !=""){
      return this.state.row[key1][key2][key3];
    }else if(key2 !="" && key3 ==""){
      return this.state.row[key1][key2];
    }else {
      return this.state.row[key1];
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
     var title = typeof body.title != "undefined" ? body.title : {en : this.state.fields.title};

     delete body.title;

     for (const k in body){
       if(body[k]["enable"] =="yes"){
         data[k] = body[k];
       }
     }

    this.showLoad();
    axios.put(window.API_URL+'cp/update-billing-shipping/'+this.state.type, {value:JSON.stringify(title), value1: JSON.stringify( data)}, this.headers() )
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
             { this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1) + " Fields"} &nbsp;&nbsp;&nbsp;
          </h4>
          <input type="submit" class="btn btn_small" value={this.l( 'Update')}  style={{float:"right"}}/>
       </div>


        <div class="content table-responsive table-full-width">
            <table class="table table-hover table-striped">
          <tbody>
            <tr>
            <td></td>
            <td id="edit_title" class={"cl_title"} style={{ verticalAlign: 'middle' }} colspan="2">
                <div class="blockMultilang">
                      <label>
                        {typeof this.state.name[this.state.allLanguages[0]] !="undefined" ? this.state.name[this.state.allLanguages[0]] : this.state.fields.title}

                      </label>

                        <div class="hide_edit blockMultilang">
                        {this.state.allLanguages.map((lang) => (
                          <>
                            <span class="inputLang"> {lang} </span>
                            <input type="text" defaultValue={typeof this.state.name[lang] !="undefined" ? this.state.name[lang] : ""} class="form-control show_edit" name={ 'title[' + lang + ']'} />
                          </>
                        ))}
                        </div>
                    </div>
            </td>

            <td colspan="4" style={{textAlign:"right"}}>
             <a href="#" class="fa_edit" onClick= {e=>showEditFields(e, "cl_title")}> </a>
            </td>

            </tr>

            {Object.entries(this.state.fields).map(([key, value], i) => (
             <>
               {key == 'title' ? (<></>) :
                  (<tr id={ 'edit_' + key} class={"options_each cl_"+key}>
                        <td style={{ verticalAlign: 'middle' }}>
                            <label class="switch show_edit">
                               <input type="checkbox" class="checkbox show_edit" defaultChecked={typeof this.state.row[key] != "undefined"} name={key + '[enable]'} value="yes" />
                               <span class="slider round"></span>
                            </label>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <div class="edit_text"> {this.getArrayVal(key, "title", lang) !=""? this.getArrayVal(key, "title", this.state.allLanguages[0]) : value} </div>
                          <div class="hide_edit blockMultilang">
                             {this.state.allLanguages.map((lang) => (
                                <>
                                  <span class="inputLang">{lang} </span>
                                  <input type="text" class="form-control show_edit"
                                     defaultValue={this.getArrayVal(key, "title", lang) == "" ? value : this.getArrayVal(key, "title", lang)}
                                     name={ key+'[title][' + lang + ']'} />
                                </>
                             ))}
                           </div>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                            <label class="show_edit"> {this.l('Show title')} </label>
                            <br />
                            <label class="switch show_edit">
                             <input type="checkbox" class="checkbox show_edit" defaultChecked={this.getArrayVal(key, "showTitle") =="yes"} name={ key+'[showTitle]'} value="yes" />
                                  <span class="slider round"></span>
                           </label>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                            <label class="show_edit"> {this.l('Required')} </label>
                            <br />
                            <label class="switch show_edit">
                             <input type="checkbox" class="checkbox show_edit" defaultChecked={this.getArrayVal(key, "required") =="yes"} name={ key+'[required]'} value="yes" /> <span class="slider round"></span> </label>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                            <label> {this.l('Field width')}
                                <br />
                                <select defaultValue={this.getArrayVal(key, "boxLength")} name={ key+'[boxLength]'} class="form-control show_edit">
                                  <option value="half">{this.l('Half')}</option>
                                  <option value="full">{this.l('Full')}</option>
                                </select>
                            </label>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                             <label> {this.l('Field Type Box')}
                                <br />
                                <select defaultValue={this.getArrayVal(key, "boxType")} name={ key+'[boxType]'} class="form-control show_edit">
                                    <option value="textbox"> {this.l('Textbox')} </option>
                                    <option value="textarea"> {this.l('Textarea')} </option>
                                </select>
                            </label>
                        </td>
                         <td style={{ verticalAlign: 'middle',textAlign:"right" }}>
                            <a href="#" class="fa_edit" onClick= {e=>showEditFields(e, "cl_"+key)}> </a>
                         </td>
                    </tr> )}
                    </>
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

export default CheckoutFields;