import React, { useState } from 'react';

class User extends React.Component{

   constructor(props) {
     super(props);
     this.state={
          firstName:"",
          lastName:"",
          dob:"",
          address:"",
          city:"",
          county:"",
        }
   }

 onChangeInput=(e,name)=>{
  this.setState({[name]:e.target.value});
 }

 render(){
      return(
          <div>
              <input type="text" onChange={e=>this.onChangeInput(e,"firstName")} value={this.state.firstName}/>
              <input type="text" onChange={e=>this.onChangeInput(e,"lastName")} value={this.state.lastName}/>
              <input type="text" onChange={e=>this.onChangeInput(e,"dob")} value={this.state.dob}/>
              <input type="text" onChange={e=>this.onChangeInput(e,"address")} value={this.state.address}/>
              <input type="text" onChange={e=>this.onChangeInput(e,"city")} value={this.state.city}/>
              <input type="text" onChange={e=>this.onChangeInput(e,"county")} value={this.state.county}/>
          </div>
      )}
}
export default User;