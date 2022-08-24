import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';

class Contactform extends HelpersClass{
  constructor(props) {
    super(props);
    this.initState({
       rows: [],
    });
  }

    componentDidMount(){
       this.showLoad();
      axios.get(window.API_URL+'cp/get-settings-by-param?param=_contact_forms')
           .then(res => {
              this.setState({
                 rows: res.data,
              });
              this.hideLoad();
            }).catch(error => {
               this.hideLoad();
            });
    }


  render() {
    return (

        <div class="card">
          <div class="header">
            <h4 class="title">{this.l('Contact Forms')}</h4>
          </div>

          <div class="add_new_top">
            <form action="#" method="post" onSubmit={e=>this.formSave(e, "insert-update-settings")}>
               <input type="hidden" name="param" value="_contact_forms"/>

               <div class="col-md-4">
                 <label> {this.l('Form name')}</label> <br />
                 <input type="text" name="value" required="" class="form-control" />
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
              <tr>
                <th>ID</th>
                <th>{this.l('Form Title')}</th>
                <th>{this.l('Use Form in page')}</th>
                <th style={{ width: '40px' }}> </th>
                <th style={{ width: '40px' }}> </th>
              </tr>
              </thead>
              <tbody>
                {this.state.rows.map((row) => (
                  <tr>
                    <td>{row.id}</td>
                    <td>
                      <a href={window.ADMIN_BASE_URL+"contact-form-edit/"+row.id}>{row.value}</a>
                    </td>

                    <td>[form id={row.id}]</td>
                    <td>
                      <a href={window.ADMIN_BASE_URL+"contact-form-edit/"+row.id} class="fa_edit small"> </a>
                    </td>
                    <td>
                      <a href="#" class="fa_delete" onClick={e=>this.deleteRow(e, row.id, "remove-settings-by-id")}>
                      </a>
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

export default Contactform;