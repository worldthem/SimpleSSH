 import React from 'react'
 import ReactDOM from 'react-dom'
 import axios from 'axios';
 import HelpersClass from './../../HelpersClass.js';
 import {ShowPrice, lang, _l, getUrlParam, setInput,
         toJsonObj, random,reactSetVal, setValueByClass } from './../../Helpers.js';
 import {SetBulk} from './../../UtilsComponents.js';
 import serialize from 'form-serialize';


class MenuList extends HelpersClass{
    positions = { topMenuLogin:"Top menu when user is login",
                  topMenuNOTLogin:"Top menu when user is NOT login",
                  main:"Main menu",
                  footer:"Footer Menu",
                 }

    constructor(props) {
        super(props);
        this.initState({
                  rows: []
           });
      }

      componentDidMount() {
         this.getData()
      }

       getData=()=>{
         this.showLoad();

         this.setState({ lang: this.getLang() });
         axios.get(window.API_URL+'cp/get-settings-by-param?param=website_menu', this.headers())
              .then(res=> {
                  this.setState({
                      rows: res.data,
                  });

                  this.hideLoad();
                }).catch(error => {
                 alert(error);
                 this.hideLoad();
              });
       }
      
 render() {
      return (
        <div class="card">
          <div class="header">
            <h4 class="title">{this.l('Menu')}</h4>
          </div>
          <div class="add_new_top">
            <form action="#" method="post" onSubmit={e=>this.formSave(e, "insert-update-settings")}>
               <input type="hidden" name="param" value="website_menu" />
               <input type="hidden" name="autoload" value="yes" />

              <div class="col-md-2">
                <label> {this.l('Menu Name')} </label>
                <br />
                <input type="text" name="value" required={true} class="form-control" />
              </div>
              <div class="col-md-3">
                <label> {this.l('Menu Name')} </label>
                <br />
                <select name="value2" class="form-control">
                  <option value="">Select Position</option>
                  {Object.entries(this.positions).map(([key, row])=>(
                     <option value={key}>{this.l(row)}</option>
                  ))}
                </select>
              </div>
              <div class="col-md-2">
                <br />
                <button type="submit" class="btn btn_small"> {this.l('Add New')} </button>
              </div>
              <div class="clear"></div>
            </form>
          </div>
          <div class="content table-responsive table-full-width">
            <table class="table table-hover table-striped">
              <thead>
                <th>ID</th>
                <th>{this.l('Menu Name')}</th>
                <th>{this.l('Position')}</th>
                <th>{this.l('Use menu in code')} </th>
                <th>{this.l('Short code')}</th>
                <th style={{ width: '40px' }}></th>
                <th style={{ width: '40px' }}></th>
              </thead>
              <tbody>
                   {this.state.rows.map(row => (
                     <tr id="edit_this_nr">
                      <td>{row.id}</td>
                      <td>{row.value}</td>
                      <td>{this.l(this.positions[row.value2])}</td>
                      <td>[menu id={row.id}] </td>
                      <td>[menu id={row.id} class=your_class]</td>
                      <td>
                        <a href={window.ADMIN_BASE_URL+"menu-single/"+row.id} class="fa_edit small"></a>
                      </td>
                      <td>
                        <a href="#" class="fa_delete" onClick={e=>this.deleteRow(e, row.id, "remove-settings-by-id")}></a>
                      </td>
                    </tr>
                   ))}
                </tbody>
            </table>
          </div>
        </div>
      );
  }
}

export default MenuList;
