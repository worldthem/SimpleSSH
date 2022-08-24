import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, fromJson,
        toJsonObj, random, randId, reactSetVal, setValueByClass } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';

class ContactformEdit extends HelpersClass {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'en',
      row:{},
      fields: {},
      data:{}
    };
  }

  componentDidMount() {
    this.showLoad();
    this.setState({ lang: this.getLang() });
     axios.get(window.API_URL+'cp/get-one-line-settings-by-id?id='+this.props.match.params.id,this.headers())
         .then(res => {
            var json = fromJson(res.data.value1);
            this.setState({row: res.data,
                           fields: json.fields || {},
                           data: json,
                         });

            this.hideLoad();
         }).catch(error => {
            alert(error);
            this.hideLoad();
         });

  }

  addNewField = (e) => {
    e.preventDefault();
    var fields = this.state.fields;
    fields[random(10)] = {
      name: randId(),
      label: '',
      placeholder: '',
      type: 'text',
    }
    this.setState({ fields: fields });
  };

  removeField = (e, key) => {
    e.preventDefault();
    var fields = this.state.fields;
    delete fields[key];
    this.setState({ fields: fields });
  }

  onSet =(e, formid, name)=>{
    var fields = this.state.fields;

     if(e.target.type=="checkbox"){
       if(e.target.checked){
         fields[formid][name] = "yes";
       }else{
         delete fields[formid][name] ;
       }

      }else if(e.target.type != "checkbox"){
        fields[formid][name] = e.target.value;
      }
     this.setState({ fields: fields });
  }

 formUpdate =(e)=>{
   e.preventDefault()
   const form = e.currentTarget
   const body = serialize(form, {hash: true, empty: false})


    var val1 = body['main'] || {};
    val1['fields'] = body['fields'];
    body['value1'] = JSON.stringify(val1);

  // Request made to the backend api
  // Send formData object
  this.showLoad();
  axios.put(window.API_URL+'cp/insert-update-settings',
              body,
              this.headers()).
        then(res => {
             this.success(res.data);
             if(res.data=="ok"){

             setTimeout(function () {
                 window.location.reload();
              }, 200)

             }
        }). catch(error => {
          alert(error);
          this.hideLoad();
        });

  }


  formField = (formid) => {
    return (
      <ul>
      	<li>
      	 <label> {this.l('Caption')}:
      			<br />
          <input class="form-control" type="text" onChange={e=>this.onSet(e,formid,"label")}
                 name={ 'fields[' + formid + '][label]'} value={this.state.fields[formid]["label"]} />
         </label>
      	</li>
      	<li>
      	 <label> {this.l('Placeholder')}: <br />
          <input class="form-control" placeholder="Placeholder"
                 type="text" name={ 'fields[' + formid + '][placeholder]'}
                 value={this.state.fields[formid]["placeholder"]}
                 onChange={e=>this.onSet(e,formid,"placeholder")} />
      	 </label>
      	</li>
      	<li>
      	  <label> {this.l('Type')}: <br />
            <select class="form-control"
                    onChange={e=>this.onSet(e,formid,"type")}
                    value={this.state.fields[formid]["type"]}
                    name={ 'fields[' + formid + '][type]'}>
                <option value="text">{this.l('Text box')}</option>
                <option value="email"> {this.l('E-mail text box')}</option>
                <option value="textarea"> {this.l('Message text box')}</option>
            </select>
      	  </label>
      	</li>
      	<li class="checkboxLi">
      		<label> <br />
      			<input type="checkbox" class="form-control"
      			       onChange={e=>this.onSet(e,formid,"required")}
      			       name={ 'fields[' + formid + '][required]'} value="yes"
      			       checked={this.state.fields[formid]["required"]}/>
      			       {this.l('Required')}
      	    </label>
      	</li>
      	<li>
      		<br />
            <a href="#" class="fa_delete delete_field" onClick={(e)=> this.removeField(e, formid)} ></a>
        </li>
      </ul>
    );
  };

  render() {
    return (
        <div class="card">
             <div class="header headerBg">
                <div class="title">
                   { this.l('Edit')} : { this.state.row.value}
                </div>
            </div>

      		<div class="content table-responsive table-full-width">
      			<form action="#" method="post" onSubmit={e=>this.formUpdate(e)}>
      				<input type="hidden" name="id" value={ this.state.row.id} />
      				<input type="hidden" name="value" value={ this.state.row.value} />
      				<input type="hidden" name="param" value={ this.state.row.param} />
      				<div class="col-md-4">
      					<label>{this.l('Add this code in to your page')}</label>
      					<br />
      					<input class="form-control" type="text" value={"[form id="+this.state.row.id+"]"} /> </div>
      				<div class="height20px"></div>
      				<div class="col-md-4">
      					<label>{this.l('Emil Title')}</label>
      					<br />
      					<input class="form-control" type="text" defaultValue={this.state.data.subject} name="main[subject]" /> </div>
      				<div class="height20px"></div>
      				<div class="col-md-4">
      					<label>{this.l('Email To')}</label>
      					<br />
      					<input class={ 'form-control field_to'} type="text" name="main[to]" defaultValue={this.state.data.to} /> </div>

      				<div class="height20px"></div>
      				<div class="fields_list">
      				    {Object.entries(this.state.fields || {}).map(([key, value]) => (
      					  <> {this.formField(key)} </>
      					))}
      			    </div>

                     <div class="col-md-12">
                       <a href="#" class="newField btn btn_small" onClick={this.addNewField}>
                          <i class="fa fa-plus"></i> {this.l('Add new Field')}
                       </a>
                     </div>

      				<div class="height20px"></div>
      				<div class="col-md-4">
      					<label>{this.l('Submit Button')}</label>
      					<br />
      					<input class={ 'form-control field_submit'} type="text" name="main[submit]" defaultValue={this.state.data.submit} /> </div>
      				<div class="col-md-8">
      					<label> {this.l('Successfull mesage')}{' '} {this.l('Example: Your message has been sent successfully!')} </label>
      					<br />
      					<input class={ 'form-control field_message'} type="text" name="main[message]" defaultValue={this.state.data.message} /> </div>
      				<div class="height20px"></div>
      				<div class="col-md-12">
      					<input type="submit" value={this.l( 'Save')} class="btn btn_small" /> </div>
      			</form>
      		</div>
      	</div>
   );
  }
}

export default ContactformEdit;