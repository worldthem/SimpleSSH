import React, { useState } from 'react';
import axios from 'axios';
import {headers} from './../../../Helpers.js';
import './style.css';

/**
 this component it's a simple Classic Editor, feel free to modify at your needs :)
 i done the best i can, but in a little beat of rush :(, may be some bugs like "buguru buguru buguru"
 just kidding
*/
class  Editor extends React.Component{

 commandRelation = {};

 constructor(props) {
     super(props);

      this.state={
          html:"",
          intHtml:"",
          toolbar:"",
          displayEditor:"",
          displayHtml:"none",
       }
   }


 componentDidMount(){
   this.init();
 }

 componentWillReceiveProps(nextProps) {
    if(nextProps.html !== "undefined" ) {
        this.setState({ html: nextProps.html, intHtml: nextProps.html});
   }
 }


/**
here we initiate the editor
*/
 init =()=>{
      var toolbar = [];
	  var template = '<a href="#" class="simpleElement %btnClass%" title="%cmd% - %desc%" data-param="%cmd%"><i data-param="%cmd%" class="simpleElement %iconClass%" %style%></i></a>';
	  var templateWindows = '<div class="btn_parrent"><i class="%iconClass%" %style%></i>%window%</div>';
      var pupap = '<div class="popapWindow btn_parrent" data-param="%typevar%" ><i data-param="%typevar%" class="popapWindow%imgloadclass% %iconClass%" %style%></i></div>';
      var pupapIMG = '<div class="popapWindow btn_parrent" data-param="%typevar%"><i data-param="%typevar%" class="popapWindow%imgloadclass% %iconClass%" %style%></i></div>';


    this.commands.map((command, i)=>{
	   if(typeof command.icon !== "undefined"){

		 this.commandRelation[command.cmd] = command;

		var temp =  (typeof command.windowtype !== "undefined") ? templateWindows  : (this.supported(command) == "btn-succes" ?  template : "");
            temp =  (typeof command.pupap !== "undefined") ? (command.pupap=="img" ? pupapIMG: pupap) : temp ;

		temp = temp.replace(/%iconClass%/gi, this.icon(command));
		temp = temp.replace(/%desc%/gi, command.desc);
		temp = temp.replace(/%btnClass%/gi, this.supported(command));
		temp = temp.replace(/%cmd%/gi, command.cmd);
        temp = temp.replace(/%style%/gi, this.isOrNot(command.style) );
        temp = temp.replace(/%window%/gi, (typeof command.windowtype !== "undefined") ? this.supWindow(command.cmd, command.windowtype) : "" ) ;
        temp = temp.replace(/%typevar%/gi, (typeof command.pupap !== "undefined") ?  command.pupap : "" ) ;
        temp = temp.replace(/%imgloadclass%/gi, (typeof command.pupap !== "undefined") ?   (command.pupap=="img"? " loadImgwait":"") : "" ) ;

		toolbar= toolbar + temp;
      }
	})
      this.setState({ toolbar: toolbar });

     var tool= document.getElementsByClassName("editorToolbar");
     if(tool.length>0){
       for(var i=0;i<tool.length;i++){
         tool[i].addEventListener( 'click', (event) => this.itemClick(event),  false );
       }
     }

     document.execCommand('styleWithCSS', false, true);
     document.execCommand('enableObjectResizing', false, true);
     document.execCommand('defaultParagraphSeparator', false, 'p');


     var iconsListContainer = document.getElementsByClassName('fontawesome-icon-list');

     if(iconsListContainer.length>0)
       iconsListContainer[0].addEventListener( 'click', (event) => this.iconClick(event),  false );

}

 //when click on toolbar icon it will process of click in this method
 itemClick=(e)=>{
        e.preventDefault();
       var className = e.target.className;
       var dataParam = e.target.dataset.param;


       if (className.includes('simpleElement')) {
          this.doCommand(dataParam);
       } else if (className.includes('simple2ParamElement')) {
          this.doCommand(dataParam, e.target.dataset.param2);
       }else if (className.includes('popapWindow')) {

           if(dataParam=="img"){
             this.buildFileSelector().click();
           }else if(dataParam=="icons"){
             var popupWind = document.getElementsByClassName('showFaIconPopup');
             if(popupWind.length>0){
                  popupWind[0].click();
              }

           }
         }
  }

  //when click to add a icon
  iconClick=(e)=>{
       e.preventDefault();
     var className = e.target.className;
      if (className.includes('fa ')) {
            this.doCommand('insertHTML', '<i class="'+className+'">&nbsp;</i>');
            document.getElementById("closeFaIconPopup").click();
      }else if (className.includes('fa-hover')) {
            this.doCommand('insertHTML', '<i class="fa '+e.target.dataset.icon+'">&nbsp;</i>');
            document.getElementById("closeFaIconPopup").click();
        }
   }

// when press on upload image it will generate a new input type file
 buildFileSelector =()=>{
   const fileSelector = document.createElement('input');
   fileSelector.setAttribute('type', 'file');
   fileSelector.onchange = e => this.uploadCallback(e);
   return fileSelector;
 }

//  when change something on editor page
 handleEditorChange = (e) => {
      if(e.target.innerHTML !==this.state.html)
       this.setState({
              html: e.target.innerHTML
       });
  }

// this will upload the image to server
// controller  controllers.cp.UploadController.java
// method : simpleUpload
 uploadCallback =(e)=>{
      // Create an object of formData

      if(e.target.files.length ==0)
         return null;

      var imgIcon= document.getElementsByClassName("loadImgwait");
          for(var i=0;i<imgIcon.length;i++)
            imgIcon[i].classList.add("fa-spin");

      const formData = new FormData();

      formData.append( "file",e.target.files[0]);

     // Request made to the backend api
     // Send formData object
      axios.post(window.API_URL+'cp/simple-upload',
                 formData,
                 headers()).
           then(res => {
             this.doCommand('insertImage', window.API_ASSETS+"images/"+res.data);

             for(var i=0;i<imgIcon.length;i++)
               imgIcon[i].classList.remove("fa-spin");

           }). catch(error => {
               alert(error);
               imgIcon[0].classList.remove("fa-spin");
            });
 }



     showWindow=(e,type="")=>{
          e.preventDefault();
         this.setState({
                  displayEditor: type=="editor" ? "":"none",
                  displayHtml: type=="html" ? "":"none",
               });
     }

   // on the top are two menus call Editor | HTML when click on some of them
    onchangeHtml=(e)=>{
     if(this.state.displayHtml==""){
        this.setState({
            html: e.target.value,
            intHtml: e.target.value,
          });
        }
   }

// return it self
     render(){
         return(
             <div>
                  <a href="#" onClick={e=>this.showWindow(e, "editor")}>Editor</a>&nbsp;|&nbsp;
                  <a href="#" onClick={e=>this.showWindow(e, "html")}>HTML</a>
                  <div class="height5px"></div>
                  <div class="height10px" style={{borderTop:"1px solid #ccc"}}></div>
                <div style={{display:this.state.displayEditor}}>

                 <div class="toolbarEditor toolbar">
                 	 <div class="editor_bottons editorToolbar"  dangerouslySetInnerHTML={{__html: this.state.toolbar}}></div>
                 </div>

                 <div class="container_edit tinimceEditor" contenteditable="true"
                      dangerouslySetInnerHTML={{__html: this.state.intHtml}}
                      onInput={this.handleEditorChange}
                      onBlur={this.handleEditorChange} />
                 </div>

                 <div class="popupEdtorHtmlWind" style={{display:this.state.displayHtml}}>
                    <textarea name={this.props.textareaName} data-name={this.props.textareaName} class="textEditor" onChange={this.onchangeHtml}
                              value={this.state.html} ></textarea>
                 </div>


             </div>

           )}

/**
  All here from bellow are helpers, don't want to put them in the top because will take a loot of space

*/
format=(html)=>{
    var tab = '\t';
    var result = '';
    var indent= '';

    html.split(/>\s*</).forEach(function(element) {
        if (element.match( /^\/\w/ )) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match( /^<?\w[^>]*[^\/]$/ )) {
            indent += tab;
        }
    });

    return result.substring(1, result.length-3);
}

supported=(cmd)=> {
	try{
	document.queryCommandSupported(cmd.cmd);
	return "btn-succes";
	 }catch(err){}
	// var className = !!document.queryCommandSupported(cmd.cmd) ? "btn-succes" : "btn-error"

	return "btn-error";
};

icon=(cmd)=> {
	return (typeof cmd.icon !== "undefined") ? "fa fa-" + cmd.icon : "";
}

isOrNot =(typeIs)=>{
	return (typeof typeIs !== "undefined") ? typeIs : "";
}

doCommand =(cmdKey, valWindow = "")=>{
    var comand = this.commandRelation[cmdKey];
	if (this.supported(comand) === "btn-error") {
		alert("execCommand(“" + comand.cmd + "”)\nis not supported in your browser");
		return;
	}
      if(cmdKey == "createLink"){
            var sel = window.getSelection();
            var range = sel.getRangeAt(0);
            var pointedLiTag = range.startContainer.parentNode.getAttribute("href");
             comand.val = pointedLiTag != null ? pointedLiTag : "";
     }

      var val="";
      if(valWindow == ""){
	     val = (typeof comand.val !== "undefined") ? prompt("Value for " + comand.cmd + "?", comand.val) : "";
       }else{
         val = valWindow;
       }

   	document.execCommand(comand.cmd, false, (val || "")); // Thanks to https://codepen.io/bluestreak for finding this bug
}

supWindow(type_wind="", typeWind = ""){
    var colorPalette = ['#000000', '#FF9966', '#6699FF', '#99FF66', '#CC0000', '#00CC00', '#0000CC', '#333333', '#0066FF', '#FFFFFF'];
    var sizePalette = ['1', '2', '3', '4', '5', '6', '7'];
    var headerPalette = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    var fontfamilyPalette = ['Monospace', 'Serif', 'Sans Serif', 'Arial', 'Tahoma', 'Impact','Arial Black','Verdana','Georgia','Symbol','Trebuchet MS'];
    var style = "";
    var showText = true;

    if(typeWind =="size"){
        var arrayJs = sizePalette;
        style = 'none:';
    }else if(typeWind =="header"){
        var arrayJs = headerPalette;
        style = 'none:';
    }else if(typeWind =="fontfamily"){
        var arrayJs = fontfamilyPalette;
        style = 'font-family:';
    }else{
        var arrayJs = colorPalette;
        style = 'background-color:';
        showText = false;
     }


    var windowDiv = '<div class="block_info_edit">';
        for (var i = 0; i < arrayJs.length; i++) {
           windowDiv = windowDiv +  '<a href="#" data-param="'+type_wind+'" data-param2="'+arrayJs[i]+'" style="'+ style + arrayJs[i] + ';" class="simple2ParamElement palette-item">'+(showText ? arrayJs[i] :'&nbsp;')+'</a>';
        }
        windowDiv = windowDiv+ "</div>";


    return windowDiv;
}


 commands = [{
  	"cmd": "undo",
  	"icon": "undo",
  	"desc": "Undoes the last executed command."
  }, {
  	"cmd": "redo",
  	"icon": "redo",
  	"desc": "Redoes the previous undo command."
  },{
  	"cmd": "bold",
  	"icon": "bold",
  	"desc": "Toggles bold on/off for the selection or at the insertion point. (Internet Explorer uses the STRONG tag instead of B.)"
  }, {
  	"cmd": "italic",
  	"icon": "italic",
  	"desc": "Toggles italics on/off for the selection or at the insertion point. (Internet Explorer uses the EM tag instead of I.)"
  }, {
  	"cmd": "underline",
  	"icon": "underline",
  	"desc": "Toggles underline on/off for the selection or at the insertion point."
  }, {
  	"cmd": "strikeThrough",
  	"icon": "strikethrough",
  	"desc": "Toggles strikethrough on/off for the selection or at the insertion point."
  }, {
  	"cmd": "contentReadOnly",
  	"desc": "Makes the content document either read-only or editable. This requires a boolean true/false to be passed in as a value argument. (Not supported by Internet Explorer.)"
  }, {
  	"cmd": "copy",
  	"icon": "clipboard",
  	"desc": "Copies the current selection to the clipboard. Clipboard capability must be enabled in the user.js preference file. See"
  }, {
  	"cmd": "cut",
  	"icon": "cut",
  	"desc": "Cuts the current selection and copies it to the clipboard. Clipboard capability must be enabled in the user.js preference file. See"
  }, {
  	"cmd": "increaseFontSize",
      "icon": "sort-amount-up",
  	"desc": "Adds a BIG tag around the selection or at the insertion point. (Not supported by Internet Explorer.)"
  }, {
  	"cmd": "decreaseFontSize",
      "icon": "sort-amount-down",
  	"desc": "Adds a SMALL tag around the selection or at the insertion point. (Not supported by Internet Explorer.)"
  }, {
  	"cmd": "delete",
  	"icon": "trash-alt",
  	"desc": "Deletes the current selection."
  }, {
  	"cmd": "enableInlineTableEditing",
  	"desc": "Enables or disables the table row and column insertion and deletion controls. (Not supported by Internet Explorer.)"
  }, {
  	"cmd": "enableObjectResizing",
  	"desc": "Enables or disables the resize handles on images and other resizable objects. (Not supported by Internet Explorer.)"
  }, {
  	"cmd": "fontName",
  	"val": "'Inconsolata', monospace",
      "icon": "paragraph",
      "windowtype": "fontfamily",
  	"desc": "Changes the font name for the selection or at the insertion point. This requires a font name string (\"Arial\" for example) to be passed in as a value argument."
  }, {
  	"cmd": "fontSize",
  	"val": "1-7",
      "windowtype": "size",
  	"icon": "text-height",
  	"desc": "Changes the font size for the selection or at the insertion point. This requires an HTML font size (1-7) to be passed in as a value argument."
  }, {
  	"cmd": "foreColor",
  	"val": "rgba(0,0,0,.5)",
      "icon": "font",
      "windowtype": "colorWindow",
      "style": "style='color:#C96;'",
  	"desc": "Changes a font color for the selection or at the insertion point. This requires a color value string to be passed in as a value argument."
  }, {
  	"cmd": "backColor",
  	"val": "red",
      "icon": "font",
      "windowtype": "colorWindow",
      "style": "style='background:#C96;'",
  	"desc": "Changes the document background color. In styleWithCss mode, it affects the background color of the containing block instead. This requires a color value string to be passed in as a value argument. (Internet Explorer uses this to set text background color.)"
  },{
  	"cmd": "hiliteColor",
  	"val": "Orange",
      "icon": "font",
      "windowtype": "colorWindow",
      "style": "style='background:#C96;'",
  	"desc": "Changes the background color for the selection or at the insertion point. Requires a color value string to be passed in as a value argument. UseCSS must be turned on for this to function. (Not supported by Internet Explorer.)"
  }, {
  	"cmd": "formatBlock",
      "val": "<blockquote>",
  	"desc": "Adds an HTML block-style tag around the line containing the current selection, replacing the block element containing the line if one exists (in Firefox, BLOCKQUOTE is the exception - it will wrap any containing block element). Requires a tag-name string to be passed in as a value argument. Virtually all block style tags can be used (eg. \"H1\", \"P\", \"DL\", \"BLOCKQUOTE\"). (Internet Explorer supports only heading tags H1 - H6, ADDRESS, and PRE, which must also include the tag delimiters &lt; &gt;, such as \"&lt;H1&gt;\".)"
  }, {
  	"cmd": "forwardDelete",
  	"desc": "Deletes the character ahead of the cursor's position.  It is the same as hitting the delete key."
  }, {
  	"cmd": "heading",
  	"val": "h3",
  	"icon": "heading",
      "windowtype": "header",
  	"desc": "Adds a heading tag around a selection or insertion point line. Requires the tag-name string to be passed in as a value argument (i.e. \"H1\", \"H6\"). (Not supported by Internet Explorer and Safari.)"
  }, {
  	"cmd": "indent",
  	"icon": "indent",
  	"desc": "Indents the line containing the selection or insertion point. In Firefox, if the selection spans multiple lines at different levels of indentation, only the least indented lines in the selection will be indented."
  }, {
  	"cmd": "insertBrOnReturn",
  	"desc": "Controls whether the Enter key inserts a br tag or splits the current block element into two. (Not supported by Internet Explorer.)"
  }, {
  	"cmd": "insertHorizontalRule",
      "icon": "window-minimize",
  	"desc": "Inserts a horizontal rule at the insertion point (deletes selection)."
  }, {
  	"cmd": "insertHTML",
  	"val": "<h3>Life is great</h3>",
  	"icon": "code",
      "pupap": "html",
  	"desc": "Inserts an HTML string at the insertion point (deletes selection). Requires a valid HTML string to be passed in as a value argument. (Not supported by Internet Explorer.)"
  }, {
  	"cmd": "insertOrderedList",
  	"icon": "list-ol",
  	"desc": "Creates a numbered ordered list for the selection or at the insertion point."
  }, {
  	"cmd": "insertUnorderedList",
  	"icon": "list-ul",
  	"desc": "Creates a bulleted unordered list for the selection or at the insertion point."
  }, {
  	"cmd": "insertParagraph",
  	"icon": "paragraph",
  	"desc": "Inserts a paragraph around the selection or the current line. (Internet Explorer inserts a paragraph at the insertion point and deletes the selection.)"
  }, {
  	"cmd": "insertText",
  	"val":  "",
  	"icon": "paste",
  	"desc": "Inserts the given plain text at the insertion point (deletes selection)."
  },  {
  	"cmd": "justifyCenter",
  	"icon": "align-center",
  	"desc": "Centers the selection or insertion point."
  }, {
  	"cmd": "justifyFull",
  	"icon": "align-justify",
  	"desc": "Justifies the selection or insertion point."
  }, {
  	"cmd": "justifyLeft",
  	"icon": "align-left",
  	"desc": "Justifies the selection or insertion point to the left."
  }, {
  	"cmd": "justifyRight",
  	"icon": "align-right",
  	"desc": "Right-justifies the selection or the insertion point."
  }, {
  	"cmd": "outdent",
  	"icon": "outdent",
  	"desc": "Outdents the line containing the selection or insertion point."
  }, {
  	"cmd": "paste",
  	"icon": "clipboard",
  	"desc": "Pastes the clipboard contents at the insertion point (replaces current selection). Clipboard capability must be enabled in the user.js preference file. See"
  },  {
  	"cmd": "removeFormat",
      "icon": "eraser",
  	"desc": "Removes all formatting from the current selection."
  }, {
  	"cmd": "selectAll",
  	"desc": "Selects all of the content of the editable region."
  }, {
  	"cmd": "subscript",
  	"icon": "subscript",
  	"desc": "Toggles subscript on/off for the selection or at the insertion point."
  }, {
  	"cmd": "superscript",
  	"icon": "superscript",
  	"desc": "Toggles superscript on/off for the selection or at the insertion point."
  },  {
  	"cmd": "createLink",
  	"val": "",
  	"icon": "link",
  	"desc": "Creates an anchor link from the selection, only if there is a selection. This requires the HREF URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)"
  },  {
  	"cmd": "unlink",
  	"icon": "unlink",
  	"desc": "Removes the anchor tag from a selected anchor link."
  }, {
  	"cmd": "useCSS ",
  	"desc": "Toggles the use of HTML tags or CSS for the generated markup. Requires a boolean true/false as a value argument. NOTE: This argument is logically backwards (i.e. use false to use CSS, true to use HTML). (Not supported by Internet Explorer.) This has been deprecated; use the styleWithCSS command instead."
  }, {
  	"cmd": "styleWithCSS",
  	"desc": "Replaces the useCSS command; argument works as expected, i.e. true modifies/generates style attributes in markup, false generates formatting elements."
  }, {
  	"cmd": "insertImage",
  	"val": "http://dummyimage.com/160x90",
  	"icon": "image",
      "pupap":"img",
  	"desc": "Inserts an image at the insertion point (deletes selection). Requires the image SRC URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)"
  }, {
  	"cmd": "insertImage",
  	"val": "",
  	"icon": "image",
      "desc": "Inserts an image at the insertion point (deletes selection). Requires the image SRC URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)"
  }, {
  	"cmd": "insertIcon",
      "icon": "flag",
      "pupap":"icons",
  	"desc": "Inserts a icon"
  }];

 }

export default Editor;

