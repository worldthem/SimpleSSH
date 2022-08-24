import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';

import TextEditor from './../layouts/TextEditor.js';
import CategoriesSelect from './../layouts/CategoriesSelect.js';
import CategoriesCheckboxes from './../layouts/CategoriesCheckboxes.js';
import serialize from 'form-serialize';

/**
Controller : controllers.cp.PagesAdminController
*/
class PostsEdit extends HelpersClass{
  constructor(props) {
    super(props);
    this.initState({ row : {},
                     categories : [],
                     title: "Posts",
                     postCatId:[],
                     categoriesList:[],
                     categoriesType:{}
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

        axios.get(window.API_URL+'cp/pages-get-one-with-categories?pageid='+id+"&type=posts",this.headers())
             .then(res => {
                setInput(res.data.page, this.getLang());
                this.setState({row: res.data.page,
                               categoriesType: res.data.catTypes,
                               categoriesList: res.data.categories,
                               lang: this.getLang(),
                               postCatId: res.data.page.catids,
                               });

                this.hideLoad();
             }).catch(error => {
                alert(error);
                this.hideLoad();
             });
    }
/*
      formSave =(e, url)=>{
         e.preventDefault()
         const form = e.currentTarget
         const body = serialize(form, {hash: true, empty: false})


      //   var catId= body.catid, i =0, cats = [];
      //   for(var cat in  catId){
      //      cats[i++] = {catid:catId[cat] };
      //    }
      //    alert(JSON.stringify(cats));
      //    body["categories"] = cats;
          //

       //  body.catid = JSON.stringify(body.catid);

        //alert(JSON.stringify(body.categories));

        // Request made to the backend api
        // Send formData object
        this.showLoad();
        axios.put(window.API_URL+'cp/'+url,
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
      }*/


  render() {
    return (
       <div class="card">
          <div class="header headerBg">
            <div class="title">
               { this.props.match.params.id =="0"? this.l('Create new') : this.l('Edit')}
            </div>
             {this.props.match.params.id !="0"? (<>
             {this.duplicateContent('pages-duplicate?pageid='+this.props.match.params.id)}
             {this.switchLanguage(window.ADMIN_BASE_URL+"pages/edit-add-posts/"+this.props.match.params.type+"/"+this.props.match.params.id) }
            </>):(<></>)}
          </div>

         <form class="formSave" onSubmit={e=>this.formSave(e, "pages-insert-update")} action="#" method="POST">
          {/*Left side*/}
          <div class="col-md-9 productSingle" style={{paddingLeft:"0px"}}>
           <div class="card">
            <div class="content">

              <input type="hidden" name="type" value={this.props.match.params.type} />
              <input type="hidden" name="pageid" value={this.props.match.params.id} />

              <input type="hidden" name="lang" value={this.state.lang} />

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
              <div class="clear"></div>
              <div class="height20px"></div>
              <div class="col-md-12">
                 <TextEditor html={this.lang(this.state.row.text)} textareaName="text"/>
              </div>
              <div class="height10px"></div>
              <div class="text-center">
                <input type="submit" class="btn" value={this.l('Save')} />
              </div>

           </div>
           </div>
          </div>
          {/*End Left side*/}

          {/*Right side*/}
          <div class="col-md-3" style={{paddingRight:"0px"}}>
                <div class="card padding_10px">
                    <h3 class="margin_top_0px">{this.l('Publish')}</h3>
                    <button type="submit" class="btn">{this.l('Save')}</button>
                </div>

                 <CategoriesCheckboxes rows={this.state.categoriesList}
                                       types={this.state.categoriesType} catid={this.state.postCatId} />


          </div>
          {/*End Right side*/}
          </form>
        </div>


    );
  }
}
export default PostsEdit;