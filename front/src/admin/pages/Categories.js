import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';

/**
*Controller: controllers.cp.CategoriesController.java
*
**/
class Categories extends HelpersClass {

  constructor(props) {
    super(props);
    this.initState({ rows : [],
                     title: "Categories list",
                  });
  }


 componentDidMount(){
    this.getCategories(this.props.match.params.type);
 }

 componentWillReceiveProps(nextProps) {
   if(nextProps.match.params.type != ""){
      this.getCategories(nextProps.match.params.type);
   }
 }

 getCategories=(type)=>{
   this.showLoad();
   axios.get(window.API_URL+'cp/get-categories-by-type?type='+type,this.headers() )
        .then(res => {
           this.setState({rows: res.data});
           this.hideLoad();
         }).catch(error => {
            this.hideLoad();
         });

 }


  line=(row, marginLeft="")=>{

    return (
        <tr>
           <td>
              <input type="checkbox" name="id" class="checkboxBulk" value={row.catid}/>
          </td>
           <td>
             <a href={window.ADMIN_BASE_URL+"categories/add-edit/"+row.catid} target="_blank">
                 {row.catid}
             </a>
          </td>

          <td style={{paddingLeft: marginLeft+"px"}}>
               <a href={window.ADMIN_BASE_URL+"categories/add-edit/"+row.catid}> &#xbb; {this.lang(row.title)} </a>
          </td>
          <td>
              <a href={window.ADMIN_BASE_URL+"categories/add-edit/"+row.catid}> {row.cpu} </a>
          </td>

          <td class="width_table_btn">
            <a href={window.ADMIN_BASE_URL+"categories/add-edit/"+row.type+"/"+row.catid} title="Edit" class="fa_edit"></a>
          </td>
          <td class="width_table_btn">
            <a href="#" onClick={e=>this.deleteRow(e, row.catid, "category-remove")} title="Delete" class="fa_delete">
            </a>
          </td>
           <td class="width_table_btn">
               <a href="#" onClick={e=>this.showHide(e,row.catid, (row.status=="2" ? "1":"2", "category-hide") )} title="Unpublish" class={row.status=="2" ? "fa_unpublish":"fa_publish"}></a>
          </td>
        </tr>
      );
   }


   fieldsLoop =(parentId, marginLeft)=>{
     return (
     <>
       {this.state.rows.map(row=>
         <>
          {row.parent == parentId ? (<> {this.line(row, marginLeft)} {this.fieldsLoop(row.catid, (marginLeft + 14))}</>):
                                    (<> </>)}
         </>
       )}
      </>
     );
   }


  render() {
    return (

        <div class="card">
          <div class="header headerBg">

               <h4 class="title">
                     {this.props.match.params.type =="brand" ? this.l('Brands') : this.l('Categories') } &nbsp;&nbsp;&nbsp;
                   <a class="btn" href={window.ADMIN_BASE_URL+"categories/add-edit/"+this.props.match.params.type+"/0"} >
                      {this.l('Add new one')}
                   </a>
               </h4>
          </div>

           <div class="col-md-2">
              <select name="action" class="form-control" id="actionType">
                <option value="">{this.l('Action')}</option>
                <option value="del">{this.l('Delete')}</option>
              </select>
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn_small" onClick={e=>this.bulkActionImpl(e,"categories-action")}>
                {this.l('Apply')}
              </button>
            </div>
            <div class="clearfix"></div>

            <div class="content table-responsive table-full-width">
              <table class="table table-hover table-striped">
                <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <SetBulk cssClass="checkboxBulk"/>
                  </th>
                  <th style={{ width: '40px' }}>{this.l('ID')}</th>
                  <th>{this.l('Title')}</th>
                  <th>{this.l('CPU')}</th>
                  <th style={{ width: '40px' }}> </th>
                  <th style={{ width: '40px' }}> </th>
                  <th style={{ width: '40px' }}> </th>
                 </tr>
                </thead>
                  <tbody>

                     {this.state.rows.map( row =>
                         <>
                          {(row.parent ==null || row.parent ==0) ?
                                  (<> {this.line(row, 0)} {this.fieldsLoop(row.catid, 14)}</>):(<></>)}
                         </>
                         )}
                      </tbody>
              </table>
            </div>

        </div>

    );
  }
}

export default Categories;