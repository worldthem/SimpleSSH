import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import { headers, hideLoad, showLoad, showAlert, getSelectedRows,
         bulkUncheckAll, showThisPart, hideDiv, convertUnixPermissionToNumber,
         normalizePozition, getParentByTagName, getCookie } from './../Helpers.js';
import axios from 'axios';
import serialize from 'form-serialize';
import {SetBulk} from './../UtilsComponents.js';
import PopupCodeEditor from './PopupCodeEditor';

class FileManager extends Component {
 sessionStorageName = 'list-of-files';
 currentPath = 'current-path';

 constructor(props) {
       super(props);
       this.state = {rows : [],
                     editsRows: [],
                     title: '',
                     currentPath: "/" ,
                     copyMovePaths:"",
                     copyOrMove:"",
                     dataName:"",
                     dataI:0,
                     dataType:"",
                     dataGroup:"",
                     dataPermission:"",
                     }
 }

 componentDidMount(){
     var objRows=[];
     try{
       let data = sessionStorage.getItem(this.sessionStorageName);
       if(data!=null && data !=""){
        objRows =JSON.parse(data);
        this.setState({rows: objRows });
       }
     }catch(err){}

     this.setState({
        currentPath: sessionStorage.getItem(this.currentPath) == null ? "/" : sessionStorage.getItem(this.currentPath),
      });

      // this part is for right click menu
     const contextMenu = document.getElementById("context-menu");
     const scope = document.getElementById("rightClickShowMenu");
     scope.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            const trObj = getParentByTagName(event.target, "tr");
            this.setState({ dataName: trObj.getAttribute("data-name"),
                            dataI: trObj.getAttribute("data-nr"),
                            dataType:trObj.getAttribute("data-type"),
                            dataGroup:trObj.getAttribute("data-group"),
                            dataPermission:trObj.getAttribute("data-permission"),
            });


            const { clientX: mouseX, clientY: mouseY } = event;

            const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY, scope, contextMenu);

            contextMenu.classList.remove("visible");

            contextMenu.style.top = `${normalizedY}px`;
            contextMenu.style.left = `${normalizedX}px`;

            setTimeout(() => {
              contextMenu.classList.add("visible");
            });
          });

          scope.addEventListener("click", (e) => {
            // ? close the menu if the user clicks outside of it
           // if (e.target.offsetParent != contextMenu)
              contextMenu.classList.remove("visible");

          });

          contextMenu.addEventListener("click", (e) => {
                  // ? we need to close it if user click on any item
                 contextMenu.classList.remove("visible");
          });


  }

// getListOfUser
 getData =(e, noAdd=false)=>{
     e.preventDefault();
     var path = e.target.attributes.getNamedItem('data-path').value;

     let currentPath = noAdd? path : this.state.currentPath+"/"+path;
     currentPath = currentPath.replaceAll("///","/");
     currentPath = currentPath.replaceAll("//","/");
     showLoad();
     this.setState({currentPath: currentPath });
     axios.get(window.API_URL+'get-list-of-files?directory='+currentPath,  headers() )
                .then(res => {
                     this.setState({rows: res.data});
                     sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
                     sessionStorage.setItem(this.currentPath, currentPath);
                     hideLoad();
                  }).catch(error => {
                     alert(error);
                     hideLoad();
                 });
  }

  // upload
    uploadFile =(e)=>{
         e.preventDefault();
         let files = document.getElementById("uploadFileInp").files;
         if(files.length ==0)
           return null;
           // Create an object of formData
           const formData = new FormData();

           // Update the formData object
           for(var i=0; i < files.length; i++)
             formData.append( "files", files[i]);


           formData.append( "currentPath",  this.state.currentPath );
               // Request made to the backend api
               // Send formData object
          showLoad();
         axios.put(window.API_URL+'upload-to-server', formData, headers()).
               then(res => {
                   this.setState({rows: res.data });
                   sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
                   hideLoad();
                }). catch(error => {
                   alert(error);
                   hideLoad();
               });
    }


// breadcrumb
breadCrumb=()=>{
    var indents = [];
    var split = this.state.currentPath.split("/");
    var path="";
    for (var i = 0; i < split.length; i++) {
      if(split[i] != "" && split[i] != "/"){
          path= path+"/"+split[i];
          indents.push(<li class="breadcrumb-item" >
                          <a href="#" onClick={e=>this.getData(e, true)} data-path={path} title={path}>
                            {split[i]}
                          </a>
                       </li>);
      }
    }

    return ( <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                      <a href="#" onClick={e=>this.getData(e, "/", true)} title="/" data-path="/" >
                        <i class="bi bi-house-door" data-path="/"></i>
                      </a>
                  </li>
                   {indents}
                 </ol>
                 <div class="quickLinkDiv">
                  <a href="#" class="quickLinksFileManager" onClick={e=>this.getData(e, "/etc/", true)} title="/var/www/" data-path="/etc/" >
                      /etc/
                  </a>
                 <a href="#" class="quickLinksFileManager" onClick={e=>this.getData(e, "/var/www/", true)} title="/var/www/" data-path="/var/www/" >
                     /var/www
                 </a>
                 <a href="#" class="quickLinksFileManager" onClick={e=>this.getData(e, "/var/log", true)} title="/var/log/" data-path="/var/log/" >
                                      /var/log/
                  </a>
                  <a href="#" class="quickLinksFileManager" onClick={e=>this.getData(e, "/home/", true)} title="/home/" data-path="/home/" >
                     /home/
                  </a>
                  <a href="#" class="quickLinksFileManager" onClick={e=>this.getData(e, "/var/trash/", true)} title="/var/trash/" data-path="/var/trash/" >
                     <i class="bi bi-trash-fill" data-path="/var/trash/"></i> Trash
                  </a>
                  <a href="#" class="quickLinksFileManager" style={{color:"red"}} onClick={this.emptyTrash}  >
                     <i class="bi bi-trash"></i> Empty Trash
                   </a>
                  </div>
                 </nav>);
    }

   // get icon
    getIcon=(file="")=>{
      if(file.toLowerCase().includes(".jpg") || file.toLowerCase().includes(".jpeg") ||
         file.toLowerCase().includes(".png") || file.toLowerCase().includes(".gif")){
        return "file-image";
      }else if(file.toLowerCase().includes(".zip") || file.toLowerCase().includes(".tar")||
               file.toLowerCase().includes(".gz")){
         return "file-zip";
      }else if(file.toLowerCase().includes(".json") ){
         return "filetype-json";
      }else if(file.toLowerCase().includes(".js") ){
        return "filetype-js";
      }else if(file.toLowerCase().includes(".php") ){
        return "filetype-php";
      }else if(file.toLowerCase().includes(".css") ){
        return "filetype-css";
      }else if(file.toLowerCase().includes(".xml") ){
         return "filetype-xml";
      }else if(file.toLowerCase().includes(".java") ){
         return "filetype-java";
      }else if(file.toLowerCase().includes(".html") ){
        return "filetype-html";
      }else if(file.toLowerCase().includes(".txt") ){
        return "filetype-txt";
      }else{
        return "file-earmark";
      }
  }

  emptyTrash =(e)=>{
    e.preventDefault();

     if(!window.confirm("Are you sure you want to empty trash?"))
       return null;

     showLoad();
    axios.delete(window.API_URL+'empty-trash?currentPath='+this.state.currentPath, headers()).
             then(res => {
                 this.setState({rows: res.data });
                 sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
                 hideLoad();
             }). catch(error => {
                alert(error);
                hideLoad();
             });
  }

  // rename file folder
  rename =(e, name, i)=>{
     e.preventDefault();
     let newName = window.prompt("Enter the new name", name);
     if (newName == null || newName =="") {
       if(newName =="")
          alert( "The field should not be empty");
        return null;
    }
      const body = {fromName: this.state.currentPath +"/"+name,   toName: this.state.currentPath +"/"+newName };
      showLoad();
      axios.put(window.API_URL+'rename-file', body, headers()).
          then(res => {
              let rows = this.state.rows;
              rows[i].name= newName;
              this.setState({rows: rows });
              sessionStorage.setItem(this.sessionStorageName, JSON.stringify(rows));
              hideLoad();
          }). catch(error => {
             alert(error);
             hideLoad();
          });
  }
  //
  makePostCall=(body={}, url="")=>{
          showLoad();
          axios.put(window.API_URL+url, body, headers()).
              then(res => {
                  this.setState({rows: res.data });
                  sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
                  hideLoad();
              }). catch(error => {
                 alert(error);
                 hideLoad();
              });
  }
   // new file/folder
  newFileFolder =(e, typeNew)=>{
       e.preventDefault();
       let newName = window.prompt("Enter the name", "");
       if (newName == null || newName =="") {
         if(newName =="")
            alert( "The field should not be empty");
          return null;
      }
        const body = {typeNew:typeNew, name: this.state.currentPath +"/"+newName, currentPath: this.state.currentPath  };
        this.makePostCall(body, "new-file-folder");
    }

    //remove folders file
    removeItems =(e, directory="")=>{
       e.preventDefault();
       if(!window.confirm("Are you sure you want to remove the selected items?"))
           return null;

        var ids=getSelectedRows("checkboxBulk");
        if(directory =="" && ids.length==0)
           return null;

        let directories = directory !="" ? directory : ( ids.length>1 ? "{"+ids.join(",")+"} ": ids[0]);
        const body = {fileList:directories, currentPath:this.state.currentPath };
        this.makePostCall(body, "remove-file-folder");
        bulkUncheckAll("checkboxBulk");
    }

   //copy full path
   copyFullPath =(e, name="")=>{
      e.preventDefault();
      navigator.clipboard.writeText(this.state.currentPath+"/"+name);
      window.prompt("Use CTRL+C or Right click Copy", this.state.currentPath+"/"+name);

   }

   //empty file
   emptyFile =(e, name="")=>{
      e.preventDefault();
      if(!window.confirm("Are you sure you want to remove all content from file?"))
                     return null;

      const body = {filePath: this.state.currentPath+"/"+name, currentPath:this.state.currentPath };
      this.makePostCall(body, "empty-file-content");
   }

   // copy or move
    copyOrMove =(e, directory="", type="")=>{
       e.preventDefault();
       var ids=getSelectedRows("checkboxBulk");
       if(directory =="" && ids.length==0)
          return null;



       let directories = directory !="" ? this.state.currentPath+"/"+directory : ( ids.length>1 ? "{"+ids.join(",")+"} ": ids[0]);
       this.setState({copyMovePaths:directories, copyOrMove:type});
       bulkUncheckAll("checkboxBulk");
    }

   //paste from copy cut
   pasteFileFolder =(e)=>{
          e.preventDefault();
          const body = {fileList:    this.state.copyMovePaths,
                        typePaste:   this.state.copyOrMove,
                        currentPath: this.state.currentPath };
         this.makePostCall(body, "paste-file-folder");

         this.setState({copyMovePaths:"", copyOrMove:""});
   }
   // change owner
   changeOwner =(e, file="", owner="")=>{
      e.preventDefault();
      // this is for multiple select
       var ids=getSelectedRows("checkboxBulk");
       if(file =="" && ids.length==0)
          return null;

      const ownerArr = this.state.rows.filter(el => el.name==ids[0].split('/').pop());
      let newName = window.prompt("Enter the name", (ownerArr.length == 0 ? "www-data" : ownerArr[0]["group"]));

      if (newName == null || newName =="") {
        if(newName =="")
           alert( "The field should not be empty");
         return null;
     }

       const body = {owner: newName, filePath: file=="" ? ids.join(" ") : this.state.currentPath +"/"+file,
                     currentPath: this.state.currentPath, type:"owner"  };

       this.makePostCall(body, "change-owner-permission");
       bulkUncheckAll("checkboxBulk");
   }

    // change permission
    changePermission =(e, file="", permission="")=>{
         e.preventDefault();

        // this is for multiple select
        var ids=getSelectedRows("checkboxBulk");
        if(file =="" && ids.length==0)
           return null;

        const permArr = this.state.rows.filter(el => el.name==ids[0].split('/').pop() );
        var p = permArr.length == 0 ? permission : permArr[0]["permission"];
        let newName = window.prompt("Enter the permission like 755 or 644 or 600", convertUnixPermissionToNumber(p));
        if (newName == null || newName ==""){
           if(newName =="")
              alert( "The field should not be empty");
            return null;
        }
         // this is for multiple select
        var ids=getSelectedRows("checkboxBulk");
        if(file =="" && ids.length==0)
        return null;


         const body = {permissions: newName, filePath: file=="" ? ids.join(" ") : this.state.currentPath +"/"+file,
                        currentPath: this.state.currentPath, type:"file" };

        this.makePostCall(body, "change-owner-permission");
        bulkUncheckAll("checkboxBulk");
      }

    // show permission popup
    showPermissionDialog=(e, name="", permission="")=>{
      e.preventDefault();
      document.getElementById("permissionDialog").style.display="block";
      document.getElementById("filePath").value = this.state.currentPath +"/"+name;
      document.getElementById("folderInput").value = convertUnixPermissionToNumber(permission);
      document.getElementById("filesInput").value = convertUnixPermissionToNumber(permission);
    }
   // send data to server of permission
   changeFolderPermission =(e)=>{
     e.preventDefault();
     const form = e.currentTarget
     const body = serialize(form, {hash: true, empty: false})
     body["currentPath"] = this.state.currentPath;
     this.makePostCall(body, "change-owner-permission");
     document.getElementById("permissionDialog").style.display="none";
   }

  showHideSubmenu=(e,id="")=>{
    e.preventDefault();
 }

  addToArchive=(e, fileName="")=>{
     e.preventDefault();
     // this is for multiple select
     var ids=getSelectedRows("checkboxBulk");
     if(fileName=="" && ids.length==0)
        return null;

    const body = { filePath: (fileName !=""? this.state.currentPath +"/"+fileName :
                                             (ids.length>1 ? "{"+ids.join(",")+"} ": ids[0])),
                   currentPath: this.state.currentPath, type:"zip" };

    this.makePostCall(body, "add-to-archive-unzip");
    bulkUncheckAll("checkboxBulk");
  }
   extractArchive=(e,fileName="")=>{
      e.preventDefault();
      if(!window.confirm("Are you sure you want to extract the archive in: "+this.state.currentPath))
        return null;

      const body = { filePath: this.state.currentPath +"/"+fileName,
                     currentPath: this.state.currentPath, type:"unzip" };

      this.makePostCall(body, "add-to-archive-unzip");
      bulkUncheckAll("checkboxBulk");
    }

    editFile=(e, fName="",owner="")=>{
       e.preventDefault();

       var objRows=[];
       try{
         let data = localStorage.getItem("edit_files");
         if(data!=null && data !=""){
          objRows =JSON.parse(data);
         }
       }catch(err){  }

        showLoad();
        axios.get(window.API_URL+'get-file-content?pathFile='+this.state.currentPath +"/"+fName,  headers() )
             .then(res => {
                    hideLoad();
                    let obj ={path:this.state.currentPath,
                              content: res.data,
                              fileName: fName,
                              owner: owner,
                              fullPathWithName: this.state.currentPath +"/"+fName,
                             };
                     var newArr = objRows.filter(e=>e.fullPathWithName != this.state.currentPath +"/"+fName);
                         newArr.push(obj);
                    localStorage.setItem("edit_files", JSON.stringify(newArr));
                    document.getElementById("showPopupEditor").click();
                    this.setState({editsRows:newArr});
              }).catch(error => {
                  alert(error);
                  hideLoad();
              });

     }

  checkFolderSize =(e, path="")=>{
     e.preventDefault();
     showLoad();
     axios.get(window.API_URL+'get-size-folder?directory='+this.state.currentPath +"/"+path,  headers() )
                .then(res => {
                     showAlert(res.data);
                     hideLoad();
                  }).catch(error => {
                     alert(error);
                     hideLoad();
                 });
  }

  rightClickHtml=()=>{
    //dataName:"", dataI:0, dataType:"", dataGroup:"",

    return (<>
                     {(this.state.dataName.includes(".zip") || this.state.dataName.includes(".tar")|| this.state.dataName.includes(".gz"))&& this.state.dataType=="2" ?
                          <li><a class="dropdown-item" href="#" onClick={e=>this.extractArchive(e,this.state.dataName)}>
                               <i class="bi bi-file-zip"></i> Extract</a></li>
                          :<></>
                          }
                     {(this.state.dataType=="2" &&
                       (!this.state.dataName.includes(".zip") && !this.state.dataName.includes(".tar") && !this.state.dataName.includes(".gz")) &&
                       (!this.state.dataName.includes(".gif") && !this.state.dataName.toLowerCase().includes(".jpg") && !this.state.dataName.toLowerCase().includes(".jpeg")
                         && !this.state.dataName.toLowerCase().includes(".png"))
                       ) ?
                       <li><a class="dropdown-item" href="#" onClick={e=>this.editFile(e,this.state.dataName, this.state.dataGroup)}>
                            <i class="bi bi-pencil-square"></i> Edit</a></li>
                       :<></> }

                       <li>
                         <a class="dropdown-item" href="#" onClick={e=>this.rename(e, this.state.dataName,this.state.dataI)}>
                           <i class="bi bi-align-center"></i> Rename
                        </a>
                       </li>

                       {this.state.dataType=="1" ?
                       <>
                       <li><a class="dropdown-item" href="#"  onClick={e=> this.checkFolderSize(e, this.state.dataName )}>
                                                   <i class="bi bi-info"></i> Check Size</a></li>
                       <li><a class="dropdown-item" href="#"
                                  onClick={e=> this.showPermissionDialog(e, this.state.dataName, this.state.dataPermission)}>
                               <i class="bi bi-key"></i> Change Permission</a></li></>
                       :<></> }

                       {this.state.dataType=="2" ?
                       <li><a class="dropdown-item"
                            href={window.API_URL+"download-file?pathToFile="+this.state.currentPath +"/"+this.state.dataName+
                                                               "&fileName="+this.state.dataName+"&id="+localStorage.getItem("id")+
                                                               "&tok="+getCookie("tokenauth")}>
                          <i class="bi bi-download"></i> Download</a></li>:<></> }
                       <li><a class="dropdown-item" href="#" onClick={e=>this.copyFullPath(e, this.state.dataName)}>
                                            <i class="bi bi-clipboard-check"></i> Copy full path</a></li>

                       {this.state.dataType=="2" ?
                       <li><a class="dropdown-item" href="#" onClick={e=>this.emptyFile(e, this.state.dataName)}>
                            <i class="bi bi-calendar-x"></i> Empty file content</a></li> :<></> }

                        <li>
                          <a class="dropdown-item" href="#" style={{color:"red"}}
                                     onClick={e=>this.removeItems(e, this.state.currentPath +"/"+this.state.dataName )}>
                            <i class="bi bi-trash3"></i> Delete
                         </a>
                        </li>
                       <li> <a class="dropdown-item" href="#" onClick={e=>this.changeOwner(e, this.state.dataName, this.state.dataGroup)}>
                             <i class="bi bi-people"></i> Change Owner</a></li>

                       <li><a class="dropdown-item" href="#" onClick={e=>this.addToArchive(e, this.state.dataName)}>
                            <i class="bi bi-file-earmark-zip"></i> Add to zip</a></li>
                        <li> <a  class="dropdown-item" href="#" onClick={e=>this.copyOrMove(e, this.state.dataName,"copy")}><i class="bi bi-clipboard-check"></i> Copy</a> </li>
                        <li> <a  class="dropdown-item" href="#" onClick={e=>this.copyOrMove(e, this.state.dataName,"move")}><i class="bi bi-arrows-move"></i> Cut</a> </li>
                     </>);
  }

  render() {
    return (
       <div>
          <ul id="context-menu" >
              {this.rightClickHtml()}
          </ul>

         <div class="row align-items-center shadow-sm bg-body rounded paddingBottomTopForm">
             <div class="col-md-9">
                 <input type="file" name="upload" id="uploadFileInp" class="form-control" required={true} multiple={true}/>
             </div>
             <div class="col-md-3">
               <button class="btn btn-primary btn_small" type ="submit" onClick={this.uploadFile} >Upload file</button>
             </div>

           </div>

         <div class="height5px"></div>
        <div class="topLinks">
        {this.state.copyMovePaths !=""?
          <><a href="#" onClick={this.pasteFileFolder}><i class="bi bi-folder-symlink"></i> Paste </a></>
         :<>
          <a href="#" onClick={e=>this.copyOrMove(e,"","copy")}><i class="bi bi-clipboard-check"></i> Copy</a>
          <a href="#" onClick={e=>this.copyOrMove(e,"","move")}><i class="bi bi-arrows-move"></i> Cut</a>
         </>}
          <a href="#" onClick={e=>this.newFileFolder(e,"folder")}><i class="bi bi-folder-plus"></i> New Folder</a>
          <a href="#" onClick={e=>this.newFileFolder(e,"file")}><i class="bi bi-file-earmark-plus"></i> New file</a>
          <a href="#" onClick={e=>this.removeItems(e,"")}><i class="bi bi-trash3"></i> Remove Selected</a>
          <a href="#" onClick={e=>this.changeOwner(e, "", "www-data")}> <i class="bi bi-people"></i> Change Owner</a>
          <a href="#" onClick={e=>this.changePermission(e, "", "-rw-r--r--")}> <i class="bi bi-key"></i> Change Permission</a>
          <a href="#" onClick={e=>this.addToArchive(e,"")}> <i class="bi bi-file-earmark-zip"></i> Add to zip</a>
       </div>

         <div class="height10px"></div>
          {this.breadCrumb()}
         <div class="row">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" style={{width:"25px"}}><SetBulk cssClass="checkboxBulk"/></th>
                <th scope="col">Name</th>
                <th scope="col">Size</th>
                <th scope="col">Info</th>
                <th scope="col">Action</th>
             </tr>
            </thead>
            <tbody id="rightClickShowMenu">
            {this.state.rows.map((row,i)=>
              <tr data-name={row.name} data-nr={i} data-type={row.type} data-group={row.group} data-permission={row.permission}>
                 <td> <input class="checkboxBulk" type="checkbox" value={this.state.currentPath+"/"+row.name}/></td>
                <td>
                 {row.type =="1" ?
                  <a href="#" onClick={e=>this.getData(e, false)} data-path={row.name} style={{fontStyle:"bold"}}
                       title={this.state.currentPath+"/"+row.name}>
                     <i class="bi bi-folder-fill" data-path={row.name}></i> {row.name}
                  </a>:
                    <a href="#" onClick={e=>this.editFile(e,row.name, row.group)}>
                      <i class={"bi bi-"+this.getIcon(row.name)} data-path={row.name}></i> {row.name}
                    </a>
                   }
                </td>
                <td>
                    {row.size}
                </td>
                  <td>
                      {row.data}
                  </td>
                <td>
                <div class="btn-group menu-settingFile">
                  <a href="#"  class="dropdown-toggle showNextSubmenu" onClick={e=>this.showHideSubmenu(e,"menuTable"+i)}>
                    <i class="bi bi-gear-wide-connected"></i>
                  </a>
                  <ul class="dropdown-menu dropDawnSubMenu" id={"menuTable"+i}>
                  {(row.name.includes(".zip") || row.name.includes(".tar")|| row.name.includes(".gz"))&& row.type=="2" ?
                       <li><a class="dropdown-item" href="#" onClick={e=>this.extractArchive(e,row.name)}>
                            <i class="bi bi-file-zip"></i> Extract</a></li>
                       :<></>
                       }
                  {(row.type=="2" &&
                    (!row.name.includes(".zip") && !row.name.includes(".tar") && !row.name.includes(".gz")) &&
                    (!row.name.includes(".gif") && !row.name.toLowerCase().includes(".jpg") && !row.name.toLowerCase().includes(".jpeg")
                      && !row.name.toLowerCase().includes(".png"))
                    ) ?
                    <li><a class="dropdown-item" href="#" onClick={e=>this.editFile(e,row.name, row.group)}>
                         <i class="bi bi-pencil-square"></i> Edit</a></li>
                    :<></> }

                    <li>
                      <a class="dropdown-item" href="#" onClick={e=>this.rename(e, row.name,i)}>
                        <i class="bi bi-align-center"></i> Rename
                     </a>
                    </li>

                    {row.type=="1" ?
                    <>
                    <li><a class="dropdown-item" href="#"  onClick={e=> this.checkFolderSize(e, row.name )}>
                                                <i class="bi bi-info"></i> Check Size</a></li>
                    <li><a class="dropdown-item" href="#"
                               onClick={e=> this.showPermissionDialog(e, row.name, row.permission)}>
                            <i class="bi bi-key"></i> Change Permission</a></li></>
                    :<></> }

                    {row.type=="2" ?
                    <li><a class="dropdown-item"
                         href={window.API_URL+"download-file?pathToFile="+this.state.currentPath +"/"+row.name+"&fileName="+row.name+
                                                            "&id="+localStorage.getItem("id")+"&tok="+getCookie("tokenauth")}>
                       <i class="bi bi-download"></i> Download</a></li>:<></> }
                    <li><a class="dropdown-item" href="#" onClick={e=>this.copyFullPath(e, row.name)}>
                                         <i class="bi bi-clipboard-check"></i> Copy full path</a></li>

                    {row.type=="2" ?
                    <li><a class="dropdown-item" href="#" onClick={e=>this.emptyFile(e, row.name)}>
                         <i class="bi bi-calendar-x"></i> Empty file content</a></li> :<></> }

                     <li>
                       <a class="dropdown-item" href="#" style={{color:"red"}}
                                  onClick={e=>this.removeItems(e, this.state.currentPath +"/"+row.name )}>
                         <i class="bi bi-trash3"></i> Delete
                      </a>
                     </li>
                  </ul>
                </div>
               </td>
              </tr>
             )}
            </tbody>
          </table>
          <div class="col-md-12">
              <p class="text_align_center"> </p>
         </div>

          {/*Dialog permission*/}
          <div class="promptDialog" id="permissionDialog">
           <form onSubmit={this.changeFolderPermission} action="#" method="POST">
             <input type="hidden" name="filePath" id="filePath" />
             <input type="hidden" name="type" value="folder" />
             <p>
                Enter the permission like 755 or 644 or 600 <br/>
               <input type="text" name="permissions" placeHolder="" id="folderInput" class="form-control"/>
             </p>
             <p> <label> <input type="checkbox" value="yes" name="yesSubPermission" onClick={e=>showThisPart(e,"showThisPart")}/> Set permission for all file/folder inside </label></p>
              <p id="showThisPart">
                 Enter the permission like 755 or 644 or 600 <br/>
                 <input type="text" placeHolder="" id="filesInput" name="subPermission" class="form-control"/>
              </p>
              <div class="height5px"></div>
              <div class="text_align_right">
                <button type="submit" class="btn btn-primary btn_small_small">OK</button> &nbsp;&nbsp;
                <a href="#" class="btn btn-secondary btn_small_small" onClick={e=>hideDiv(e,"permissionDialog")}>Cancel</a>
              </div>
           </form>
          </div>

        </div>
        <PopupCodeEditor editsRows={this.state.editsRows}  />
       </div>
    );
  }
}

export default FileManager;