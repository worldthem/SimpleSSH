import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput, toJsonObj, random, showEditFields,
        serialiseByDiv, serializeDiv} from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';

/**
Controller: controllers.cp.AttributesController.java
*/
class AttrSuggestion extends HelpersClass {
  constructor(props) {
    super(props);
     this.initState({ rows : {},
                      title: "Attributes",
                      lang:"en",
                      typeStyle: "none",
                      type:"",
                      param:"",
                     });
  }

   componentDidMount(){
     if(this.props.param != "" && typeof this.props.param != "undefined")
            this.getData(this.props.param);
   }

   componentWillReceiveProps(nextProps) {

     if(nextProps.param != ""){
       this.getData(nextProps.param);
     }
   }

   //get suggestions
   getData=(param)=>{
     this.showLoad();
     this.setState({rows: {} });
     axios.get(window.API_URL+'cp/get-attributes-suggestion/'+param,this.headers() )
          .then(res => { //alert(JSON.stringify(res.data))
             this.setState({rows: res.data, param:param});

             this.hideLoad();
           }).catch(error => {

              this.hideLoad();
           });
  }

   // add new data
  insertNew=(e)=>{
   e.preventDefault()
   const form = e.currentTarget;
   const body = serialize(form, {hash: true, empty: false});
   var rows = this.state.rows;

   var maxLength = 0;
   var all = {};
   for(const index in this.state.allLanguages){
    if(typeof body.title != "undefined"){
      var lang = this.state.allLanguages[index];
      var text = body.title[lang];
      var split = text.split(/\r|\n/);
       all[lang] = split;
       maxLength = maxLength < split.length ?  split.length : maxLength;
     }
   }

      var is =false;
      for(var i=0; i< maxLength; i++){
        var key = random(5);
        rows[key] = {};
        for(const index in this.state.allLanguages){
          var lang = this.state.allLanguages[index];
          rows[key][lang] = typeof all[lang][i] !="undefined" ? all[lang][i] : "";
          is = true;
        }
       }

    if(is)
      this.updateData(rows);


    form.reset();

  }

  // when press update will execute this one
  formSave=(e )=>{
     e.preventDefault()
     const form = e.currentTarget
     const body = serialize(form, {hash: true, empty: false})
     this.updateData(body);
  }

  // when press delete will execute this one
   removeField = (e, key) => {
      e.preventDefault();

       if(!window.confirm("Are you sure, you want to delete it?"))
                  return null

      var rows = this.state.rows;
      delete rows[key];
      this.setState({ rows: rows });

       this.updateData(rows);
   }

  // remove all selected items
   actionBulk =(e)=>{
       e.preventDefault();
        if(document.getElementById("actionType").value==""){
           document.getElementById("actionType").focus();
           return null;
        }

        if(!window.confirm("Are you sure, you want to delete it?"))
             return null


        var is =false;
        var elementsBulk = document.getElementsByClassName("checkboxBulk");
        var ids=[];
        var rows = this.state.rows;
        for(var i=0; i<elementsBulk.length; i++){
          if(elementsBulk[i].checked){
             is= true;
             delete rows[elementsBulk[i].value];
            }
        }

        if(!is)
         return null;

        this.updateData(rows);

    }

   // push the new data to db
  updateData=(rows)=>{
        this.showLoad();
        this.setState({rows: {} });
       axios.put(window.API_URL+'cp/update-attributes-suggestion/'+this.state.param ,rows , this.headers() )
             .then(res => {
                if(res.data != "ok")
                   alert(res.data);

                this.setState({rows: rows});
                this.hideLoad();
             }).catch(error => {
                 this.hideLoad();
              });
  }




 render() {
    return (
       <div>
       <form action="#" id="add_sugestion_new" method="post" onSubmit={this.insertNew}>
           <div class="add_new_top">
           <label>{this.l("Add sugestion")} ({this.l("One per line")})</label><br />
           <table class="table" style={{marginBottom:"0px"}}>
                <tr>
                    {this.state.allLanguages.map(language=>
                       <td>
                         <img src={window.API_ASSETS+"assets/langicon/"+language+".png"} /> {language}
                         <textarea class="form-control"  name={'title['+language+']'} required={true} placeholder={this.l('One per line')}></textarea><br />
                      </td>
                   )}
               </tr>
           </table>
            <input type="submit" class="btn btn_small" value={this.l('Add new one')}/>
          </div>
       </form>

                <div class="col-md-6" >
                  <select name="action" class="form-control" id = "actionType">
                   <option value="">{this.l('Action')}</option>
                   <option value="del">{this.l('Remove')} </option>
                  </select>
                </div>

                <div class="col-md-6">
                  <button type="submit" class="btn btn_small" onClick={this.actionBulk}>{this.l('Apply')}</button>
                </div>
       <form action="#" method="post" onSubmit={ this.formSave}>


              <table class="table table-hover table-striped">
                <thead>
                  <tr>
                    <th style={{width:"40px"}}><SetBulk cssClass="checkboxBulk"/></th>
                    <th style={{width:"40px"}}>{this.l("Key")}</th>

                    {this.state.allLanguages.map(language=>
                       <th>{this.l('Title')}({language})</th>
                    )}
                    <th> </th>
                    <th> </th>
                    <th style={{width:"30px"}}> </th>
                   </tr>
                 </thead>
                <tbody>
                  {Object.entries(this.state.rows).map(([key, row])=>(
                    <tr>
                      <td>
                         <input type="checkbox" class="checkboxBulk" value={key}/>
                      </td>
                      <td>
                          {key}
                      </td>
                        {this.state.allLanguages.map(language=>
                          <td>
                            <input type="text" class="form-control" required={true} defaultValue={row[language]} name={key+"["+language+"]"}/>
                          </td>
                        )}
                      <td>
                        <input type="submit" class="btn btn_small" value={this.l('Update')}/>
                       </td>
                      <td>
                        <a href="" class="fa_delete" onClick={e=>this.removeField(e, key)}></a> </td>
                      <td class="col-md-1">  </td>
                   </tr>
                   ))}
                </tbody>
             </table>
        </form>

       </div>
    );
  }
}

export default AttrSuggestion;