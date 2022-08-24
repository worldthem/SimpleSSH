import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';
import TextEditor from './../layouts/TextEditor.js';
import CategoriesSelect from './../layouts/CategoriesSelect.js';

class CategoriesAddEdit extends HelpersClass{
  constructor(props) {
    super(props);
    this.initState({ row : {},
                     categories : [],
                     title: "Product list",
                     lang:"en"
                   });

  }

   componentDidMount(){
      this.getData(this.props.match.params.id,
                   this.props.match.params.type);
   }

   componentWillReceiveProps(nextProps) {
       this.getData(nextProps.match.params.id,
                    nextProps.match.params.type);
    }

  getData=(catId="", type="")=>{
        this.showLoad();
        this.setState({ lang: this.getLang() });
        axios.get(window.API_URL+'cp/get-category?id='+catId+"&type="+type,this.headers())
             .then(res => {
                    setInput(res.data.category, this.state.lang);

                     this.setState({row: res.data.category == null ? {} : res.data.category,
                                    categories :res.data.categories, lang: this.getLang() });


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
                {this.switchLanguage(window.ADMIN_BASE_URL+"categories/add-edit/"+this.props.match.params.type+"/"+this.props.match.params.id) }
              </>):(<></>)}
           </div>

          <div class="content">
            <form class="formSave" onSubmit={e=>this.formSave(e, "insert-update-category")}  action="#" method="POST">
              <div class="text_align_right">
                <input type="submit" class="btn" value={this.l('Save')} />
              </div>

              <input type="hidden" name="catid" value={this.props.match.params.id} />
              <input type="hidden" name="type" value={this.props.match.params.type} />
              <input type="hidden" name="lang" value={this.state.lang} />
              <div class="col-md-6">
                <p>
                  <label>{this.l('Title')}</label> <br />
                  <input type="text" class="form-control" name="title" />
                </p>
              </div>
              <div class="col-md-6">
                <p>
                  <label>{this.l('Parent')}</label> <br />
                  <select name="parent" class="form-control">
                    <option value="0">{this.l('Select parent')}</option>
                     <CategoriesSelect rows={this.state.categories} type={this.props.match.params.type} catid={this.state.row.parent}/>
                  </select>
                </p>
              </div>
              <div class="clear"></div>

              <div class="col-md-6">
                <p>
                  <label> {this.l('CPU')}</label> <br />
                  <input type="text" class="form-control" name="cpu" />
                </p>
              </div>

              <div class="col-md-6">
                <p>
                  <label>{this.l('External URL')}</label> <br />
                  <input type="text" class="form-control" name="url" />
                </p>
              </div>

              <div class="col-md-6">
                <p>
                  <label>{this.l('Meta description')}</label> <br />
                  <input type="text" class="form-control" name="metad" />
                </p>
              </div>
              <div class="col-md-6">
                <p>
                  <label>{this.l('Meta keyword')}</label> <br />
                  <input type="text" class="form-control" name="metak" />
                </p>
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
export default CategoriesAddEdit;