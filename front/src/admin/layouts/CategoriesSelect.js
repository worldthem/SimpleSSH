import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput,
        toJsonObj, random,reactSetVal, setValueByClass } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';

/**
* Controller: ProductsAdminController
* On this page we see the list
**/
class CategoriesSelect extends HelpersClass{

   constructor(props) {
       super(props);
        this.initState({
                 rows :[],
                 catid:"",
                 type:"",

         });
     }

 componentWillReceiveProps(nextProps) {
     if(typeof nextProps.rows != "undefined"){
          this.setState({ rows :nextProps.rows, type: nextProps.type, catid:nextProps.catid });
     }
  }

 rowLine=(row, marginLeft="")=>{
  var leftSpace= "";
  for(var i=0; i<marginLeft;i++)
    leftSpace= leftSpace +"&nbsp;";

  return (
     <>
      <option value={row.catid} selected={this.state.catid == row.catid}
                             dangerouslySetInnerHTML={{__html: leftSpace+" &#xbb; "+this.lang(row.title)}}>
      </option>
    </>);
 }

 fieldsLoop =(parentId, marginLeft)=>{
   return (
   <>
     {this.state.rows.map(row=>
       <>
        {row.parent == parentId ? (<> {this.rowLine(row, marginLeft)} {this.fieldsLoop(row.catid, (marginLeft + 2))}</>):
                                  (<> </>)}
       </>
     )}
    </>
   );
 }

 showCat=(e, type)=>{
      e.preventDefault();
   var elem = document.getElementsByClassName("addNewCategory");
   for(var i = 0; i< elem.length; i++)
        elem[i].style.display = "none";

   document.getElementById("catType_"+type).style.display="block";
 }


  render(){
      return(
        <>
          {this.state.rows.map(row=>
               <>
                {(row.parent ==null || row.parent ==0) && row.type==this.state.type ?
                        (<> {this.rowLine(row, 0)} {this.fieldsLoop(row.catid, 2)}</>):(<></>)}
               </>
          )}
       </>
      )
  }
}

export default CategoriesSelect;