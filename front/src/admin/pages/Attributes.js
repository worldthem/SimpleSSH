import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, showEditFields,
        serialiseByDiv, serializeDiv, showModal} from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';
import AttrSuggestion from '../layouts/AttrSuggestion';
import Modal from '../layouts/Modal';

/**
  Controller: controllers.cp.AttributesController.java
*/
class Attributes extends HelpersClass {
  constructor(props) {
    super(props);
     this.initState({ rows : {},
                      title: "Attributes",
                      typeStyle: "none",
                      type:"",
                      suggestions:null,
                      suggestionKey :"",
                      modalId:"suggestionWindow",
                     });
  }

   componentDidMount(){
      this.getData(this.props.match.params.type);
      this.setState({typeStyle: this.props.match.params.type == "var" ? "none":"", type: this.props.match.params.type});
   }

   componentWillReceiveProps(nextProps) {
     if(nextProps.match.params.type != ""){
        this.getData(nextProps.match.params.type);
        this.setState({typeStyle: nextProps.match.params.type=="var"? "none":"", type: nextProps.match.params.type});
     }
   }


   getData=(type)=>{
     this.showLoad();
     axios.get(window.API_URL+'cp/get-attributes/'+type,this.headers() )
          .then(res => {
             this.setState({rows: res.data});
             //alert(JSON.stringify(res.data))
             this.hideLoad();
           }).catch(error => {
              this.hideLoad();
           });

   }


  insertNew=(e)=>{
   e.preventDefault()
   const form = e.currentTarget;
   const body = serialize(form, {hash: true, empty: false});
   var rows = this.state.rows;
   rows[random(10)] = body;
   this.updateData(rows);
  }

  formSave=(e )=>{
     e.preventDefault()
     const form = e.currentTarget
     const body = serialize(form, {hash: true, empty: false})
     this.updateData(body);
  }

   removeField = (e, key) => {
      e.preventDefault();

       if(!window.confirm("Are you sure, you want to delete it?"))
                  return null

      var rows = this.state.rows;
      delete rows[key];
      this.setState({ rows: rows });

       this.updateData(rows);
   }

  updateData=(rows)=>{
        this.showLoad();

       axios.put(window.API_URL+'cp/update-attributes' ,rows , this.headers() )
             .then(res => {
                if(res.data != "ok")
                   alert(res.data)
                  else
                   window.location.reload();

                  this.hideLoad();
             }).catch(error => {
                 this.hideLoad();
              });
  }


  suggestions =(e, key)=>{
      e.preventDefault();
      this.setState({suggestions:[<AttrSuggestion param={key}/>]});

      showModal(this.state.modalId);

  }

  render() {
    return (
        <div class="card">
      		<div class="header">
      			<h4 class="title"> {this.l('Example: Color, Size') + ', ...'} </h4> </div>
      		<div class="add_new_top">
      			<form action="#" method="POST" onSubmit={ this.insertNew}>
                    <input type="hidden" name="type" value={this.state.type == "var" ? "variations":"specifications"} />

      					 {this.state.allLanguages.map(language=>
                             <div class="col-md-2">
                               <p>
                                <label>{this.l('Title')}({language}) </label><br/>
                                <input type="text" class="form-control" required="" name={'name['+language+']'} />
                               </p>
                             </div>
                         )}


      				<div class="col-md-3" style={{display:this.state.typeStyle}}>
      					<p>
      						<label>{this.l('Box type')} </label>
      						<br />
      						<select name="box" class="form-control">
      							<option value="textbox">{this.l('Textbox')}</option>
      							<option value="select">{this.l('Select')}</option>
      							<option value="checkbox">{this.l('Checkbox')}</option>
      						</select>
      					</p>
      				</div>
      				<div class="col-md-2">
      					<label>
      						<br /> </label>
      					<br />
      					<input type="submit" class="btn btn_small" value={this.l( 'Add new one')} /> </div>
      			</form>
      			<div class="clear"></div>
      		</div>
      		<div class="clear"></div>
      		<div class="content table-responsive table-full-width">
      			<form action="#" method="POST" onSubmit={ this.formSave}>
      				 <table class="table table-hover table-striped">
      					<thead>
      						<th style={{ width: '100px' }}>ID</th>
      						<th>{this.l('Title')} </th>
      						<th style={{display:this.state.typeStyle}}> {this.l('Type')}</th>
      						<th>{this.l('ShortCode')} </th>
      						<th style={{ width: '110px' }}>{this.l('Sugestion')} </th>
      						 <th style={{ width: '110px' }}></th>
      						 <th style={{ width: '45px' }}></th>
      						<th style={{ width: '45px' }}></th>
      					</thead>
      					<tbody>
      					   {Object.entries(this.state.rows).map(([key, row])=>(

                              <tr class={"cl_"+key} style={{display:row.type.includes(this.state.type) ? "":"none"}}>
      							<td>
                                   <input type="hidden" name={ key+"[type]"} value={row.type} />
      			                   <span>{key} </span>
      						   </td>
      							<td>
      								<div class="edit_text">{ this.lang(row.name) }</div>

      								<div class="hide_edit blockMultilang">
      								    {this.state.allLanguages.map(language=>
                                          <>
                                            <span class="inputLang">{language}</span>
                                            <input type="text" class="form-control" required="" defaultValue={row.name!=null? row.name[language] :""} name={ key+'[name]['+language+']'} />
                                          </>
                                        )}
      							    </div>
      							   </td>
      							<td style={{display:this.state.typeStyle}}>
      							   <div class="edit_text">{row.box}</div>
      							   <div class="hide_edit">
      								<select name={key+"[box]"} class="form-control">
      									<option value="textbox">{this.l('Textbox')}</option>
      									<option value="select">{this.l('Select')}</option>
      									<option value="checkbox">{this.l('Checkbox')}</option>
      								</select>
      							   </div>
      							</td>
      							<td>[attributes id={key}] </td>

      							<td>
      							    <a href="#" onClick={e=>this.suggestions(e,key)} class="btn btn_small">
                                      {this.l('Add Suggestion')}
                                    </a>
                                </td>
      							<td>
      							   <div class="hide_edit">
      								 <input type="submit" class="btn btn_small" value={this.l( 'Save')}   />
      							   </div>
      					        </td>
      					         <td>
                                    <a href="#" class="fa_edit" onClick= {e=>showEditFields(e, "cl_"+key)}> </a>
                                 </td>
      							<td>
      								<a href="#" title="{this.l('Delete')}" onClick={e=>this.removeField(e,key)} class="fa_delete"> </a>
      							</td>
      						  </tr>

      						))}
      					</tbody>
      				</table>
      			</form>
      		</div>
      		 <div class="clear"></div>
             <Modal idModal ={this.state.modalId} html ={this.state.suggestions} />
        </div>



    );
  }
}

export default Attributes;