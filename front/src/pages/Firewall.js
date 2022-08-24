import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import { headers, hideLoad, showLoad, showAlert } from './../Helpers.js';
import axios from 'axios';
import serialize from 'form-serialize';


class Firewall extends React.Component {
 sessionStorageName = 'list-of-firewall-rules';
 constructor(props) {
       super(props);
       this.state = {rows : [] }
 }

 componentDidMount(){
     try{
       let data = sessionStorage.getItem(this.sessionStorageName);
       if(data!=null && data !="")
       this.setState({rows: JSON.parse(data) });
     }catch(err){}
  }

// getListOfUser
 getData =(e)=>{
     e.preventDefault();
     showLoad();
     axios.get(window.API_URL+'get-list-of-firewall-rules',  headers() )
                .then(res => {
                     this.setState({rows: res.data });
                     sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
                     hideLoad();
                  }).catch(error => {
                     alert(error);
                     hideLoad();
                 });
  }


  // add new one
  addNewOne =(e)=>{
     e.preventDefault();
     const form = e.currentTarget
     const body = serialize(form, {hash: true, empty: true})

     showLoad();
     axios.put(window.API_URL+'add-new-firewall-rule?name='+body.name,{}, headers()).
           then(res => {
               this.setState({rows: res.data });
               sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
               hideLoad();
               alert("Added!");
           }). catch(error => {
               alert(error);
               hideLoad();
           });
   }

//remove user
 removeOne = (e,  name="")=>{
   e.preventDefault();
   if(!window.confirm("Are you sure you want to remove the "+name+" ?"))
   return null;

    showLoad();
    axios.delete(window.API_URL+'remove-firewall-rule?name='+name,  headers() )
         .then(res => {
              hideLoad();
              this.setState({rows: res.data });
              sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));

              alert("Removed!");
          }).catch(error => {
              alert(error);
              hideLoad();
          });
 }

 actionBtn =(e, action="")=>{
  e.preventDefault();
  showLoad();
  axios.get(window.API_URL+'enable-disable-firewall?actionBtn='+action,  headers() )
             .then(res => {
                   hideLoad();
                   this.setState({rows: res.data });
                   sessionStorage.setItem(this.sessionStorageName, JSON.stringify(res.data));
               }).catch(error => {
                  alert(error);
                  hideLoad();
              });
 }

  render() {
    return (
       <>

         <form onSubmit={this.addNewOne} action="#" method="POST">
            <div class="row shadow-sm bg-body rounded paddingBottomTopForm">
                 <div class="col-md-4">
                   <input type="text" name="name" class="form-control" required={true} placeHolder="443/tcp"/>
                 </div>

                 <div class="col-md-2">
                   <button class="btn btn-primary btn_small" type ="submit" >Add New Rule</button>
                 </div>

           </div>
         </form>
           <div class="height20px"></div>

           <div class="row shadow-sm bg-body rounded paddingBottomTopForm">
             <div class="col-md-3">
               <a href="#" class="btn btn btn-success btn_small" onClick={this.getData}>
                <i class="bi bi-arrow-clockwise"></i> Show rules
               </a>
             </div>
             <div class="col-md-9 text_align_right">
               <a href="#" class="btn btn-info btn_small" onClick={e=>this.actionBtn(e,"enable")}>Enable Firewall</a> &nbsp;&nbsp;
               <a href="#" class="btn btn-secondary btn_small" onClick={e=>this.actionBtn(e,"disable")}>Disable Firewall</a>
             </div>
           </div>

           <div class="clear"></div>
       <div class="row">
         <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col" class="text_align_center"></th>
                <th scope="col" class="text_align_center">Remove</th>
             </tr>
            </thead>
            <tbody>
            {this.state.rows.map(row=>
             <tr>
                 <td> {row.name} </td>
                 <td> {row.type} </td>
                  <td class="text_align_center">
                    <a href="#" onClick={e=>this.removeOne(e, row.name)}>
                       <i class="bi bi-x-circle-fill"></i>
                    </a>
                  </td>
               </tr>
             )}
            </tbody>
          </table>
            <div class="col-md-12">
                <p class="text_align_center">
                   <a href="#" class="btn btn btn-success btn_small" onClick={this.getData}>
                      <i class="bi bi-arrow-clockwise"></i> Show rules
                   </a>
                </p>
            </div>
         </div>

      </>
    );
  }
}

export default Firewall;