import React from 'react'

class Footer extends React.Component {

 constructor(props) {
       super(props);
  }

 componentDidMount(){
 }

 closeAlert=(e)=>{
    e.preventDefault();
     try{
       document.getElementsByTagName('body')[0].style.overflowY = "visible"  ;
       document.getElementById("mini-modal-alert").style.display = "none";
       document.getElementById("load_content_mini").innerHTML = "";

     }catch(err){}
 }

  render() {
    return (
       <footer class="footer mt-auto py-3 bg-light">
         <div class="container">
           <span class="text-muted">Place sticky footer content here.</span>
         </div>

          <div class="reveal-modal-bg modal-window" id="mini-modal-alert" >
            <div class="reveal-modal"  >
                <div class="modal-body modal-body-sub" style={{position: "relative"}}>
                  <button type="button" class="close_alert close_modalinner" onClick={this.closeAlert} data-modal="#mini-modal" aria-hidden="true"> &times;</button>
                   <div id="load_content_mini"> </div>
                </div>
             </div>
          </div>
          <a href="#" id="closeAlert"> </a>
       </footer>
    );
  }
}

export default Footer;