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
class CatCheckBoxOnly extends React.Component{
    updated = false;

    constructor(props) {
       super(props);
        this.state ={
                 rows :[],
                 catids:[],
                 catType:'',
            };
     }

    componentDidMount(){
       this.setState({ catids :this.props.catid, rows : this.props.rows, catType: this.props.catType });
   }

    componentWillReceiveProps(nextProps) {
      this.setState({ catids :nextProps.catid, rows : nextProps.rows , catType: nextProps.catType});
    }

 onChangeCatids =(e)=>{
    var catids = this.state.catids;
      if(e.target.checked){
        catids.push(parseInt(e.target.value));
      }else{
        catids = catids.filter(function(val) { return val !== parseInt(e.target.value) });
      }

     this.setState({ catids :catids });
 }

 line=(row, marginLeft="", parent="")=>{

  return (
    <>
     <label class="product_cat_single">
       <input style={{marginLeft: marginLeft+"px"}}
              name="categories[][catid]"
              class="categoriesCheckbox"
              type="checkbox"
              onChange={this.onChangeCatids}
              checked={this.state.catids.includes(row.catid)}
              value={row.catid}
              data-cpu={row.cpu}
              data-fullcpu={parent=="" ? row.cpu : parent+"/"+row.cpu}
              data-title={lang(row.title)}
              data-margin={marginLeft}
              /> {lang(row.title)}
     </label>
    </>);
 }

 fieldsLoop =(parentId, marginLeft, parent="")=>{
   return (
   <>
     {this.state.rows.map(row=>
       <>
        {row.parent == parentId ? (<> {this.line(row, marginLeft, parent)} {this.fieldsLoop(row.catid, (marginLeft + 10),parent+"/"+row.cpu)}</>):
                                  (<> </>)}
       </>
     )}
    </>
   );
 }

  render(){
     return(
           <div class="small_box_with_scroll loadResult_product" id="categories_right">
             {this.state.rows.map(row=>
                <>
                 {(row.parent ==null || row.parent ==0) && row.type==this.state.catType ?
                         (<> {this.line(row, 0, "")} {this.fieldsLoop(row.catid, 10, row.cpu)}</>):(<></>)}
                </>
             )}
           </div>
       )
  }
}

export default CatCheckBoxOnly;