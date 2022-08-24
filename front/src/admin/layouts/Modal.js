import React from 'react'


class Modal extends React.Component {
   constructor(props) {
    super(props);
     this.state= {idModal :"", html: "", p:"" }
  }

componentDidMount() {
   this.setState({ idModal: this.props.idModal,
                   html: this.props.html,
                   p: this.props.p
                 })

}

 componentWillReceiveProps(nextProps) {

   if(nextProps.html != null){

       this.setState({ html: nextProps.html })
     }
   }

hidePopup =()=>{
 document.getElementById(this.state.idModal).style.display="none";
   var body = document.body;
   body.classList.remove("modal-open");
}

//showModal =


 showModals =(e)=>{
    e.preventDefault();
    var modal = document.getElementById(this.state.idModal);
        modal.style.display = "block";
 }

 render() {
    return (
       <div class="modal fade in" tabindex="-1" role="dialog" id={this.state.idModal} >
            <div class="modal-dialog modalWindow modal-lg-editor" role="document">
             <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" onClick={this.hidePopup} data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                     <h4 class="modal-title modal_load_title"> </h4>
                   </div>
                   <div class="modal_load_content" id="modalContentData">
                     {this.state.html}
                   </div>
                  <div class="clear"></div>
               </div>
            </div>
         </div>
    );
  }
}

export default Modal;