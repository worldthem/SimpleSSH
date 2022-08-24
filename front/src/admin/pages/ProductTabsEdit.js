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
class ProductTabsEdit extends HelpersClass{
  constructor(props) {
    super(props);
    this.initState({ row : {},
                     categories : [],
                     title: "Categories add Edit",
                     lang : "en",
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
             {this.switchLanguage(window.ADMIN_BASE_URL+"pages/edit-add-tabs/"+this.props.match.params.type+"/"+this.props.match.params.id) }
            </>):(<></>)}
          </div>
          <div class="content">
            <form class="formSave" onSubmit={e=>this.formSave(e, "pages-insert-update")} action="#" method="POST">
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
                 <div class="col-md-6">
                    <p>
                      <label>{this.l('Position')} Example: 1,2,3,...</label> <br />
                      <input type="number" class="form-control" name="sort" required/>
                    </p>
                 </div>
                <div class="col-md-6 text_align_right">
                   <p> <br/>
                      <input type="submit" class="btn" value={this.l('Save')} />
                   </p>
                </div>
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
            </form>
          </div>
        </div>

    );
  }
}
export default ProductTabsEdit;