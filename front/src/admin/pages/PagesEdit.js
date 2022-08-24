import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import serialize from 'form-serialize';
import HelpersClass from './../../HelpersClass.js';
import {  lang, _l, getUrlParam, setInput } from './../../Helpers.js';
import PageBuilder from './../layouts/pageEditor/PageBuilder.js';


/**
Controller : controllers.cp.PagesAdminController
*/
class PagesEdit extends HelpersClass{

  constructor(props) {
    super(props);
    this.initState({ row : {},
                     title: "Pages add Edit",
                     css:"",
                     style:{},
                   });

  }

   componentDidMount(){
       // get page content
       this.getData(this.props.match.params.id);

   }

   componentWillReceiveProps(nextProps) {
       this.getData(nextProps.match.params.id);
   }

   // get data from the server
     getData=(id="")=>{
           this.showLoad();

           this.setState({ lang: this.getLang() });
           axios.get(window.API_URL+'cp/pages-get-one?pageid='+id,this.headers())
                .then(res => {
                   setInput(res.data, this.getLang());

                   this.setState({
                        row: res.data ,
                        lang: this.getLang() ,
                        style: res.data.styleCollection,
                        css: res.data.css != null ? res.data.css : "",
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

   document.querySelectorAll(".edit_text_this").forEach(el => el.remove());
   body['text']= document.getElementById("page_contents").innerHTML;



  // Request made to the backend api
  // Send formData object
  this.showLoad();
  axios.put(window.API_URL+'cp/pages-insert-update',
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
             {this.duplicateContent('pages-duplicate?pageid='+this.props.match.params.id)}
             {this.switchLanguage(window.ADMIN_BASE_URL+"pages/edit-add-pages/"+this.props.match.params.type+"/"+this.props.match.params.id) }
            </>):(<></>)}
          </div>
          <div class="content">

           <form class="formSave" onSubmit={e=>this.formUpdate(e)} action="#" method="POST">
              <input type="hidden" name="type" value={this.props.match.params.type} />
              <input type="hidden" name="pageid" value={this.props.match.params.id} />
              <input type="hidden" name="lang" value={this.state.lang} />

               <div class="rightSideSave">
                 <a href="#" class="buttonSave cssModal" onClick={this.openCssWindow}><i class="fa fa-code"></i> CSS</a>
                 <button type="submit" class="buttonSave"><i class="fa fa-cloud-upload"></i> {this.l('Save')}</button>
               </div>

              <div class="col-md-6">
                <p>
                  <label>{this.l('Title')}</label> <br />
                  <input type="text" class="form-control" name="title"  required/>
                </p>
              </div>

               <div class="col-md-6">
                 <p>
                      <label>{this.l('CPU')}  </label> <br />
                      <input type="text" class="form-control" name="cpu" required/>
                 </p>
               </div>
                <div class="col-md-6">
                   <p>
                     <label>{this.l('Meta description')}</label> <br />
                     <input type="text" class="form-control" name="metad"/>
                   </p>
                </div>
                <div class="col-md-6">
                    <p>
                       <label>{this.l('Meta keyword')}  </label> <br />
                       <input type="text" class="form-control" name="metak" />
                    </p>
               </div>
                <div class="height30px"></div>
                    <PageBuilder html={this.lang(this.state.row.text)}
                                 css={this.state.css}
                                 style={this.state.style}/>

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
export default PagesEdit;