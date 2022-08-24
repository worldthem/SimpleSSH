import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput,
        toJsonObj, random,reactSetVal, setValueByClass, objToHtml  } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';
import CategoriesCheckboxes from './../layouts/CategoriesCheckboxes.js';
import TextEditor from './../layouts/TextEditor.js';


/**
* Controller: ProductsAdminController
* On this page we see the list
**/

class ProductAddEdit extends HelpersClass{
  isUpdateComponent = false;

 constructor(props) {
   super(props);
   //we do this way because this.state={} has been initialized in HelpersClass
   //the method initState() is in HelpersClass
   this.initState({row : {},
                   title: "Product list",
                   showActionCat: "none",
                   uploaded: [],
                   mainImage: "",
                   variations: {},
                   specifications: {},
                   categories: [],
                   productid: "",
                   attributes: {},
                   suggestions: {},
                   newSuggestions: {},
                   lang:"en",
                   productAttributes:{},
                   htmlSuggestion: [],
                   categoriesList:[],
                   categoriesType:{},
                   productCatId:[],
                 });
 }

 componentDidMount(){
      this.sUpdateComponent =true;
      this.getProductData(this.props.match.params.id);

 }

   // this method we use when insert new or change language
 componentWillReceiveProps(nextProps) {
     // the problem is that it can load this method multiple time,
     // so to avoid overload of backend we do this if

   if( this.state.lang != this.getLang() || nextProps.match.params.id == "new"){

       this.setState({ lang: this.getLang() });

      // if there is new param we need to clear all the fields
      if(nextProps.match.params.id == "new")
        this.getProductData(nextProps.match.params.id);


      if(this.state.lang != this.getLang())
        setInput(this.state.row, this.getLang());


       // if we go from edit product to add new product than we have to uncheck all checkboxes
       var inputs = document.getElementsByTagName("input");

       for(var i=0;i<inputs.length;i++){
           if(inputs[i].type.toLowerCase() == 'checkbox'){
              inputs[i].checked = false;
           }

       }
     }
 }



  getProductData=(prId="", tt)=>{
       this.showLoad();
      axios.get(window.API_URL+'cp/product-get-single?id='+prId,this.headers())
           .then(res => {

              setInput(res.data.product, this.getLang());

              var productAttr =  toJsonObj(res.data.product.attr);
              this.setState({row: res.data.product,
                             mainImage: res.data.product.image,
                             uploaded: this.isNull(res.data.product.media, []),
                             productid: res.data.product.productid,
                             attributes: res.data.attributes,
                             suggestions: res.data.suggestions,
                             productAttributes: productAttr,
                             objAttributes:{},
                             categoriesList :res.data.categories,
                             categoriesType: res.data.categoriesType,
                             productCatId: res.data.product.catids,
                             lang: this.getLang()
                            });

                    // prevent multiple load
                    this.stopMultipleLoad();

             this.hideLoad();
           }).catch(error => {
              this.stopMultipleLoad();
              alert(error);
              this.hideLoad();

           });
  }

   // prevent multiple load
   stopMultipleLoad =()=>{
      var _this = this;
      setTimeout(function(){
            _this.sUpdateComponent =false;
        }, 900);
   }


  getAttrVal(k,k1, i){
    try{
       //suggestions
      return typeof this.state.productAttributes[k][k1] =="object" ?
                    (this.state.productAttributes[k][k1].includes(i)?  "yes":"no" ):  this.state.productAttributes[k][k1];
    }catch(err){
    }
    return "";
  }

   getSuggestionVal(k,k1){
      try{
         //suggestions
        return typeof this.state.suggestions[k][k1] =="object" ?
                      this.state.suggestions[k][k1][this.getLang()] :  this.state.suggestions[k][k1];
      }catch(err){
      }
      return "";
    }

  // upload img for gallery or files it depend witch one
  upload =(idUploadInput, type="" )=>{

       var files= document.getElementById(idUploadInput).files;
       if(files.length ==0)
         return null;

       var title = document.getElementById(idUploadInput+"Title");

       // Create an object of formData
       const formData = new FormData();

       // Update the formData object
       for(var i=0; i < files.length; i++)
         formData.append( "files", files[i]);


       formData.append( "title", typeof title !="undefined" && title !=null ? title.value : "");

       formData.append( "typefile", type );
       formData.append( "productid", this.state.productid );



       // Details of the uploaded file


       // Request made to the backend api
       // Send formData object
       this.showLoad();
       axios.post(window.API_URL+'cp/upload-files',
                   formData,
                   this.headers()).
             then(res => {
                 this.setState({uploaded: res.data});
                 this.hideLoad();
             }). catch(error => {
               alert(error);
               this.hideLoad();
             });


  }

  // this method is used to remove a line from table gallery
  removeFile=(e,id)=>{
          e.preventDefault();
            this.showLoad();

      axios.get(window.API_URL+'cp/remove-media?id='+id,this.headers())
           .then(res => {
           if(res.data=="ok"){
              this.setState({ uploaded: this.state.uploaded.filter(function(item) {
                                            return item.id !== id
                                        })  });
             }else{
               alert(res.data);
             }
              this.hideLoad();
           }).catch(error => {
              alert(error);
             this.hideLoad();
           });
  }



// when press on the button add variations it will run this
addVariations =(e)=>{
   e.preventDefault();
    var variations = this.state.productAttributes;
        variations[random(5)] = {"qtu": "", "sku": "", "type": "variation", "price": "", "weight": ""};
    this.setState({productAttributes : variations});
 }
// when remove variation
 removeVariation =(e,k)=>{
    e.preventDefault();
    var variations = this.state.productAttributes;
      delete variations[k];

    this.setState({productAttributes : variations});
  }

 // when duplicate variation
  dublicateVariation =(e,k)=>{
      e.preventDefault();
      var variations = this.state.productAttributes;
      variations[random(5)] =variations[k];
      this.setState({productAttributes : variations});
    }


  setValue =(e)=>{
      reactSetVal(e.target, e.target.value);

  }


  // when type on variation example in color field or size field it will show below the list of
     // suggestion
     showSuggestion =(e, k, className)=>{
       var element = document.getElementsByClassName("showSugestion_"+className);
       if(element.length>0){
           var html = '';
            let buffer = []
           try{
               var suggestion = this.state.suggestions[k];
               for (const objKey in suggestion) {
                 let val = suggestion[objKey][this.state.lang];
                if(val.toUpperCase().includes(e.target.value.toUpperCase())){
                   buffer.push(<a href={"#"+objKey} data-skey={objKey} data-sval={val} title={val} class={"ittemSugestion"} >{val}</a>);
                 }
              }
           }catch(err){}

           element[0].style.display="block";
           element[0].innerHTML=objToHtml(buffer);
          //this.setState({htmlSuggestion:buffer});
       }
     }


   // this method will run on onblur will set and hide the suggestion list
   hideSuggestion=(e, attrKey,  suggestionKey,  className)=>{
       var prAttrKey="";
       var inputName = document.getElementsByClassName("attr_"+className)[0];
       var suggestionArr = this.state.suggestions;


      // if it's main language
       if(this.state.allLanguages[0] == this.getLang()){

       // this mean the user click on one of the suggestion from list
       if(e.relatedTarget != null && e.relatedTarget.className.includes("ittemSugestion")){
          e.target.value= e.relatedTarget.getAttribute("data-sval");
          reactSetVal(inputName , e.relatedTarget.getAttribute("data-skey"));

          prAttrKey = e.relatedTarget.getAttribute("data-skey");

          // user didn't click on no any suggestion he keep typing
          }else if(e.target.value !=""){

              // if the user didn't click on suggestion or suggestion is not in the list so we check it bellow
              // if is not than we generate a new key for it
               var newKey = random(5);
               var keyIs = false;
               // if the suggestion is not than no make sens to move forward
            if(typeof this.state.suggestions[suggestionKey] != "undefined"){

               var arrayObj = this.state.suggestions[suggestionKey];

               // we loop the suggestion object to find if the suggestionis in
               for(const rowKey in arrayObj){
                  if(typeof arrayObj[rowKey] =="object" &&
                     arrayObj[rowKey][this.getLang()].trim().toUpperCase() == e.target.value.trim().toUpperCase()){
                     newKey = rowKey;
                     keyIs = true;
                     break;
                       // is in we need to update the key
                  }
               }
            }

             reactSetVal(inputName , newKey);
             prAttrKey = newKey;
            // on this part the suggestion is not on the list an we add it to list and after send this array
            //back and update the list of suggestions
           if(!keyIs){


              if(typeof suggestionArr[suggestionKey] == "undefined"){
                   suggestionArr[suggestionKey] = {[newKey] :{[this.getLang()] : e.target.value}};

                }else{
                      if(typeof suggestionArr[suggestionKey][newKey]  == "undefined"){
                        suggestionArr[suggestionKey][newKey] = {[this.getLang()] : e.target.value};
                      }else{
                        suggestionArr[suggestionKey][newKey][this.getLang()] = e.target.value;
                       }
                 }

                 this.setState({suggestions: suggestionArr});
              }
        }

         // this part is to prevent key remain the same
         // when any var from state is updated it actually reload all the loop where are state,
         // this is react state, not to ideal but better can be

          try{
           var prAttr=  this.state.productAttributes;
               prAttr[attrKey][suggestionKey] = prAttrKey;
               this.setState({productAttributes: prAttr});
          }catch(err){}

       }else{

           // the click was on any item from the suggestion
            if(e.relatedTarget != null && e.relatedTarget.className.includes("ittemSugestion")){
                    e.target.value= e.relatedTarget.getAttribute("data-sval");
            }

            // if its other language than main
           if(inputName.value !=""){
               try{
                 suggestionArr[suggestionKey][inputName.value][this.getLang()] = e.target.value;
                 this.setState({suggestions: suggestionArr});
               }catch(err){}
             }
          }

        // hide suggestion window
        var element = document.getElementsByClassName("showSugestion_"+className);
         if(element.length>0){
           element[0].style.display="none";
         }

   }


 inputBox =(k,k1, valKey, valName)=>{
    setTimeout(function(){
         var inputName = document.getElementsByClassName("inputBox_"+k+"_"+k1);
         if(typeof inputName !="undefined")
             reactSetVal(inputName[0] , typeof valName !="undefined" ? valName :"");
     }, 500);

  return (
   <>
      <input type="hidden"  class={"attr_"+k+"_"+k1} defaultValue={valKey} name={"attr["+k+"]["+k1+"]"} />
      <input type="text" class={"form-control inputBox_"+k+"_"+k1}
             defaultValue={valName}
             onKeyUp={e=>this.showSuggestion(e, k1, k+"_"+k1)}
             onBlur={e=>this.hideSuggestion(e, k, k1, k+"_"+k1)}  />
      <div class={"sugestion_elements showSugestion_"+k+"_"+k1} tabindex="0"></div>
   </>)
 }


 //show variation fields
 variationFields =(k="",v="")=>{
   k = k==""? random(5) : k;
   return (
       <div class="inner_row background_variation">
          <input type="hidden" class="form-control" name={"attr["+k+"][type]"} value="variation"/>
          <div class="col_1_05">
            <label>{this.l('Price')}</label> <br/>
            <input type="text" class={"form-control"} defaultValue={v.price} name={"attr["+k+"][price]"} />
          </div>

          <div class="col_2">
             <label>{this.l('SKU')}</label> <br/>
              <input type="text" class={"form-control"} defaultValue={v.sku} name={"attr["+k+"][sku]"}/>
         </div>
          <div class="col_1_05">
              <label>{this.l('Quantity')}</label> <br/>
              <input type="text" class={"form-control"} defaultValue={v.qtu} name={"attr["+k+"][qtu]"}/>
          </div>
           <div class="col_1_05">
               <label>{this.l('Weight')}</label> <br/>
               <input type="text" class={"form-control"} defaultValue={v.weight} name={"attr["+k+"][weight]"} placeholder={this.l('In KG')}/>
          </div>

        { Object.entries(this.state.attributes).map(([k1,v1],i1) => (
         <>
           {v1.type == "variations"? (
                <div class="col_2 position_relatie inputfield" >
                 <label>{v1['name'][this.state.lang]}</label> <br/>
                   {this.inputBox(k,k1, v[k1], this.getSuggestionVal(k1, v[k1]))}
                 </div>
           ):(<></>)}
          </>
          )) }

          <div class="clear"></div>
             <a href="#" onClick={e=>this.removeVariation(e,k)} title="Delete"  class="fa_delete float_right"></a>
             <a href="#" onClick={e=>this.dublicateVariation(e,k)}  title="Dublicate"  class="fa_dublicate float_right"></a>
          <div class="height5px"></div>

       </div>
    );
  }

  // show specification fields
   specificationFields =(key,v)=>{
     return (<>
         <input type="hidden" class="form-control" name={"attr["+key+"][type]"} value="specification"/>
        {/* if box is input*/}
        {v.box == "textbox" ? (
          <div class="col-xs-6" >
             <label>{v['name'][this.state.lang]}</label> <br/>
             {this.inputBox(key,key, this.getAttrVal(key,key,0),  this.getSuggestionVal(key, this.getAttrVal(key,key,0)))}
          </div>
          ): (<></>)}

         {/* if box is select*/}
         {v.box == "select" ? (
             <div class="col-xs-6" >
                 <label>{v['name'][this.state.lang]}</label> <br/>
                      <select class="form-control" name={"attr["+key+"]["+key+"]"}>
                       { Object.entries(typeof this.state.suggestions[key] !="undefined" ?
                                               this.state.suggestions[key]:[]).map(([k1,v1],i1) => (
                           <option value={k1}>{v1[this.state.lang]}</option>
                        )) }
                     </select>

             </div>): (<></>)}

             {/* if box is checkbox*/}
             {v.box == "checkbox" ? (
              <div class="col-xs-12" >
                <h4 >{v['name'][this.state.lang]}</h4>
                { Object.entries(this.state.suggestions[key]).map(([k2,v2],i2) => (
                     <label>
                       <input type="checkbox" defaultChecked={this.getAttrVal(key,key, k2) =="yes"? true: false} name={"attr["+key+"]["+key+"][]"} value={k2} />
                       <span> {v2[this.state.lang]}</span>&nbsp;&nbsp;
                     </label>
                )) }

              </div>): (<></>)}


    </>);
  }

   // save or add product
    formSave =(e)=>{
         e.preventDefault()
         const form = e.currentTarget
         const body = serialize(form, {hash: true, empty: false})

         //console.log("data are:", this.state.suggestions);
         //return null;

        var mainImage= document.getElementById("uploadMainImage").files;

        // Create an object of formData
        const formData = new FormData();
          //alert(mainImage);
        // Update the formData object
          if(typeof mainImage[0] !="undefined"){
             formData.append( "imgmain", mainImage[0]);
           }

          for(var data in body){
           formData.append( data, typeof body[data] =="object" ? JSON.stringify(body[data]) : body[data]);
          }

          formData.append("suggestions", JSON.stringify(this.state.suggestions));

       // formData.append( "productid", this.state.productid );

        // Details of the uploaded file


        // Request made to the backend api
        // Send formData object
        this.showLoad();
        axios.put(window.API_URL+'cp/update-product',
                    formData,
                    this.headers()).
              then(res => {
                   this.success(res.data);
              }). catch(error => {
                alert(error);
                this.hideLoad();
              });


     }

  render(){
    return(

   <form class="formSave" onSubmit={ this.formSave} action="#" method="POST" enctype="multipart/form-data">
   	<input type="hidden" name="productid" />
   	<input type="hidden" name="lang" value={this.state.lang} />
    <input type="hidden" name="typeInsert" value={this.props.match.params.id} />

       <div class="card" style={{marginBottom:"0px"}}>
          <div class="header headerBg">
           <div class="title">
             { this.props.match.params.id =="new"? this.l('Create new') : this.l('Edit')}
             </div>
             {this.props.match.params.id !="new"? (<>
              {this.duplicateContent('product-duplicate?id='+this.props.match.params.id)}
              {this.switchLanguage(window.ADMIN_BASE_URL+"products/edit-product/"+this.props.match.params.id) }
             </>):(<></>)}
          </div>
       </div>


   	<div class="col-md-9 productSingle" style={{paddingLeft:"0px"}}>
   		<div class="card">
   			<div class="header">
   				<div> </div>
   				<h4 class="title">

                        {this.l('Edit')} :

                        {this.l('Add new Product')}

                </h4>
   				<a href="${baseurl + page.getUrl()! }" target="_blank"> <i class="fa fa-link"></i> View page </a>
   			</div>
   			<div class="content">
   				<div class="col-md-6">
   					<p>
   						<label>{this.l('Title')}</label>
   						<br/>
   						<input type="text" class="form-control" name="title" /> </p>
   				</div>
   				<div class="col-md-6">
   					<p>
   						<label> {this.l('Cpu')}</label>
   						<br/>
   						<input type="text" class="form-control" name="cpu" /> </p>
   				</div>
   				<div class="col-md-6">
   					<p>
   						<label>{this.l('Meta description')}</label>
   						<br/>
   						<input type="text" class="form-control" name="metad" /> </p>
   				</div>
   				<div class="col-md-6">
   					<p>
   						<label>{this.l('Meta keyword')}</label>
   						<br/>
   						<input type="text" class="form-control" name="metak" /> </p>
   				</div>
   				<div class="clear"></div>
   				<div class="col-md-2">
   					<p>
   						<label>{this.l('Stock')}</label>
   						<br/>
   						<select name="stock">
   							<option value="yes">{this.l('In stock')}</option>
   							<option value="not">{this.l('Out of stock')}</option>
   						</select>
   					</p>
   				</div>
   				<div class="col-md-2">
   					<p>
   						<label>{this.l('Price')}</label>
   						<br/>
   						<input type="text" class="form-control" name="price" /> </p>
   				</div>
   				<div class="col-md-2">
   					<p>
   						<label>{this.l('Sale price')}</label>
   						<br/>
   						<input type="text" class="form-control" name="salePrice" /> </p>
   				</div>
   				<div class="col-md-2">
   					<p>
   						<label>{this.l('SKU')} </label>
   						<br/>
   						<input type="text" class="form-control" name="sku" /> </p>
   				</div>
   				<div class="col-md-2">
   					<p>
   						<label>{this.l('Quantity')}</label>
   						<br/>
   						<input type="text" class="form-control" name="qtu" /> </p>
   				</div>
   				<div class="col-md-2">
   					<p>
   						<label>{this.l('Weight')} (KG)</label>
   						<br/>
   						<input type="text" class="form-control" name="weight" /> </p>
   				</div>
   				<div class="clear"></div>
   				<div class="block_attributes">
   				    <a class="title_attributes" href={window.ADMIN_BASE_URL+"attributes/var"} target="_blank">
   				        Add / Edit Variation <i class="icon_result fa fa-plus"></i>
   				     </a>
   					<div class="clear"> </div>
   					<div id="variation_control">
   					  { Object.entries(this.state.productAttributes).map(([k,v],i) => (
   						 <>
   						   {v.type == "variation"? ( <>{this.variationFields(k,v)} </> ):( <> </>)}
   						 </> ))}
   					 <div class="clear"></div>
   					</div>
   					<div class="text_align_center">
   						<a href="#" onClick={this.addVariations} title={this.l( 'Add new Variation')} style={{fontSize: "22px"}}> <span class="fa fa-plus-circle"></span> {this.l('Add new Variation')} </a>
   					</div>
   					<div class="clear"> </div>
   				</div>
   				<div class="background_variation">
   					<div class="col-md-5">
   						<p>
   							<label>{this.l('File Title')} </label>
   							<br/>
   							<input type="text" class="form-control" id="uploadFileTitle" name="upload_title" /> <small><i >{this.l('If product is virtual and Downloadable')}</i></small> </p>
   					</div>
   					<div class="col-md-4">
   						<p>
   							<label>{this.l('Select file')}</label>
   							<br/>
   							<input type="file" class="form-control" id="uploadFile"  /> <small><i >{this.l('Costomer will get access after order')}</i></small> </p>
   					</div>
   					<div class="col-md-3">
   						<p>
   							<label>
   								<br/>
   							</label>
   							<br/>
   							<input type="button" class="btn btn_small" value="Upload" onClick={e=>this.upload('uploadFile','file')}/> <span style={{float: "right"}} class="load_iacon"></span> </p>
   					</div>
   					<div class="clear"></div> {this.state.uploaded.map( file =>
   					<> {file.typefile=="file" ? (
   						<>
   							<div class="col-md-5">{file.title}</div>
   							<div class="col-md-5"> <a href={window.API_ASSETS+ "files/"+file.directory}>{file.directory}</a> </div>
   							<div class="col-md-2"> <a class="fa_delete" href="#" onClick={e=>this.removeFile(e,file.id)}></a> </div>
   							<div class="height10px"></div>
   							</> ): (
   							<>
   								</>) }
   								</> )}
   								<div class="clear"></div>
   				</div>
   				<div class="height10px"></div>
   				<div class="block_attributes">
   				    <a class="title_attributes" href={window.ADMIN_BASE_URL+"attributes/spec"} target="_blank">
                         {this.l('Add / Edit Specification')} <i class="icon_result fa fa-plus"></i>
                     </a>

                     { Object.entries(this.state.attributes).map(([k,v],i) => (
                         <>
                           {v.type == "specifications"? ( <>{this.specificationFields(k,v)} </> ):( <> </>)}
                         </>
   					 ))}
   				 <div class="clear"></div>
   				</div>
   				<div class="height10px"></div>
   				<div class="col-md-12">
   					<label>{this.l('Small Description')}</label>

                    <TextEditor html={this.lang(this.state.row.description)} textareaName="description"/>

   				</div>
   				<div class="height20px"></div>
   				<div class="col-md-12">
   					<label>{this.l('Full Description')}</label>
   					<TextEditor html={this.lang(this.state.row.text)} textareaName="text"/>

   				</div>
   				<div class="height10px"></div>
   				<div class="col-md-6">
   					<p>
                        <label>{this.l('External URL')}</label> <br/>
                        <input type="text" class="form-control" name="cpu_store" />
   			        </p>
   				</div>
   				<div class="height10px"></div>
   			</div>
   		</div>
   	</div>
   	{/* right side */}
   	<div class="col-md-3" style={{paddingRight:"0px"}}>

   		<div class="card padding_10px">
   			<h3 class="margin_top_0px">{this.l('Publish')}</h3>
   			<button type="submit" class="btn">{this.l('Save')}</button>
   		</div>

          <CategoriesCheckboxes rows={this.state.categoriesList}
                                types={this.state.categoriesType} catid={this.state.productCatId} />


   		<div class="card padding_10px">
   			<h3 class="margin_top_0px">{this.l('Main Images')}</h3>

   			<input type="file" id="uploadMainImage" class="btn btn_small" style={{maxWidth: "100%"}} />

   			 <div class="show_result_main">
   			   {this.state.mainImage !="" && this.state.mainImage !=null ?
   			      (<img src={window.API_ASSETS+ "imgproduct/thumb_"+this.state.mainImage} alt="" />): (<></>) }
   					<div class="clear"></div>
   			</div>
   		</div>

   		<div class="card padding_10px">
   			<h3 class="margin_top_0px">{this.l('Gallery')}</h3>
   			<input type="file"  id="uploadGaller" multiple="" onChange={e=>this.upload('uploadGaller','gallery')} style={{maxWidth:"100%"}} class="btn btn_small load_imge_galery" />
   			<div class="show_result_gallery height10px"></div>

   			 {this.state.uploaded.map( img =>
   			  <>
   			   {img.typefile=="gallery" ? (
                    <div class="gallery_product"> <a class="delete_image" href="#" onClick={e=>this.removeFile(e,img.id)}>x</a>
                        <a href="#"> <img src={window.API_ASSETS+ "imgproduct/thumb_"+img.directory}/> </a>
                    </div> ): ( <> </>) }
   			  </> )}
   					<div class="clear"></div>
   		</div>
   	</div>
   </form>

    )
  }
}

export default ProductAddEdit;