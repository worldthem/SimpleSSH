import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';


class Countries extends HelpersClass{
  constructor(props) {
    super(props);
    this.initState({
       rows: [],
    });
  }

 componentDidMount(){
    this.showLoad();
   axios.get(window.API_URL+'cp/get-all-countries',this.headers() )
        .then(res => {
           this.setState({rows: res.data});

           this.hideLoad();
         }).catch(error => {
            this.hideLoad();
         });
 }

// save or add data
   timeout = null;

   update =(e, id)=>{
       e.preventDefault()
       var body = this.serialiseDiv("blockData"+id);

       if(e.target.type=="text" || e.target.type=="password" ||
           e.target.type=="number" || e.target.type=="email"){

              // Clear the timeout if it has already been set.
              // This will prevent the previous task from executing
              // if it has been less than <MILLISECONDS>
              clearTimeout(this.timeout);

              // Make a new timeout set to go off in 1000ms (1 second)
              var _this = this;
              this.timeout = setTimeout(function () {
                  _this.sendDataPut(body, "insert-update-country");
              }, 1300);

           }else{
              this.sendDataPut(body, "insert-update-country");
           }
   }


  render() {
    return (
        <div class="card">
          <div class="header">
            <h4 class="title">
              {this.l('Shipping Countries or States or Regions')}
            </h4>
          </div>
          <div class="add_new_top">
            <form action="#" method="post" onSubmit={e=>this.formSave(e, "insert-update-country")}>
              <div class="col-md-2">
                <label> {this.l('Title')} <br />
                  <input type="text" name="country" class="form-control" required={true}/>
                </label>
              </div>
              <div class="col-md-2">
                <label>
                  {this.l('Code')}
                  <br />
                  <input type="text" name="code" class="form-control" required={true}/>
                </label>
              </div>
              <div class="col-md-1">
                <br />
                <button type="submit" class="btn btn_small">
                  {this.l('Add new one')}
                </button>
              </div>

              <div class="clear"></div>
            </form>
          </div>

          <form action="#" method="post">
            <div class="col-md-2">
              <select name="action" class="form-control" id="actionType">
                <option value="">{this.l('Action')}</option>
                <option value="del"> {this.l('Remove')} </option>
              </select>
            </div>

            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.bulkActionImpl(e,"countries-action")}>
                {this.l('Apply')}
              </button>
            </div>

            <div class="clear"></div>

            <div class="content table-responsive table-full-width">
              <table class="table table-hover table-striped">
                <thead>
                 <tr>
                  <th style={{ width: '40px' }}>
                    <SetBulk cssClass="checkboxBulk"/>
                  </th>
                  <th style={{ width: '40px' }}>{this.l('ID')}</th>
                  <th>{this.l('Title')} </th>
                  <th>{this.l('Code')}</th>
                  <th style={{ width: '40px' }}> </th>
                  <th style={{ width: '40px' }}> </th>
                 </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((row) => (
                    <tr id={"blockData"+row.id}>
                      <td>
                         <input type="hidden" name="id" value={row.id} />
                         <input type="checkbox" class="checkboxBulk" value={row.id}/>
                      </td>
                      <td>{row.id}</td>
                      <td>
                        <input type="text" name="country" defaultValue={row.country} onChange={e=>this.update(e, row.id)}/>
                      </td>
                      <td>
                        <input type="text" name="code" defaultValue={row.code} onChange={e=>this.update(e, row.id)}/>
                      </td>
                      <td>
                        <a href="#" class="fa_delete" onClick={e=>this.deleteRow(e, row.id, "country-remove")}> </a>
                      </td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>

    );
  }
}

export default Countries;