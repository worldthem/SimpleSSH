import React, { useState } from 'react';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML  } from 'draft-convert';
//import draftToHtml from 'draftjs-to-html';
import axios from 'axios';

import {headers} from './../../Helpers.js';


//import CustomOption from './editor/CustomOption.js';

class TextEditor extends React.Component{

 constructor(props) {
     super(props);

      this.state={
          editorState: EditorState.createEmpty(),
          convertedContent:"",
          displayEditor:"",
          displayHtml:"none",
       }
   }

 componentDidMount(){ }

 componentWillReceiveProps(nextProps) {
    if(nextProps.html !== "undefined" ) {
      var html = nextProps.html;
      var blocksFromHTML = convertFromHTML(html ==null ? "": html)
      var content = ContentState.createFromBlockArray(blocksFromHTML);

      this.setState({
          editorState: EditorState.createWithContent(content),
          convertedContent:html
       });


      // var content= document.getElementsByClassName("public-DraftEditor-content");
    //   content[0].innerHTML= html;
    }
 }


  handleEditorChange = (state) => {
           let currentContentAsHTML = convertToHTML(state.getCurrentContent());
        //var content= document.getElementsByClassName("public-DraftEditor-content");

         this.setState({
              editorState: state,
              convertedContent: currentContentAsHTML
         });
         //this.convertContentToHTML();
   }

    convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(this.state.editorState.getCurrentContent());
        this.setState({convertedContent: currentContentAsHTML});
    }

   uploadCallback =(file)=>{
          // Create an object of formData
          const formData = new FormData();

          formData.append( "file", file);

         // Request made to the backend api
         // Send formData object
          axios.post(window.API_URL+'cp/simple-upload',
                     formData,
                     headers()).
               then(res => {
                  return "/content/images/"+res.data;
               }). catch(error => {
                   alert(error);
               });
   }

     config={
        image: { uploadCallback: this.uploadCallback }
      }

     showWindow=(e,type="")=>{
          e.preventDefault();
         this.setState({
                  displayEditor: type=="editor" ? "":"none",
                  displayHtml: type=="html" ? "":"none",
               });
     }

     onchangeHtml=(e)=>{

     if(this.state.displayHtml==""){
        var blocksFromHTML = convertFromHTML(e.target.value)
        var content = ContentState.createFromBlockArray(blocksFromHTML);

       this.setState({
            editorState: EditorState.createWithContent(content),
            convertedContent:e.target.value,
          });
       }

     }


     render(){
         return(
             <div>
                  <a href="#" onClick={e=>this.showWindow(e, "editor")}>Editor</a>&nbsp;|&nbsp;
                  <a href="#" onClick={e=>this.showWindow(e, "html")}>HTML</a>
                  <div class="height5px"></div>
                  <div class="height10px" style={{borderTop:"1px solid #ccc"}}></div>
                <div style={{display:this.state.displayEditor}}>
                 <Editor
                   editorState={this.state.editorState}
                   onEditorStateChange={this.handleEditorChange}
                   wrapperClassName="wrapper-class"
                   editorClassName="editor-class"
                   toolbarClassName="toolbar-class"
                   toolbar={ this.config }
                 />
                 </div>
                 <div class="popupEdtorHtmlWind" style={{display:this.state.displayHtml}}>
                    <textarea name={this.props.textareaName} class="textEditor" onChange={this.onchangeHtml}
                           value={this.state.convertedContent} ></textarea>
                 </div>
             </div>

           )}

 }

export default TextEditor;

/*
const TextEditor = (props) => {

const html =typeof props.html =="undefined" ? "": props.html; //'<div><p>hello</p></div>'
const blocksFromHTML = convertFromHTML(html)
const content = ContentState.createFromBlockArray(blocksFromHTML)

  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(content),
  );
  const  [convertedContent, setConvertedContent] = useState(null);

  const handleEditorChange = (state) => {
       setEditorState(state);
       convertContentToHTML();
     }
  const convertContentToHTML = () => {
      let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
      setConvertedContent(currentContentAsHTML);
  }
   const createMarkup = (html) => {
   alert(html);
      return  {
        __html:html
      }
    }

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />

      <textarea defaultValue={convertedContent}></textarea>

    </div>
  )
}
export default TextEditor;*/