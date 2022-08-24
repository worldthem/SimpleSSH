import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj,
        random, randId, convertToCss, reactSetVal } from './../../../Helpers.js';
import Editor from './../editor/Editor.js';
import serialize from 'form-serialize';

//https://openbase.com/js/material-ui-color
// animate : https://animate.style/

import { ColorPicker,  ColorBox  } from 'material-ui-color';

class MainDivPopup extends React.Component{
   css = `body{
            overflow: hidden;
           }`;
  constructor(props) {
    super(props);
    this.state =  {  row : {},
                    _this: props.parentObj,
                     classDiv: props.classDiv,
                     html: props.html,
                     showColor:"",
                     fontColor:"",
                     bgColor:"",
                     bg_image:"",
                     typeEditor: props.typeEditor,
                     pIcon:"",
                     pTitle:"",
                     pLink:"",
                     pDescription:"",
                  } ;
   }

  componentDidMount(){
      if(this.props.data !== "undefined" ) {

        this.setState({
               row : this.props.data,
               fontColor:this.props.data.font_color,
               bgColor:this.props.data.bg_color,
               bgImage:this.props.data.bg_image,
               typeEditor: this.props.typeEditor,
               _this: this.props.parentObj,
               classDiv: this.props.classDiv,
               html: this.props.html,
          });



         var modal = document.getElementById("modalEditPage");
         var inputs = modal.getElementsByClassName("formInput");
             for(var i=0; i<inputs.length; i++){
                if(inputs[i].dataset.name && typeof this.props.data[inputs[i].dataset.name] != "undefined"){
                  reactSetVal(inputs[i], this.props.data[inputs[i].dataset.name]);
                }
             }



        if(this.props.typeEditor=="performance" && this.props.html !=""){

          var htmlObject = document.createElement('div');
              htmlObject.innerHTML = this.props.html;

           //htmlObject.getElementById("myDiv").style.marginTop = something;
            var icon = htmlObject.getElementsByClassName("fIcon");
            var titleMain = htmlObject.getElementsByClassName("fTitle");
            var title = titleMain.length>0?  titleMain[0].getElementsByClassName("fLink") : htmlObject.getElementsByClassName("eeee3333eee333eee33ee");
            var description = htmlObject.getElementsByClassName("fDescription");

           this.setState({
                pIcon: icon.length>0? icon[0].className.match(/fa-[\w-]*\b/):"",
                pTitle:title.length>0 ?title[0].innerHTML:"",
                pLink: title.length>0 ?title[0].getAttribute("href") : "#",
                pDescription: description.length>0 ? description[0].innerHTML:"",
           });

        }
      }


  }

onchangeClasses=(e, type="")=>{
    //desktopHide mobileHide
    var value = e.target.value;

    if(type=="desktopHide" || type=="mobileHide"){
       value = this.state.classDiv;
       value = e.target.checked ? (value.includes(type) ? value : value+" "+type)  : value.replace(type, "");
    }

     this.setState({
       classDiv: value.replace("  "," ")
     });
}

 showColor=(type="")=>{
   this.setState({  showColor: type });
 }

 setColor=(color="", where="")=>{
    this.setState({ [where]: "#"+color.hex });
 }

  onChangeColor=(e, where="")=>{
     this.setState({ [where]: e.target.value });
  }

  uploadIMG =(e)=>{
   var files= e.target.files;
     if(files.length ==0)
        return null;

   // Create an object of formData
   const formData = new FormData();

   formData.append( "file", files[0]);

  // Request made to the backend api
  // Send formData object
  this.state._this.showLoad();
  axios.post(window.API_URL+'cp/simple-upload',
              formData,
              this.state._this.headers()).
        then(res => {
            this.setState({bgImage: "images/"+res.data});
            this.state._this.hideLoad();
        }). catch(error => {
            alert(error);
            this.state._this.hideLoad();
        });
  }

  formSave =(e)=>{
    e.preventDefault();
    //const form = e.currentTarget
    //const body = serialize(form, {hash: true, empty: false});

    var modal = document.getElementById("modalEditPage");
    var inputs = modal.getElementsByClassName("formInput");

    const body ={};
    for(var i=0; i<inputs.length; i++){
       if(inputs[i].dataset.name){
         body[inputs[i].dataset.name] = inputs[i].value;
       }
    }

    body["html"] ="";

    var iframe = modal.getElementsByClassName("iframeData");
    var editor = modal.getElementsByClassName("textEditor");

     if(iframe.length>0){
       body["html"] =iframe[0].value;
     } else if(editor.length>0){
       body["html"] =editor[0].value;
     }

     if(this.state.typeEditor=="performance"){
        var htmlObject = document.createElement('div');
            htmlObject.innerHTML = this.props.html;

        var icon = htmlObject.getElementsByClassName("fIcon");
        var titleMain = htmlObject.getElementsByClassName("fTitle");
        var title = titleMain.length>0?  titleMain[0].getElementsByClassName("fLink") : htmlObject.getElementsByClassName("eeee3333eee333eee33ee");
        var link = htmlObject.getElementsByClassName("fLink");

        var description = htmlObject.getElementsByClassName("fDescription");

            if(icon.length>0)
              icon[0].className = "fIcon fa "+this.state.pIcon;

            if(title.length>0 )
              title[0].innerHTML = this.state.pTitle;

            if(link.length>0 )
              for(var j=0;j<link.length;j++)
               link[j].href = this.state.pLink;

            if(description.length>0)
                 description[0].innerHTML = this.state.pDescription;

            body["html"] = htmlObject.innerHTML;
      }

     this.state._this.closePopup(e, body);
  }

 changeSize=(e)=>{
    var val = e.target.value;

    var className= this.state.classDiv;
    var isInCol = this.chekIfInString(className, "col-");
    var replaced = isInCol.includes("col-sm-") ? className.replace(isInCol, "col-sm-"+val) :
                  (isInCol.includes("col-md-") ? className.replace(isInCol, "col-md-"+val) : className+" col-md-"+val);

   this.setState({
         classDiv: replaced
      });
 }

  chekIfInString =(str, patt)=>{
     var rgxp = new RegExp(patt+"[\\w-]*\\b");
     var match =str.match(rgxp);
      return match !=null ? match.toString():""; // /matchIs[\w-]*\b/
 }

 onChangePerform =(e, name)=>{
    this.setState({ [name]:e.target.value });
  }

  showIconPopup=(e)=>{
      e.preventDefault();
      var popupWind = document.getElementsByClassName('showFaIconPopup');
       if(popupWind.length>0){
            popupWind[0].click();
        }

     var iconsListContainer = document.getElementsByClassName('fontawesome-icon-list');
       if(iconsListContainer.length>0)
         iconsListContainer[0].addEventListener( 'click', (event) => this.iconClick(event),  false );
  }

   //when click to add a icon
    iconClick=(e)=>{
         e.preventDefault();
       var className = e.target.className;

        if (className.includes('fa ')) {
            this.setState({pIcon:className.replace("fa ","")});
            document.getElementById("closeFaIconPopup").click();
        }else if (className.includes('fa-hover')) {
            this.setState({pIcon: e.target.dataset.icon});
            document.getElementById("closeFaIconPopup").click();
         }
     }

   removeImage=(e)=>{
     e.preventDefault();
     this.setState({bgImage: "" });
   }

  render(){
     return (
       <div class="modal-open">
        <style type="text/css">{this.css}</style>


       <div class="modal fade in bs-example-modal-sm" id="modalEditPage" tabindex="-1" role="dialog" style={{display:"block"}}>
          <div class={"modal-dialog modalWindow "+(this.state.classDiv.includes("inside_grid") ? "modal-lg-editor":"bs-example-modal-sm")}  role="document">
            <div class="modal-content animate__animated animate__fadeInDown" >
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" onClick={this.state._this.closePopup} aria-label="Close">
                       <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title modal_load_title"> </h4>
                  </div>
             <div class="modal_load_content">

             {this.state.classDiv.includes("inside_grid") ? (
               <div class="col-md-8">
                    {this.state.typeEditor=="iframe" ? (<>
                      <div class="editorBlock iframeEdit" >
                        <label>{this.state._this.l("Enter the Iframe") }</label><br />
                        <textarea class="form-control iframeData formInput" defaultValue={this.state.html} rows="15"></textarea>
                      </div>
                       <div class="col-md-12">
                        <a href="#" style={{marginTop:"10px"}} onClick={this.formSave} class="update_options btn btn_small btn_active">
                            {this.state._this.l("Update")}
                        </a>
                      </div>
                     </>):(<></>)}
                   {this.state.typeEditor=="performance" ? (<>
                    <div class="editorBlock performanacesBlock" >
                         <div class="col-md-7">
                          <label>{this.state._this.l("Select icon")} </label><br />
                          <input  type="text" onChange={e=>this.onChangePerform(e,'pIcon')}  value={this.state.pIcon}/>
                          <a href="#" class="add_grid btn btn_small" onClick={this.showIconPopup}><i class="fa fa-plus-circle"></i></a>
                          &#160;&#160;<i class={"fa "+this.state.pIcon}></i>
                         </div>
                         <div class="col-md-7">
                          <label>{this.state._this.l("Title") }</label><br />
                            <input  type="text" onChange={e=>this.onChangePerform(e,'pTitle')} class="form-control" value={this.state.pTitle} />
                         </div>
                         <div class="col-md-7">
                           <label>{this.state._this.l("Link") } </label><br />
                           <input  type="text" onChange={e=>this.onChangePerform(e,'pLink')} class="form-control" value={this.state.pLink} />
                         </div>
                          <div class="col-md-12">
                            <label>{this.state._this.l("Descriptions") }</label><br />
                            <input type="text" onChange={e=>this.onChangePerform(e,'pDescription')} class="form-control" value={this.state.pDescription} />
                          </div>
                          <div class="col-md-12">
                             <a href="#" style={{marginTop:"10px"}} onClick={this.formSave} class="update_options btn btn_small btn_active">
                                {this.state._this.l("Update")}
                             </a>
                          </div>
                          <div class="clear"></div>

                    </div>
                   </>):(<></>)}
                    <div class="height10px"></div>

                   {this.state.typeEditor=="" ? (<>
                     <div class="editorBlock editorContainer">
                       <Editor TextEditor html={this.state.html} textareaName=""/>
                    </div>
                   </>):(<></>)}

              </div>):(<></>)}


              <div class={this.state.classDiv.includes("inside_grid") ? "col-md-4":"col-md-12"}>

                 {this.state.classDiv.includes("inside_grid") ? (
                     <div class="sizeBlock">
                      <label>{this.state._this.l("Size")} </label>
                      <select class="sizeContainer form-control" onChange={this.changeSize}>
                         {[...Array(12)].map((x,i) =>
                             <option value={(++i)} selected={this.state.classDiv.includes("-"+i)}>
                               Size:{(8.333333333333333 * i).toFixed(2)}%
                             </option>
                         )}
                      </select>
                     </div>
                  ):(<></>)}


                <label>{this.state._this.l("Padding")} (Pixel) </label>
                <div class="clear"></div>
                <div class="padding_form">
                     Top
                    <input type="number" data-name="paddingt" class="form-control formInput" />
                </div>
                <div class="padding_form">
                       Bottom
                    <input type="number" data-name="paddingb" class="form-control formInput" />
                </div>
                <div class="padding_form">
                       Left
                    <input type="number" data-name="paddingl" class="form-control formInput" />
                </div>
                <div class="padding_form">
                       Right
                    <input type="number" data-name="paddingr" class="form-control formInput" />
                </div>
                <div class="clear"></div>

               <div style={{position:"relative"}}>
                    <label>{this.state._this.l("Font Color")} </label>
                    <div class="clear"></div>
                    <div class="colorSelectBox">
                      <ColorPicker value={this.state.fontColor } onChange={c=>this.setColor(c,"fontColor")}/>
                    </div>
                    <input type="text" data-name="font_color" id="fontColorPicker"
                           onChange={e=>this.onChangeColor(e,"fontColor")} value={this.state.fontColor}
                           class="form-control inputColorFormat formInput"/>
               </div>
               <div class="clear"></div>

                <div style={{position:"relative"}}>
                    <label>{this.state._this.l("Background Color")} </label>
                    <div class="clear"></div>
                    <div class="colorSelectBox">
                      <ColorPicker value={this.state.bgColor} onChange={c=>this.setColor(c,"bgColor")}/>
                    </div>
                    <input type="text" data-name="bg_color"
                           onChange={e=>this.onChangeColor(e,"bgColor")}
                           value={this.state.bgColor} class="form-control inputColorFormat formInput" />
                </div>

              <div class="height20px"></div>
              <p>
                <label >{this.state._this.l("Background Image")} </label>
                <input type="hidden" data-name="bg_image" value={this.state.bgImage} class="formInput" />
                <input type="file" onChange={this.uploadIMG} id="background_img"  class="load_imge_main" />

                {typeof this.state.bgImage !="undefined" && this.state.bgImage !="" ? (<>
                  <div class="height20px response_main"></div>
                  <div class="show_result_main">
                     <img src={window.API_ASSETS+this.state.bgImage} class="bg_image"  />
                  </div>
                  <a href="#" class="remove_image" onClick={this.removeImage}> <i class="fa fa-times"></i> </a>
                </>):(<></>)}
              </p>

               <p>
                <label>{this.state._this.l("Background Image Display")}</label>
                <select data-name="bg_type" class="form-control formInput">
                 <option value="cover">Cover</option>
                 <option value="fixed">Fixed</option>
                </select>
               </p>
               <p>
                   <label>{this.state._this.l("Opacity background image ")} </label>
                       <select data-name="bg_opacity" class="form-control formInput">
                         <option value="">No opacity</option>
                         <option value="0.9">0.9</option>
                         <option value="0.8">0.8</option>
                         <option value="0.7">0.7</option>
                         <option value="0.6">0.6</option>
                         <option value="0.5">0.5</option>
                         <option value="0.4">0.4</option>
                         <option value="0.3">0.3</option>
                         <option value="0.2">0.2</option>
                         <option value="0.1">0.1</option>
                       </select>
               </p>
                 <div style={{position:"relative"}}>
                   <label>
                     <input type="checkbox" value="yes" checked={this.state.classDiv.includes("mobileHide")}
                            onChange={e=>this.onchangeClasses(e,"mobileHide")} />
                          &nbsp; {this.state._this.l("Hide on mobile")}
                    </label> <br/>

                    <label>
                      <input type="checkbox" value="yes" checked={this.state.classDiv.includes("desktopHide")}
                             onChange={e=>this.onchangeClasses(e,"desktopHide")} />
                      &nbsp; {this.state._this.l("Hide on Desktop")}
                    </label>
                 </div>

                <div style={{position:"relative"}}>
                    <label>{this.state._this.l("DIV Classes")} ({this.state._this.l("Leave it, if you are not sure")}) </label>
                    <input type="text" data-name="div_class" class="form-control formInput" onChange={this.onchangeClasses} value={this.state.classDiv} />
                </div>


             <a href="#"  style={{marginTop:"10px",float:"left"}} onClick={this.state._this.closePopup}  class="btn btn_small">{this.state._this.l("Cancel")}</a>

             <a href="#" style={{marginTop:"10px",float:"right"}} onClick={this.formSave} class="update_options btn btn_small btn_active">
                 {this.state._this.l("Update")}
             </a>

            </div>
            <div class="height10px"></div>
           </div>
          </div>
         </div>
        </div>

        <div class="modal-backdrop fade in"></div>
       </div>
     )}
 }
 export default MainDivPopup;