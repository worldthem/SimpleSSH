import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import { toJsonObj, random, randId, convertToCss, headers } from './../../../Helpers.js';


class LeftReadyBlocks extends React.Component{

constructor(props) {
    super(props);
    this.state =  {
           rows:{},
        };
   }

componentDidMount(){
    axios.get(window.API_URL+'cp/pages-get-ready-blocks', headers())
         .then(res => {
            this.setState({ rows: res.data });
          }).catch(error => {
            alert(error);
         });

 }

 checkForNewBlocks =(e)=>{
     e.preventDefault();
     axios.get(window.API_URL+'cp/pages-update-ready-blocks', headers())
          .then(res => {
             this.setState({ rows: res.data });
          }).catch(error => {
             alert(error);
          });
  }


/*

"afterbegin" - After the beginning of the element (as the first child)
"afterend" - After the element
"beforebegin" - Before the element
"beforeend" - Before the end of the element (as the last child)
*/
addBlock=(e)=>{
  e.preventDefault();
  var val = document.getElementById("bootstrapBlocksSelect").value;

    var isFull = val != "dropable sections"? false : true;
    var classInside =  val != "dropable sections" ?  ' inside_grid':'';
    var insideContent =  val != "dropable sections" ? this.return_text(''): this.return_text('option');
    var div = '<div class="'+val+classInside+'" id="'+randId()+'">'+insideContent+'</div>' ;

    var fullBlock = '<div class="dropable sections" id="'+randId()+'">'+
                                 this.return_text('option')+
                      '<div class="'+(isFull?"col-md-12":val)+' inside_grid" id="'+randId()+'">'+this.return_text('')+'</div>'+
                    '</div>' ;

    var container = document.getElementById('page_contents');
    var dropable = container.getElementsByClassName("dropable");


     if(val != "dropable sections" && dropable.length>0){
          var selectedBlock = container.getElementsByClassName("selectedBlock");
        if(selectedBlock.length>0){
            selectedBlock[0].insertAdjacentHTML('afterbegin', div);
         }else{
            dropable[dropable.length-1].insertAdjacentHTML('afterbegin', div);
        }

     }else{
       container.insertAdjacentHTML('beforeend', fullBlock);
     }


     try{
       var elements = container.getElementsByClassName("dropable");
       for(var i = 0; i < elements.length; i++){
            window.Sortable.create(elements[i], {
                                        handle: '.sort_icon',
                                        animation: 250
                                 });
       }
     }catch(err){}

}


  // this is the settings menu itself
 return_text =(types='')=>{
        return '<div class="edit_text_this'+(types ==''? ' editBlockHover':'')+'">'+
                   '<a href="#" class="iconAction '+(types ==''? 'sort_icon':'parrentdropable')+' fa_move fa_small editable" onclick="return false;"></a>'+
                   '<a href="#" class="iconAction edit_texticon fa_edit fa_small editable editRow" data-toggle="modal" data-target="#editContainer" data-typeBlock="'+(types ==''? 'child':'main')+'"></a>'+
                   '<a href="#" class="iconAction dublicate fa_dublicate fa_small editable duplicateRow" ></a>'+
                   '<a href="#" class="iconAction delet_text fa_delete fa_small editable deleteRow" ></a>'+
               '</div>';
    }

render(){
    return(
      <>
          <div class="page_builder_makets">
             <div class="options_page_builder">
               <i class="fa fa-sliders-h" aria-hidden="true"></i>
            </div>

             <div class="inside_builder" id="readyBlocksList">
                <p>
                  <label>Add Block</label> <br />
                    <select class="bootstrapBlocks" id="bootstrapBlocksSelect" style={{width:"180px"}}>
                       <option value="dropable sections">Full size block</option>
                       <option value="clear">Clear block</option>
                         {[...Array(12)].map((x,i) =>
                          <option value={"col-md-"+(++i)}>Size:{(8.333333333333333 * i).toFixed(0)}%</option>
                          )}
                    </select>
                   <a href="#" class="add_grid btn btn_small" onClick={this.addBlock}><i class="fa fa-plus-circle"></i></a>
                   <div class="clear"></div>
                    <div class="blockListPage" id="readyBlocksList">

                     {Object.entries(this.state.rows).map(([key, value], i) => (
                          <>
                            <a href="#" class="block_list" data-key={key}>
                               <img src={value[0]} data-key={key}/>
                               <span data-key={key}>{value[1]}</span>
                            </a>

                            <textarea class={key} style={{display:"none"}}>{value[2]}</textarea>
                            <textarea class={"style"+key} style={{display:"none"}}>{value[3]}</textarea>
                          </>
                      ))}

                    </div>
                   <a class="lodaMore_template btn" href="#" onClick={this.checkForNewBlocks}>Check for More</a>
                </p>
             </div>
          </div>

      </>
    )}
}

export default LeftReadyBlocks;
