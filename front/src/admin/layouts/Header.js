import React, { Component } from 'react';
import { ConfigVarContext } from './../../context/ConfigVarContext';

/**
   in this component we show the top menu
   controller: VariablesController
**/
class Header extends Component {

  static contextType = ConfigVarContext;

  constructor(props) {
       super(props)
       this.state = {menu : {}, submenu:{} , hash:""}

  }

  async componentDidMount(){
    document.title = "JcomCMS";

    this.setState({isLoading: true });
    const response = await fetch(window.API_URL+'cp/variables');
    const data = await response.json();
    this.setState({menu: data.adminMenu, isLoading: false});
    this.getSubmenu("");
  }

  getSubmenu =(keyGet)=>{
      if(keyGet != ""){
        this.setState({submenu: this.state.menu[keyGet] });
      }else{
         var hash = window.location.hash;
         var array={};
         for(var key in this.state.menu){
            for(var key2 in this.state.menu[key]){
               if( hash.includes(key2)&& key2 !="#" )
                   array = this.state.menu[key];
            }
         }

        this.setState({submenu: hash=="#/"  ?
                       this.state.menu[Object.keys(this.state.menu)[0]] : array  });
      }
 }


 render() {
   return (
        <div>
         <nav class="navbar navbar-default navbar-fixed">
            <div class="container-fluid">
                 <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand logo_admin" href="/">&nbsp;</a>
                 </div>

                <div class="collapse navbar-collapse">
                      <ul class="nav navbar-nav navbar-right admin_menu">
                         { Object.keys(this.state.menu).map(key =>
                           <li class="dropdown">
                             <a href={window.BASE_URL+Object.keys(this.state.menu[key])[0]} onClick={e=>this.getSubmenu(key)} class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                  {this.state.menu[key][Object.keys(this.state.menu[key])[0]]}
                                  <span class="caret"></span>
                             </a>
                             { Object.keys(this.state.menu[key]).length > 1 ? (
                                 <ul class="dropdown-menu admin-drop-menu">
                                    { Object.keys(this.state.menu[key]).map(key2 =>
                                       <li style={{display: this.state.menu[key][key2]=="hidden" ? "none":""}}>
                                         <a href={window.ADMIN_BASE_URL+key2} onClick={e=>this.getSubmenu(key)}>{this.state.menu[key][key2]}</a>
                                       </li>
                                    )}
                                 </ul>
                               ):(<></>)  }

                           </li>
                          )}
                      </ul>
               </div>
            </div>
            <div class="clearfix"></div>
        </nav>
            <div class="clearfix"><br/></div>
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-12">
                   <nav class="nav-tab-wrapper woo-nav-tab-wrapper">
                          <ul>
                            { Object.keys(this.state.submenu).map(key =>
                               <li style={{display: this.state.submenu[key]=="hidden" ? "none":""}}>
                                 <a href={window.ADMIN_BASE_URL+key} >{this.state.submenu[key]}</a>
                               </li>
                            )}
                          </ul>
                        <div class="clear"></div>
                    </nav>
                </div>
              </div>

          </div>

     </div>
   );
 }

}

export default Header;