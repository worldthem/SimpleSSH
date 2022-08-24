import React from 'react'
import ReactDOM from 'react-dom'
//import AppNavbar from './../layouts/AppNavbar';
import { Link } from 'react-router-dom';
import { headers, hideLoad, showLoad, showAlert, generatePassword, setInput,
          getSelectedRows, bulkUncheckAll } from './../Helpers.js';
import { optionType,optionCollation  } from './../layouts/SelectType.js';
import {SetBulk} from './../UtilsComponents.js';
import axios from 'axios';
import serialize from 'form-serialize';
import Pagination from './../pagination/Pagination';

class DatabaseTablesData extends React.Component {
 sessionStorageNameDb = 'list-of-database-tables';
 constructor(props) {
       super(props);
       this.state = {rows : [],
                     columns:[],
                     title: '',
                     newTable:"none",
                     makeSql:"none",
                     typeBtn:"add",
                     whereUpdate:"",
                     currentPage: 1,
                     totalCount: 0,
                     pageSize: 100,
                     queryView:false,
                    }
 }

 componentDidMount(){
    /*
    try{
          let data = sessionStorage.getItem("mysql_data-rows");
          if(data!=null && data !="")
          this.setState({rows: JSON.parse(data) });

          let data2 = sessionStorage.getItem("mysql_data-columns");
          //alert(data2);
          if(data2!=null && data2 !="")
          this.setState({columns: JSON.parse(data2) });
          let data3 = sessionStorage.getItem("mysql_data-total");
           this.setState({totalCount: data3 });

       }catch(err){}*/

       this.getData(this.props.match.params.dbname, this.props.match.params.tbname);
       //bulkUncheckAll("checkboxBulk");

 }

// getListOfUser or database
 getData =( database, table="", page=1)=>{
     showLoad();
     axios.get(window.API_URL+'get-list-of-database-table-data?database='+database+"&table="+table+"&page="+page,  headers() )
                .then(res => {
                      this.setState({rows: res.data.rows,
                                     totalCount: parseInt(res.data.total),
                                     columns: res.data.columns,
                                     currentPage: page});
                       //alert(parseInt(res.data.total));
                       //sessionStorage.setItem("mysql_data-rows", JSON.stringify(res.data.rows));
                       //sessionStorage.setItem("mysql_data-total", res.data.total);
                      // sessionStorage.setItem("mysql_data-columns", JSON.stringify(res.data.columns));

                      hideLoad();
                  }).catch(error => {
                     alert(error);
                     hideLoad();
                 });
  }

 setCurrentPage=(page)=>{
   this.getData(this.props.match.params.dbname, this.props.match.params.tbname, page);
 }

  // add new database
  addNewData =(e)=>{
     e.preventDefault();
     const form = e.currentTarget
     const body = serialize(form, {hash: true, empty: true, queryView:false})
     showLoad();
     axios.put(window.API_URL+'add-new-data-to-table?table='+this.props.match.params.tbname+
                                               '&database='+this.props.match.params.dbname+
                                               '&typeBtn='+this.state.typeBtn+
                                               '&page='+this.state.currentPage,
              {data:body, columns: this.state.columns, where: this.state.whereUpdate}  , headers()).
           then(res => {
               this.setState({rows: res.data.rows });
               alert(res.data.response !="" ? res.data.response : "Success");
               hideLoad();
            }). catch(error => {
              alert(error);
              hideLoad();
           });
   }


//remove
 removeData = (e, i)=>{
   e.preventDefault();

   if(!window.confirm("Are you sure you want to remove the data?"))
   return null;

     const data = { ...this.state.rows[i] };
     const where = [];
     try{
       for(var j=0;j<this.state.columns.length;j++){
        if(this.state.columns[j].Key !="")
          where.push("p."+this.state.columns[j].Field +" = '"+data[this.state.columns[j].Field]+"'");
       }
     }catch(err){}

    this.removeDataIPL(where.join(","));
 }

//remove bulck
 removeDataBulk = (e )=>{
   e.preventDefault();

   var ids=getSelectedRows("checkboxBulk");
       if( ids.length==0)
              return null;

   if(!window.confirm("Are you sure you want to remove the data?"))
   return null;

     const whereObj = {};

     try{
         for(var m=0;m<ids.length;m++){
              const data = { ...this.state.rows[ids[m]] };

              for(var j=0;j<this.state.columns.length;j++){
                if(this.state.columns[j].Key !=""){
                  var is = whereObj["p."+this.state.columns[j].Field];
                   if(typeof is === 'undefined'){
                        whereObj["p."+this.state.columns[j].Field] = "'"+data[this.state.columns[j].Field]+"'";
                     }else{
                        whereObj["p."+this.state.columns[j].Field] = is +",'"+data[this.state.columns[j].Field]+"'";
                     }
                }
              }
        }
     }catch(err){}

     const where = [];
     for (const property in whereObj) {
         where.push(property +" IN ("+whereObj[property]+")");
      }
     this.removeDataIPL(where.join(" AND "));
 }

 removeDataIPL = (where)=>{
    showLoad();
    this.setState({queryView:false });
     axios.delete(window.API_URL+'remove-database-row?table='+this.props.match.params.tbname+
                                 '&database='+this.props.match.params.dbname+
                                 '&where='+where+
                                 '&page='+this.state.currentPage
                                 , headers())
          .then(res => {
               hideLoad();
               this.setState({rows: res.data.rows });
               alert(res.data.response !="" ? res.data.response:"Success");
           }).catch(error => {
               alert(error);
               hideLoad();
           });
  }

 newTableBtn=(e)=>{
   e.preventDefault();
   this.setState({ newTable: this.state.newTable =="none"? "block" : "none", makeSql:"none", typeBtn:"add" });
   document.getElementById("editFormData").reset();
 }



 editBtn =(e, i)=>{
   e.preventDefault();
   this.setState({ typeBtn:"edit" });
   const data = { ...this.state.rows[i] };
   const where = [];
   try{
       for(var j=0;j<this.state.columns.length;j++){
        if(this.state.columns[j].Key !="")
          where.push("p."+this.state.columns[j].Field +" = '"+data[this.state.columns[j].Field]+"'");
       }
   }catch(err){}

    setTimeout(function() {
        setInput(data, "en");
       }, 500);
   this.setState({ newTable: "block", makeSql:"none",  whereUpdate:where.join(",")});
 }

duplicate =(e, i)=>{
   e.preventDefault();
   this.setState({ typeBtn:"add" });
   const data = { ...this.state.rows[i] };
   setInput(data, "en");
   this.setState({ newTable: "block" , whereUpdate: ""});
 }

 showSql =(e)=>{
   e.preventDefault();
   this.setState({ makeSql: this.state.makeSql =="none"? "block" : "none" , newTable:"none" });
 }

  runSql =(e)=>{
    e.preventDefault();
     var value = document.getElementById("sqlTextare").value;
     if(value =="")
       return null;

      showLoad();
     axios.put(window.API_URL+'execute-query' ,
              {query: value}  , headers()).
           then(res => {
               hideLoad();
               this.setState({rows: res.data.rows, queryView:true });
               if(res.data.response !="")
                 alert(res.data.response);

            }). catch(error => {
              alert(error);
              hideLoad();
           });
  }

  render() {
    return (
       <div>

         <form onSubmit={this.addNewData} action="#" id="editFormData" method="POST" style={{display:this.state.newTable}}>
           <div class="row align-items-center shadow-sm bg-body rounded paddingBottomTopForm">
            <div class="blockFields row">
             {this.state.columns.map((row,x)=>
              <>
              {!row.Extra.includes("auto_increment") || this.state.typeBtn=="edit" ? <>
                    {row.Type.includes("text") || row.Type.includes("json")?
                      <div class="col-md-12">
                        <small><b>{row.Field.toUpperCase()}</b> <small><i>{row.Type}</i></small></small> <br/>
                        <textarea type="text" name={row.Field} class="form-control" required={row["Null"]=="NO"}></textarea>
                      </div>
                      :
                      <div class="col-md-3">
                        <small><b>{row.Field.toUpperCase()}</b> <small><i>{row.Type}</i></small></small> <br/>
                        <input type="text" name={row.Field} class="form-control" required={row["Null"]=="NO"} />
                      </div>
                    }
                </>:<></>}
               </>
              )}

           </div>

              <div class="height5px"></div>
              <div class="col-md-12">
                <p class="text_align_center">
                  <a href="#" class="btn btn-secondary btn_small" onClick={this.newTableBtn}> Cancel </a> &nbsp;&nbsp;
                  <button class="btn btn-primary btn_small" type="submit" > {this.state.typeBtn=="add"?"Add New":"Update"} </button>
                </p>
             </div>

           </div>
         </form>
                <div style={{display:this.state.makeSql}}>
                  <div class="height5px"></div>
                  <div class="col-md-12">
                     <textarea type="text" name="sql" id="sqlTextare" class="form-control" placeHolder="SELECT * FROM database.table WHERE sum > 10000000$" required={true}></textarea>
                   </div>
                    <div class="height5px"></div>
                   <div class="col-md-12">
                     <p class="text_align_center">
                       <button class="btn btn-primary btn_small"  onClick={this.runSql}> Run </button>
                     </p>
                  </div>
                </div>

         <div class="height5px"></div>
             <a href={window.BASE_URL+"#/database-mysql/"+this.props.match.params.dbname} title={this.props.match.params.dbname} >
               <i class="bi bi-arrow-90deg-left"></i> &nbsp;
                {this.props.match.params.dbname}.{this.props.match.params.tbname}
             </a>&nbsp;&nbsp;
             <a href="#" onClick={this.removeDataBulk}><i class="bi bi-trash"></i> Delete Selected</a> &nbsp;&nbsp;
             <a href="#" onClick={this.newTableBtn}><i class="bi bi-plus-square"></i> Add New Row</a> &nbsp;&nbsp;
             <a href="#" onClick={this.showSql}><i class="bi bi-plus-square"></i> Run Sql</a>


         <div class="clear"></div>
         <div class="row">
         <div class="col-md-12 resizableDiv">
          <table class="table table-hover resizableTable">
            <thead>
              <tr>
              {this.state.queryView ? <>
                  {Object.keys(this.state.rows.length > 0? this.state.rows[0] :{}).map(key =>
                     <th scope="col">{key}</th>
                  )}
              </>:<>
                <th scope="col" style={{width:"25px"}}><SetBulk cssClass="checkboxBulk"/></th>
                <th scope="col">Action</th>

                {this.state.columns.map(key =>
                   <th scope="col">{key.Field}</th>
                 )}
               </>}
              </tr>
            </thead>
            <tbody>
            {this.state.rows.map((row,x)=>
              <tr>
               {this.state.queryView ? <>
                  {Object.keys(row).map(key =>
                      <td> {row[key].length>100 ? <div class="resizeData">{row[key]}</div>:
                               <>{row[key]}</>}  </td>
                   )}
               </>:<>
                 <td> <input class="checkboxBulk" type="checkbox" value={x}/></td>
                 <td>
                   <a href="#" onClick={e=>this.editBtn(e, x )} title="Edit">
                       <i class="bi bi-pencil-square"></i>
                   </a>&nbsp;

                   <a href="#" onClick={e=>this.duplicate(e, x )} title="Duplicate">
                      <i class="bi bi-files"></i>
                   </a>&nbsp;

                   <a href="#" onClick={e=>this.removeData(e, x )} title="Remove">
                      <i class="bi bi-trash3"></i>
                   </a>
                </td>

                 {this.state.columns.map(key =>
                     <td> {row[key.Field].length>100 ? <div class="resizeData">{row[key.Field]}</div>:
                                                                                <>{row[key.Field]}</>}  </td>
                  )}
                 </>}
              </tr>
             )}
            </tbody>
          </table>
           <div class="clear"></div>
           {this.state.queryView ? <></>:
          <Pagination  className="pagination-bar"
                                    currentPage={this.state.currentPage}
                                    totalCount={this.state.totalCount}
                                    pageSize={this.state.pageSize}
                                    onPageChange={page => this.setCurrentPage(page)}
                                 />
          }
         </div>
        </div>
       </div>
    );
  }
}

export default DatabaseTablesData;