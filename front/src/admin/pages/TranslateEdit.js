import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput,
        toJsonObj, random,reactSetVal, setValueByClass } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';

class TranslateEdit extends HelpersClass{
  constructor(props) {
    super(props);
    this.state = {
      lang: 'en',
      rows: [],
      fields: {},
      langtranslate: 'it',
      english: ['edit', 'cart', 'checkout'],
      translate: { edit: 'edit', cart: 'cart', checkout: 'checkout' },
    };
  }
  componentDidMount() {
    //this.setState({ fields: this.state.rows });
    //console.log('json is:', this.state.fields);
  }

  render() {
    return (
      <div class="col-md-12">
      	<div class="card">
      		<div class="header">
      			<h4 class="title">{this.l('Language')} </h4> </div>
      		<div class="content table-responsive table-full-width">
      			<form action="#" method="post">
      				<div class="rightSideSave">
      					<button type="submit" class="buttonSave"> <i class="fa fa-cloud-upload"></i> {this.l('Save')} </button>
      				</div>
      				<table class="table table-hover table-striped">
      					<thead>
      						<th style={{ width: '33%' }}> {this.l('In English')}</th>
      						<th> <a href="#" class="shareTranslate lang1Share">
                            Share This Translate
                          </a>
      							<br /> {this.l('In') + ' ' + this.state.langtranslate}
      							<a href="#" class="btn btn_small"> <i class="fa fa-plus" aria-hidden="true"></i> </a>
      						</th>
      					</thead>
      					<tbody> {this.state.english.map((language) => (
      						<tr>
      							<td>{language}</td>
      							<td>
      								<input type="text" class="form-control" name={ 'translate[' + language + ']'} /> </td>
      						</tr> ))} </tbody>
      				</table>
      			</form>
      		</div>
      	</div>
      </div>
    );
  }
}

export default TranslateEdit;