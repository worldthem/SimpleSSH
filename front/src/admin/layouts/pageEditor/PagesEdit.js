import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import serialize from 'form-serialize';
import HelpersClass from './../../HelpersClass.js';
import {  lang, _l, getUrlParam, setInput, toJsonObj,
        random, randId, convertToCss, fromJson } from './../../Helpers.js';

import TextEditor from './../layouts/TextEditor.js';
import MainDivPopup from './../layouts/pageEditor/MainDivPopup.js';
import LeftReadyBlocks from './../layouts/pageEditor/LeftReadyBlocks.js';


/**
Controller : controllers.cp.PagesAdminController
*/
class PagesEdit extends HelpersClass{

  constructor(props) {
    super(props);
    this.initState({ row : {},
                     title: "Pages add Edit",
                     css:"",
                     style:{},
                     scriptLoaded:false,
                     showMainDivPopup:false,
                     dataSend:{},
                     idDiv:"",
                     typePopup:"",
                     classDiv:"",
                     divHtml:"",
                     cssWindow:"none",
                   });

  }

   componentDidMount(){
         // import the drag and drop library
          const script = document.createElement("script");
                script.src = window.BASE_URL+"jsLibrary/dragANDdrop.js";
                script.async = false;
          const head = document.head || document.getElementsByTagName('head')[0];
                head.insertBefore(script, head.firstChild);
                //document.body.appendChild(script);

           script.addEventListener('load', () => {
                 this.setState({scriptLoaded:true});
             });

           // get page content
          this.getData(this.props.match.params.id);

           /*
           this.setState({
              css:  `body { background-color: red !important; }`
           });*/

          // add click event to options menu from right corner
         var container = document.getElementById('page_contents');
             container.addEventListener( 'click', (event) => this.itemClick(event),  false );

     this.initClick();
   }

   componentWillReceiveProps(nextProps) {
    // this.getData(nextProps.match.params.id);
   }


  // this is the settings menu itself
 return_text =(types='')=>{
        return '<div class="edit_text_this'+(types ==''? ' editBlockHover':'')+'">'+
                   '<a href="#" class="iconAction '+(types ==''? 'sort_icon':'parrentdropable')+' fa_move fa_small editable" onclick="return false;"></a>'+
                   '<a href="#" class="iconAction edit_texticon fa_edit fa_small editable editRow" data-toggle="modal" data-target="#editContainer" data-typeBlock="'+(types ==''? 'child':'main')+'"></a>'+
                   '<a href="#" class="iconAction dublicate fa_dublicate fa_small editable duplicateRow" ></a>'+
                   '<a href="#" class="iconAction delet_text fa_delete fa_small editable deleteRow" ></a>'+
               '</div>';
    }


  setOptionToMain=()=>{
      var container = document.getElementById('page_contents');

       var edits = container.getElementsByClassName("edit_text_this");
       for(var x=0; x<edits.length; x++){
          edits[x].remove();
        }

     // add the options menu to main container
     var elements = container.getElementsByClassName("dropable");
     for(var i=0;i<elements.length;i++){
       elements[i].insertAdjacentHTML('beforeend', this.return_text("options"));
     }

     // add the options menu to divs inside the main container
      var hoverEl = container.getElementsByClassName('inside_grid');
      for(var i = 0; i < hoverEl.length; i++){
          hoverEl[i].insertAdjacentHTML('beforeend', this.return_text(""));
      }

     if(this.state.scriptLoaded){
      // add the option drag and drop top divs inside the main container
      for(var i = 0; i < elements.length; i++){
         window.Sortable.create(elements[i], {
                                  handle: '.sort_icon',
                                  animation: 250
                               });
      }

       // add the option drag and drop the  mains container
       try{
       window.Sortable.create(container, {
                        handle: '.parrentdropable',
                        animation: 150
                      });
       }catch(err){}
     }
 }

  // get data from the server
  getData=(id="")=>{
        this.showLoad();

        this.setState({ lang: this.getLang() });
        axios.get(window.API_URL+'cp/pages-get-one?pageid='+id,this.headers())
             .then(res => {
                setInput(res.data, this.getLang());

                this.setState({
                     row: res.data ,
                     lang: this.getLang() ,
                     style: res.data.styleCollection,
                     css: res.data.css != null ? res.data.css : "",
                     });
                this.hideLoad();

                this.setOptionToMain();

             }).catch(error => {
                alert(error);
                this.hideLoad();
             });
    }


   // this we implement the clicks
    itemClick = (e) => {
       e.preventDefault();
       var className = e.target.className;
       if (className.includes('deleteRow')) {
          this.removeElement(e);
       } else if (className.includes('editRow')) {
         this.editMainDivPopup(e);
       } else if (className.includes('duplicateRow')) {
              alert('duplicateRow');
        }


       var main = document.getElementsByClassName("sections");
       if(main.length>0){
            for(var i=0;i<main.length; i++){
             main[i].classList.remove("selectedBlock");
            }

            const r1 = e.target.closest(".sections");
            if(Boolean(r1)){
               r1.classList.add("selectedBlock");
            }
       }
    }

    removeElement=(e)=>{
      var r = window.confirm("Are you sure you want to remove this block?");
        if (r == true) {
           var par = e.target.parentNode.parentNode;
           par.remove();

           try{
            var style = this.state.style;
            delete style[par.id];

            this.setState({style:style });
           }catch(err){alert(err)}

          }
        return false;
     }

  editMainDivPopup=(e)=>{
     var parentNode = e.target.parentNode.parentNode;

     var type="";
   try{
     var mainNode = e.target.parentNode.parentNode.parentNode;
      if(mainNode.className.includes("fullIframe") || parentNode.className.includes("fullIframe")){
        type="iframe";
      }else if(parentNode.className.includes("performaces")){
        type="performance";
      }


    }catch(err){}

       var html ="";
       if(parentNode.className.includes("inside_grid")){
         try{
             parentNode.getElementsByClassName("edit_text_this")[0].remove();
             html = parentNode.innerHTML;
             parentNode.insertAdjacentHTML('beforeend', this.return_text(""));
          }catch(err){}
       }

     this.setState({
       showMainDivPopup:true,
       dataSend: typeof this.state.style[parentNode.id] !="undefined" ? this.state.style[parentNode.id] : {},
       idDiv: parentNode.id,
       classDiv: parentNode.className,
       divHtml: html,
       typeEditor: type,
     });
  }

  closePopup=(e, data={})=>{
      e.preventDefault();
      this.setState({
           showMainDivPopup:false,
           typeEditor:"",
      });

      if(JSON.stringify(data) !="{}"){
        var element = document.getElementById(this.state.idDiv);

        if(element.className.includes("inside_grid")){
          try{
           document.getElementById(this.state.idDiv).className = data.div_class;
           if(data.html !="")
           document.getElementById(this.state.idDiv).innerHTML = data.html+this.return_text("");
          }catch(err){}
        }

            delete data.div_class;
            delete data.html;

        var newData = this.state.style;
            newData[this.state.idDiv] = data;

        this.setState({ style: newData });


     }
  }

   initClick =()=>{
       var readyBlock =document.getElementById("readyBlocksList");

         readyBlock.addEventListener( 'click', (e) => {
                    e.preventDefault();

              var dataClass =  e.target.dataset.key;
               if(typeof dataClass !="undefined"){

                var mainID = randId();
                var additionalStyle = document.getElementsByClassName("style"+dataClass)[0].value;
                var html = document.getElementsByClassName(dataClass)[0].value;
                    html= html.replace(/unic_id/g , function() {
                                return randId();
                              });
                    html =  html.replace('main_id', mainID);

                 var container = document.getElementById('page_contents');
                 container.insertAdjacentHTML('beforeend', html);

                   this.setOptionToMain();

                 if(additionalStyle != ""){


                    try{
                        var style = this.state.style;
                        var blockCss = fromJson(additionalStyle);
                        var fullcss = blockCss["fullcss"];

                         delete blockCss.fullcss;
                         style[mainID]= blockCss;


                         var css = this.state.css;
                         this.setState({
                                style:style,
                                css: css+(fullcss.replaceAll("<","{").replaceAll(">","}")),
                          });
                       }catch(err){alert(err)}

                 }
               }

         },  false );

   }

  closeCssWindow=(e)=>{
    e.preventDefault();
    this.setState({cssWindow:"none"});
  }

  openCssWindow=(e)=>{
    e.preventDefault();
    this.setState({cssWindow:"block"});
  }

  updateCss =(e)=>{
     this.setState({ css: e.target.value});
  }

  formUpdate =(e)=>{
   e.preventDefault()
   const form = e.currentTarget
   const body = serialize(form, {hash: true, empty: false})


    body['text']= document.getElementById("page_contents").innerHTML;
    body['css']= this.state.css;
    body['style']= JSON.stringify(this.state.style);


  // Request made to the backend api
  // Send formData object
  this.showLoad();
  axios.put(window.API_URL+'cp/pages-insert-update',
              body,
              this.headers()).
        then(res => {
             this.success(res.data);
             if(res.data=="ok"){

             setTimeout(function () {
                 window.location.reload();
              }, 200)

             }
        }). catch(error => {
          alert(error);
          this.hideLoad();
        });

  }


  render() {
    return (
       <div class="card">
          <div class="header headerBg">
          <style type="text/css" id="css_done">
              {convertToCss(this.state.style)}
          </style>
          <style type="text/css" id="directCSS">{this.state.css}</style>

            <div class="title">
               { this.props.match.params.id =="0"? this.l('Create new') : this.l('Edit')}
            </div>
             {this.props.match.params.id !="0"? (<>
             {this.duplicateContent('pages-duplicate?pageid='+this.props.match.params.id)}
             {this.switchLanguage(window.ADMIN_BASE_URL+"pages/edit-add-tabs/"+this.props.match.params.type+"/"+this.props.match.params.id) }
            </>):(<></>)}
          </div>
          <div class="content">

           <form class="formSave" onSubmit={e=>this.formUpdate(e)} action="#" method="POST">
              <input type="hidden" name="type" value={this.props.match.params.type} />
              <input type="hidden" name="pageid" value={this.props.match.params.id} />
              <input type="hidden" name="lang" value={this.state.lang} />

               <div class="rightSideSave">
                 <a href="#" class="buttonSave cssModal" onClick={this.openCssWindow}><i class="fa fa-code"></i> CSS</a>
                 <button type="submit" class="buttonSave"><i class="fa fa-cloud-upload"></i> {this.l('Save')}</button>
               </div>

              <div class="col-md-6">
                <p>
                  <label>{this.l('Title')}</label> <br />
                  <input type="text" class="form-control" name="title"  required/>
                </p>
              </div>

               <div class="col-md-6">
                 <p>
                      <label>{this.l('CPU')}  </label> <br />
                      <input type="text" class="form-control" name="cpu" required/>
                 </p>
               </div>
                <div class="col-md-6">
                   <p>
                     <label>{this.l('Meta description')}</label> <br />
                     <input type="text" class="form-control" name="metad"/>
                   </p>
                </div>
                <div class="col-md-6">
                    <p>
                       <label>{this.l('Meta keyword')}  </label> <br />
                       <input type="text" class="form-control" name="metak" />
                    </p>
               </div>
                <div class="height30px"></div>

                   <div class="main_container" >
                      <div id="page_contents" dangerouslySetInnerHTML={{ __html: this.lang(this.state.row.text)}} />
                   </div>


              <div class="height10px"></div>
              <div class="text-center">
                <input type="submit" class="btn" value={this.l('Save')} />
              </div>
            </form>
          </div>

          <LeftReadyBlocks/>

           {this.state.showMainDivPopup  ?
             (<MainDivPopup parentObj={this}
                            data={this.state.dataSend}
                            classDiv={this.state.classDiv}
                            html={this.state.divHtml}
                            typeEditor={this.state.typeEditor}
                        />):(<></>)}


           <div class="css_editor" style={{display:this.state.cssWindow}}>
                 <div class="closs_editor" onClick={this.closeCssWindow}>x</div>
                 <textarea name="css" id="cssDirect" class="form-control" onChange={this.updateCss} value={this.state.css}></textarea>
           </div>

        </div>

    );
  }
}
export default PagesEdit;