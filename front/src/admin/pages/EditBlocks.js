import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import serialize from 'form-serialize';
import HelpersClass from './../../HelpersClass.js';
import {  lang, _l, getUrlParam, setInput, fromJson } from './../../Helpers.js';

import PageBuilder from './../layouts/pageEditor/PageBuilder.js';
import TextEditor from './../layouts/TextEditor.js';

/**
Controller : controllers.cp.PagesAdminController
*/
class EditBlocks extends HelpersClass{

  constructor(props) {
    super(props);
    this.initState({ row : {},
                     title: "Blocks",
                     css:"",
                     style:{},
                     lang:"en"
                   });

  }

   componentDidMount(){
       // get page content
       this.getData(this.props.match.params.param);

   }

   componentWillReceiveProps(nextProps) {
       this.getData(nextProps.match.params.param);
   }

   // get data from the server
     getData=(param="")=>{
           this.showLoad();

           this.setState({ lang: this.getLang() });
           axios.get(window.API_URL+'cp/get-one-line-settings-by-param?param='+param, this.headers())
                .then(res => {
                   var css = fromJson(res.data.value);

                   this.setState({
                        row: res.data ,
                        lang: this.getLang() ,
                        style: css.style,
                        css: css.css,
                      });

                   this.hideLoad();

                }).catch(error => {
                   alert(error);
                   this.hideLoad();
                });
       }


  formUpdate =(e)=>{
   e.preventDefault()
   const form = e.currentTarget
   const body = serialize(form, {hash: true, empty: false})

    var html = fromJson(this.state.row.value1);
    if(this.props.match.params.type =="editor"){
        html[this.state.lang] = body["value1"];
        body['value1']= JSON.stringify(html) ;

        body['value'] = JSON.stringify({style:"",css:""});
    }else{
    document.querySelectorAll(".edit_text_this").forEach(el => el.remove());
    html[this.state.lang] =document.getElementById("page_contents").innerHTML
    body['value1']= JSON.stringify(html) ;

    body['value']= JSON.stringify({css:body["css"], style:fromJson(body["style"])});

    }


  // Request made to the backend api
  // Send formData object
  this.showLoad();
  axios.put(window.API_URL+'cp/insert-update-settings',
              body,
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



  render() {
    return (
       <div class="card">
          <div class="header headerBg">
            <div class="title">
               { this.props.match.params.id =="0"? this.l('Create new') : this.l('Edit')}
            </div>
             {this.props.match.params.id !="0"? (<>
             {this.duplicateContent('settings-duplicate?id='+this.state.row.id)}
             {this.switchLanguage(window.ADMIN_BASE_URL+"editable-blocks/"+this.props.match.params.param+"/"+this.props.match.params.type) }
            </>):(<></>)}
          </div>
          <div class="content">

           <form class="formSave" onSubmit={e=>this.formUpdate(e)} action="#" method="POST">
              <input type="hidden" name="param" value={this.props.match.params.param} />
              {this.state.row.id ? (<input type="hidden" name="id" value={this.state.row.id} />) :(<></>)}


                {this.props.match.params.type =="editor"?
                   ( <div class="col-md-12">
                        <TextEditor html={this.lang(this.state.row.value1)} textareaName="value1"/>
                     </div>):
                   (<PageBuilder html={this.lang(this.state.row.value1)}
                                 css={this.state.css}
                                 style={this.state.style}/>)
                   }


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
export default EditBlocks;