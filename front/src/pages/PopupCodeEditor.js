import React from 'react'
import ReactDOM from 'react-dom'
import Editor from "@monaco-editor/react";
import {getLanguage, headers, hideLoad, showLoad, showAlert} from './../Helpers.js';
import axios from 'axios';

class PopupCodeEditor extends React.Component {
 sessionStorageName = "edit_files";
 sessionStorageMinimise = "minimiseEditor";
 constructor(props) {
       super(props);
       this.state = {
                     rows:[],
                     text: '',
                     filename: '',
                     language:'',
                     path:'',
                     showAjax:'none',
                     activeTab:0,
                     showAjaxAll:"none",
                    }
 }
 updateRows=()=>{
        var objRows=[];
        try{
          let data = localStorage.getItem(this.sessionStorageName);
          if(data!=null && data !=""){
           objRows =JSON.parse(data);
           this.setState({rows:objRows, activeTab:(objRows.length-1)});
          }
        }catch(err){  }
 }

 componentDidMount(){
   this.updateRows();
          /*
          this.setState({text:     this.props.text,
                    filename: this.props.filename,
                    language: getLanguage(this.props.filename),
                    path:     this.props.path,
                });*/
 }

  componentWillReceiveProps(props){
    this.updateRows();
  }



 showEditor=(e)=>{
    e.preventDefault();
    try{
      document.getElementById("mini-modal-editor").style.display = "block";
      document.getElementsByTagName('body')[0].style.overflowY = "hidden"  ;
      document.getElementById("editorBottomLink").style.display = "none";
    }catch(err){}
    localStorage.setItem(this.sessionStorageMinimise,"");

 }


 closeEditor=(e)=>{
     e.preventDefault();
      try{
        document.getElementsByTagName('body')[0].style.overflowY = "visible"  ;
        document.getElementById("mini-modal-editor").style.display = "none";

         //this.setState({text: "", filename: "", });
      }catch(err){}
      this.setState({rows:[]});
      localStorage.setItem(this.sessionStorageName,"");
      localStorage.setItem(this.sessionStorageMinimise,"");
  }



   minimisePopup=(e)=>{
        e.preventDefault();
        try{
          document.getElementsByTagName('body')[0].style.overflowY = "visible"  ;
          document.getElementById("mini-modal-editor").style.display = "none";
          document.getElementById("editorBottomLink").style.display = "block";
        }catch(err){}
        localStorage.setItem(this.sessionStorageMinimise,"yes");
    }

  onChange = (newValue, j) => {
      try{
           var rows = this.state.rows;
               rows[j]["content"] = newValue;
           this.setState({rows: rows});
           localStorage.setItem(this.sessionStorageName, JSON.stringify(rows));
        }catch(err){}
  }

 closeTab=(e, j)=>{
   e.preventDefault();
    try{
         var rows = this.state.rows;
             rows.splice(j, 1);
         this.setState({rows: rows, activeTab: (rows.length-1)});
         localStorage.setItem(this.sessionStorageName, JSON.stringify(rows));
    }catch(err){}
  }

  updateFile =(e, j, type="single")=>{
       e.preventDefault();
       const body = type=="all" ? this.state.rows : [this.state.rows[j]];
       if(type=="all") { this.setState({showAjaxAll: 'inline'}); }else{ this.setState({showAjax: 'inline'}); }

       axios.put(window.API_URL+'save-file-content', body, headers()).
           then(res => {
               this.setState({showAjax: 'none', showAjaxAll:"none"});
               alert(res.data);
            }). catch(error => {
              alert(error);
              this.setState({showAjax: 'none', showAjaxAll:"none"});
           });
    }

    activateTab =(e, nr=0)=>{
        e.preventDefault();
        this.setState({activeTab: nr});
    }

  render() {
     return (
        <>
          <div class="reveal-modal-bg modal-window" id="mini-modal-editor" >
              <div class="reveal-modal"  >
                <div class="modal-body modal-body-sub" style={{position: "relative"}}>
                  <button type="button" class="close_alert minimisePopup" onClick={this.minimisePopup} data-modal="#mini-modal" aria-hidden="true"> - </button>
                  <button type="button" class="close_alert close_modalinner" onClick={this.closeEditor} data-modal="#mini-modal" aria-hidden="true"> &times;</button>
                   <div>
                    <ul class="nav nav-tabs smallTabs">
                        {this.state.rows.map((row,i)=>
                          <li class="nav-item positionRelative navTabEditor">
                            <a class={"nav-link"+ (this.state.activeTab ==i ? " active":"")} aria-current="page" href="#" onClick={e=>this.activateTab(e,i)}>{row.fileName}</a>
                            <a href="#" onClick={e=>this.closeTab(e,i)} class="closeTabA"><i class="bi bi-x-square-fill"></i></a>
                          </li>
                        )}
                     </ul>
                     <div class="clear"></div>
                    {this.state.rows.map((row,j)=>
                      <div class="editTabs" style={{display:(this.state.activeTab ==j ? "block":"none")}}>
                         <div class="headerEditor">
                              <i style={{marginLeft:"17px"}}><small>{row.path}</small></i>
                              {this.state.rows.length>1?
                              <a href="#" onClick={e=>this.updateFile(e, j,"all")} class="btn btn-info btn_small_small_small">
                                 Update All <img style={{width:"20px", display:this.state.showAjaxAll}} src={window.BASE_URL+"assets/img/ajax-loader.gif"}/>
                              </a>: <></>}

                              <a href="#" onClick={e=>this.updateFile(e, j)} class="btn btn-info btn_small_small_small">
                                 Save Changes <img style={{width:"20px", display:this.state.showAjax}} src={window.BASE_URL+"assets/img/ajax-loader.gif"}/>
                              </a>

                          </div>
                          <div class="clear"></div>
                          <Editor
                               height="88vh"
                               language={getLanguage(row.fileName)}
                               defaultValue=""
                               value={row.content}
                               onChange={e=>this.onChange(e,j)}
                           />
                       </div>
                       )}
                       <div class="height5px"></div>

                   </div>
                </div>
              </div>
           </div>
           <a href="#" id="showPopupEditor" onClick={this.showEditor}> </a>
           <a href="#" class="editorMinimiseLink" id="editorBottomLink" onClick={this.showEditor}
                   style={{display:localStorage.getItem(this.sessionStorageMinimise)=="yes"?  "block":"none"}}>
               <i class="bi bi-pencil-square"></i> Show Editor
           </a>

         </>
       );
     }
   }

export default PopupCodeEditor;