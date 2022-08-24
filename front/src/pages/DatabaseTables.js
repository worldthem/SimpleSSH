import React from 'react'
import ReactDOM from 'react-dom'
//import AppNavbar from './../layouts/AppNavbar';
import { Link } from 'react-router-dom';
import { headers, hideLoad, showLoad, showAlert, generatePassword } from './../Helpers.js';
import axios from 'axios';
import serialize from 'form-serialize';
import { optionType,optionCollation  } from './../layouts/SelectType.js';

class DatabaseTables extends React.Component {
 sessionStorageNameDb = 'list-of-database-tables';
 defObj= {fname:"", ftype:"INT", flength:"10", fcollation:"", fnull:"ye", fdefault:"", fprimary:"", fautoincrement:""};
 constructor(props) {
       super(props);
       this.state = {rows : [],
                     text: '',
                     title: '',
                     newTable:"none",
                     fieldsList:[this.defObj],
                    }
 }

 componentDidMount(){
    this.getData(this.props.match.params.dbname);
  }

// getListOfUser or database
 getData =( database)=>{
     showLoad();
     axios.get(window.API_URL+'get-list-of-database-tables?database='+database,  headers() )
                .then(res => {
                      this.setState({rows: res.data });
                      hideLoad();
                  }).catch(error => {
                     alert(error);
                     hideLoad();
                 });
  }


  // add new database
   addNewData =(e)=>{
     e.preventDefault();
     var tbName= document.getElementById("tableNameAdd").value;
     showLoad();

     axios.put(window.API_URL+'add-new-database-table?table='+tbName+'&database='+this.props.match.params.dbname,
               this.state.fieldsList, headers()).
           then(res => {
               this.setState({rows: res.data.rows });

              alert(res.data.response !=""? res.data.response:
                    "Database has ben added, check on the list bellow, if is not than there is an error");

               hideLoad();
            }). catch(error => {
              alert(error);
              hideLoad();
           });
   }

//remove user
 removeData = (e, name="")=>{
   e.preventDefault();
   if(!window.confirm("Are you sure you want to remove the: "+name+" ?"))
   return null;

    showLoad();
    axios.delete(window.API_URL+'remove-database-table?table='+name+'&database='+this.props.match.params.dbname,  headers() )
         .then(res => {
              hideLoad();
              this.setState({rows: res.data.rows });
              if(res.data.response !="")
                 alert(res.data.response);

            }).catch(error => {
              alert(error);
              hideLoad();
          });
 }

 addField=(e)=>{
   e.preventDefault();
    const obj = [ ...this.state.fieldsList];
    obj.push(this.defObj);
    this.setState({ fieldsList:obj });
 }
 
 removeField=(e, nr=0)=>{
   e.preventDefault();
   const obj = [ ...this.state.fieldsList];
       obj.splice(nr, 1);
    this.setState({ fieldsList:obj  });
 }

 updValue=(e, index,  type="inp")=>{
    let listObj = [ ...this.state.fieldsList];
    let tempObj = { ...listObj[index]};

   if(type=="inp" || type=="select"){
     tempObj[e.target.name] = e.target.value;
   }else if(type=="checkbox"){
     tempObj[e.target.name] = e.target.checked ? "yes":"";
   }
    listObj[index] = tempObj;

   this.setState({ fieldsList: listObj });
 }

 newTableBtn=(e)=>{
   e.preventDefault();
   this.setState({ newTable: this.state.newTable =="none"? "block" : "none" });
 }

  render() {
    return (
       <div>
          <form onSubmit={this.addNewData} action="#" method="POST" style={{display:this.state.newTable}}>
           <div class="row align-items-center shadow-sm bg-body rounded paddingBottomTopForm">
             <div class="col-md-12">
                 <small>Table Name</small> <br/>
                   <input type="text" name="tname" id="tableNameAdd" class="form-control" required={true} placeHolder="Table Name"/>
             </div>

             <div class="clear"></div>
           {this.state.fieldsList.map((el,x)=>
            <div class="blockFields row">
             <div class="col-md-2">
                <small>Field Name</small> <br/>
                <input type="text" name="fname" onChange={e=>this.updValue(e,x)} class="form-control" required={true} placeHolder="Field Name"/>
             </div>
             <div class="col-md-2">
                <small>Type</small><br/>
                <select name="ftype" class="form-control" onChange={e=>this.updValue(e,x,"select")} required={true} >
                      {optionType()}
                </select>
             </div>
             <div class="col-md-2">
               <small>Length</small> <br/>
                <input type="text" name="flength" onChange={e=>this.updValue(e,x)} defaultValue={10} class="form-control" title="Length" placeHolder="Length"/>
              </div>
              <div class="col-md-2">
                 <small>Collation</small> <br/>
                  <select dir="ltr" name="fcollation" onChange={e=>this.updValue(e,x,"select")} class="form-control">
                    {optionCollation()}
                  </select>
              </div>
             <div class="col-md-2"><br/>
               <label><input type="checkbox" name="fnull" defaultChecked={true} onChange={e=>this.updValue(e,x,"checkbox")} value="NULL" /> NULL</label>
             </div>
              <div class="col-md-2">
                 <small>Default</small> <br/>
                 <input type="text" name="fdefault" class="form-control" onChange={e=>this.updValue(e,x)} title="Default" placeHolder="Default"/>
              </div>
              <div class="height10px"></div>
             <div class="col-md-2">
                <label><input type="checkbox" name="fautoincrement" onChange={e=>this.updValue(e,x,"checkbox")} value="NULL" /> Auto increment</label>
             </div>
             <div class="col-md-2">
               <label>  <input type="radio" name="fprimary"  value="primary" onChange={e=>this.updValue(e,x,"checkbox")}/> Primary Key</label>
             </div>
             <div class="col-md-8 text_align_right">
                <a href="#" onClick={e=>this.removeField(e,x)}><i class="bi bi-x-octagon"></i></a>
             </div>
             <div class="clear"></div>
           </div>
           )}
           <div class="height10px"></div>
              <div class="col-md-12">
                 <p class="text_align_center">
                   <a href="#" onClick={this.addField}> <i class="bi bi-plus-square"></i> Add new field</a>
                 </p>
              </div>
             <div class="col-md-12">
                <p class="text_align_center">
                  <button class="btn btn-primary btn_small" type ="submit" >Add New Table</button>
                </p>
             </div>

           </div>
         </form>
              <div class="height5px"></div>
              <nav aria-label="breadcrumb">
                 <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                      <a href={window.BASE_URL+"#/database-mysql/"} title="Databases" >
                        <i class="bi bi-hdd-stack"></i> Databases
                      </a>&nbsp;
                  </li>
                   <li class="breadcrumb-item"> &nbsp;
                     <a href={window.BASE_URL+"#/database-mysql/"+this.props.match.params.dbname} title={this.props.match.params.dbname} >
                       <i class="bi bi-table"></i> {this.props.match.params.dbname}
                     </a>
                   </li>

                 </ol>

                 <div class="quickLinkDiv">
                   <a href="#" onClick={this.newTableBtn}> <i class="bi bi-plus-square"></i> Add new Table</a>
                 </div>

               </nav>
         <div class="clear"></div>
         <div class="row">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Structure</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
            {this.state.rows.map(row=>
              <tr>
                <td>
                 <a href={window.BASE_URL+"#/database-mysql-table-data/"+this.props.match.params.dbname+"/"+row} >
                   <i class="bi bi-table"></i> {row}
                </a>
                </td>
                <td>
                   <a href={window.BASE_URL+"#/database-mysql-table-structure/"+this.props.match.params.dbname+"/"+row}>
                      <i class="bi bi-layout-text-sidebar-reverse"></i> Structure
                   </a>
                 </td>
                <td>
                   <a href="#" onClick={e=>this.removeData(e, row )}>
                      <i class="bi bi-trash3"></i> Delete
                   </a>
                </td>
              </tr>
             )}
            </tbody>
          </table>

        </div>
       </div>
    );
  }
}

export default DatabaseTables;