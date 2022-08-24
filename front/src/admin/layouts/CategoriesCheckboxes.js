import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput,
        toJsonObj, random,reactSetVal, setValueByClass } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';
import CategoriesSelect from './CategoriesSelect.js';

/**
* Controller: ProductsAdminController
* On this page we see the list
**/
class CategoriesCheckboxes extends HelpersClass{
    updated = false;

    constructor(props) {
       super(props);
        this.initState({
                 rows :[],
                 catids:[],
         });
     }

    componentDidMount(){
       this.setState({ catids :this.props.catid, rows : this.props.rows });

      /*  axios.get(window.API_URL+'cp/get-all-categories',this.headers())
              .then(res => {
                 this.setState({ rows :res.data, catid :this.props.catid });
              }).catch(error => { });*/
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ catids :nextProps.catid, rows : nextProps.rows });
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

 line=(row, marginLeft="")=>{

  return (
    <>
     <label class="product_cat_single">
       <input style={{marginLeft: marginLeft+"px"}} name="categories[][catid]" type="checkbox" onChange={this.onChangeCatids}
            checked={this.state.catids.includes(row.catid)} value={row.catid} /> {this.lang(row.title)}
     </label>
    </>);
 }

 fieldsLoop =(parentId, marginLeft)=>{
   return (
   <>
     {this.state.rows.map(row=>
       <>
        {row.parent == parentId ? (<> {this.line(row, marginLeft)} {this.fieldsLoop(row.catid, (marginLeft + 10))}</>):
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




  /**
  * controller: /cp/CategoriesController.java,
  * method: insertShort
  */
  addNewCategory =(e, type)=>{
       e.preventDefault();
     var elements = document.getElementsByClassName("catTitleInsert_"+type);
     var title = {};
     var cpu ="";
     for(var i=0;i<elements.length; i++){
          title[elements[i].getAttribute("data-lang")] = elements[i].value;

          if(cpu =="")
             cpu =  elements[i].value;
      }

       if(cpu =="")
           return null;

       var parent = document.getElementById("catTitleParent_"+type).value;

       var formData = {title:JSON.stringify(title), type:type, parent:parent, cpu : cpu};
       this.showLoad();

     axios.put(window.API_URL+'cp/categories-insert-short',
                 formData,
                 this.headers()).
            then(res => {
                this.hideLoad();

                if(res.data.response=="ok"){
                    var categories = this.state.rows;
                        categories.push(res.data.category);

                   this.success();
                   this.setState({ rows: categories});

                }else{
                   alert(res.data);
                   }


           }). catch(error => {
              alert(error);
             this.hideLoad();
           });
   }



  render(){


    return(
        <>
         {Object.entries(this.props.types).map( ([key, value]) =>

           <div class="card">
              <h3 class="padding_10px margin_top_0px">{this.l(value)}</h3>

              <div class="small_box_with_scroll loadResult_product" id="categories_right">

                 {this.state.rows.map(row=>
                    <>
                     {(row.parent ==null || row.parent ==0) && row.type==key ?
                             (<> {this.line(row, 0)} {this.fieldsLoop(row.catid, 10)}</>):(<></>)}
                    </>
                )}

             </div>
             <div class="height10px"></div>
              <p class="text_align_right padding_p">
                <a href="#" class="showAddCat" data-show="product" onClick={e=>this.showCat(e,key)}> {this.l("Add New")} </a>
             </p>

               <div class="addNewCategory" id={"catType_"+key} >
                  {this.state.allLanguages.map(language=>
                     <input type="text" class={"form-control catName catTitleInsert_"+key} data-lang={language} placeholder={"Title ("+language+")"} />
                   )}
                   <div class="height5px"></div>

                   <select class="form-control catParent" id={"catTitleParent_"+key}>
                        <option value="0">Select Parent</option>
                        <CategoriesSelect rows={this.props.rows} type={key} catid=""/>
                  </select>
                  <div class="height5px"></div>

                  <p class="text_align_right">
                    <span class="smallLoad_product"></span>
                    <button class="btn btn_small" onClick={e=>this.addNewCategory(e,key)}> Add New</button>
                  </p>
               </div>
          </div>
          )}
       </>
    )
  }
}

export default CategoriesCheckboxes;