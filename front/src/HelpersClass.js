import { ConfigVarContext } from './context/ConfigVarContext';
import React, { useState, useContext } from "react";
import {headers, isJson, getUrlParam} from './Helpers.js';
import axios from 'axios';
import serialize from 'form-serialize';

class HelpersClass extends React.Component{
   static contextType = ConfigVarContext;
   interval =null;
   intervalIs = false;
   apiSettings = [];
   updateComp = true;
   defaultCurency = {name:"USD",code:"$",main:"yes",type:"left",rate:"1"};


   // we need this because the cms support multilanguage and currency change

    constructor(props) {
        super(props);
         var settingsData = localStorage.getItem('settingsData');
         var defaultData = this.isJson(settingsData) ? JSON.parse(settingsData) : {} ;

          this.state={apiSettings: {},
                      currentPage: 1,
                      totalCount: 0,
                      pageSize: 50,

                      langHelper: typeof defaultData.defaultLang != "undefined" ?
                                                   defaultData.defaultLang : "en",
                      langText: typeof defaultData.defaultLangText != "undefined" ?
                                                   defaultData.defaultLangText : "en",
                      translate: typeof defaultData.translate != "undefined" ?
                                                   defaultData.translate : {},
                      currency: typeof defaultData.defaultCurrency != "undefined" ?
                                                   defaultData.defaultCurrency : this.defaultCurency,

                      allLanguages: typeof defaultData.languages != "undefined" ?
                                                   defaultData.languages : ["en"],
                      }

          this.updateContext();
   }


  getLang=()=>{
     return getUrlParam("lang") !="" ? getUrlParam("lang")  : this.state.langText;
  }

  // this method will add new key and value to obj array the state
  initState=(obj)=>{
    try{
     for(var key in obj){
       this.state[key] =obj[key];
     }
     }catch(err){ }
   }

   updateContext=()=>{

     if(typeof this.context != "undefined" && !this.intervalIs && Object.keys(this.context).length >0){
          this.intervalIs = true;
          var isAdmin=document.getElementsByClassName("isAdminPanel");
         try{

          this.setState( {apiSettings: this.context,
                          langHelper: (isAdmin.length>0 ? this.context.mainOptions.adminlang :
                                                    this.context.mainOptions.languages[0]),
                          langText: this.context.mainOptions.languages[0],
                          currency: (isAdmin.length>0 ? this.context.currency:
                                                 this.context.currency),
                          translate: this.context.translate,
                          allLanguages: this.context.languages,
                         });

           }catch(err){}

          clearTimeout(this.interval);
      }else{
        if(this.interval ==null)
          this.interval= setTimeout(() =>{
                this.updateContext();
            }, 550);

      }
   }


    l=(text)=>{
        if(this.state.langHelper=="en")
              return text;

         try{
           return this.state.translate[text.toLowerCase().trim()];
          }catch(err){ }
           return text;
    }

    lang=(json, l = '')=>{
        var text = "";
        var lang = l != '' ? l : this.getLang();

         if(typeof json =="object"){
           try{
             return json[lang]
            }catch(err){
               return "";
            }
          }

         if(this.isJson(json)){
           var parse =  JSON.parse(json);
           text =parse[lang];
         }else{
           text = json;
         }
         return text;
    }

   getByLang=(json)=>{
           var text = "";
           if(this.isJson(json)){
             var parse =  JSON.parse(json);
             text =parse[this.state.langHelper];
           }else{
             text = json;
           }
      return text;
    }

   // check if string is json
   isJson=(str)=> {
      return isJson(str);
    }


  getSettingVal=()=> {
        //const [count, setCount] = useState(0);
    }

    /*
     this will return the price in the format of money
    */
   htmlPrice(price, saleprice){
       var currency= typeof this.state.currency =="undefined" ? this.defaultCurency : this.state.currency;

       return (saleprice !="0"?
                    (<> <del class="pricesale"> {currency.code}<span>{saleprice} </span></del> {currency.code}<span> {price} </span> </>):
                    (<>{currency.code}<span> {price} </span></>)) ;


    }

     getSettingVal =(dataArray,key,val)=>{
          var obj = this.isJson(dataArray) ? JSON.parse(dataArray) : dataArray
          var result = obj.find(obj => obj[key] === val);
          return typeof result != "undefined"  ? result : false;
     }

      getObjVal=(obj, key)=>{

          if(this.isJson(obj)){
            var parse =  JSON.parse(obj);
             return parse[key];
          }else{
            return obj[key];
          }
      }


     headers =()=>{
       return headers();
     }

     showLoad=()=>{
        try{
          document.getElementById("ajaxGif").style.display = "block";
        }catch(err){}
      }

     hideLoad=()=>{
        try{
          document.getElementById("ajaxGif").style.display = "none";
        }catch(err){}
      }

    success=(response="ok")=>{
         this.hideLoad();
        if(response=="ok"){
          try{
              document.getElementsByClassName("successOperation")[0].style.display = "block";
              setTimeout(function () {
                document.getElementsByClassName("successOperation")[0].style.display = "none";
              }, 2000)
            }catch(err){}
         }else{
             alert(response);
           }
      }

 isNull=(data, ret)=>{
     return  typeof data =="undefined" || data ==null ? ret : data;
 }


/**
Crud methods
**/

  // remove Btn
  deleteRow =(e, id, url)=>{
         e.preventDefault();

         if(!window.confirm("Are you sure, you want to delete it?"))
            return null

         this.showLoad();

      axios.delete(window.API_URL+'cp/'+url+'?id='+id, this.headers() )
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

   /**
    Publish and un publish
   */
    showHide =(e, id, hide, url)=>{
       e.preventDefault();
       this.showLoad();

    axios.get(window.API_URL+'cp/'+url+'?id='+id+"&hide="+hide, this.headers() )
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


//reset btn
 resetBtn=(e, url)=>{
    e.preventDefault();
    window.location.href= window.ADMIN_BASE_URL+url;
    window.location.reload();
 }
  // do some action like delete, move, block
  bulkActionImpl=(e, url)=>{
      e.preventDefault();
        // check if action select is not select focus on it and return null
       if(document.getElementById("actionType").value==""){
          document.getElementById("actionType").focus();
         return null;
        }


      var elementsBulk = document.getElementsByClassName("checkboxBulk");
      var ids=[];
       for(var i=0; i<elementsBulk.length; i++){
         if(elementsBulk[i].checked)
           ids.push(elementsBulk[i].value);
       }

       if(ids.length==0)
         return null;

     // do all the magical ajax post here well we use axios
      this.showLoad();
       axios.post(window.API_URL+'cp/'+url,
          { action: document.getElementById("actionType").value,
            id: ids
          },
         this.headers() )
             .then(res => {
               this.hideLoad();
               window.location.reload();
             }).catch(error => {
               alert(error);
               this.hideLoad();
             });
      }


    // save or add data
    formSave =(e, url)=>{
         e.preventDefault()
         const form = e.currentTarget
         const body = serialize(form, {hash: true, empty: false})

        // Request made to the backend api
        // Send formData object
        this.showLoad();
        axios.put(window.API_URL+'cp/'+url,
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


      sendDataPut=(body, url="")=>{
               // Request made to the backend api
               // Send formData object
               this.showLoad();
               axios.put(window.API_URL+'cp/'+url,
                           body,
                           this.headers()).
                     then(res => {
                          this.success(res.data);
                           if(res.data!="ok"){
                              alert(res.data);
                            }
                     }). catch(error => {
                       alert(error);
                       this.hideLoad();
                     });
           }

/**
end crud methods
**/

/*
  get categories names by id it need for product cat and pages cat


*/
getCatNameByIds=(catIds, arrayCats=[])=>{
   var names = [];

   if(catIds !=null){
      for(var i in arrayCats){
          if(catIds.includes(arrayCats[i]["catid"].toString())){
         names.push(<> {(names.length >0? ", ":"")}
                    <b>
                     <a href={window.ADMIN_BASE_URL+"categories/add-edit/"+arrayCats[i].type+"/"+ arrayCats[i].catid}>
                        {this.lang(arrayCats[i].title)}
                     </a>
                   </b> </>);

          }
      }
    }

   return (<>{names}</>);
 }

serialiseDiv=(id)=>{
        var body = {};
        var block = document.getElementById(id)
        var inputElements = block.querySelectorAll("input, select, checkbox, textarea");


        for (const input of inputElements){
          if(typeof input.name !="undefined" && input.name != "" && input.name != null){
              if(input.type=="checkbox"){
                  if(input.checked){
                     body[input.name] = input.value;
                  }
               }else{
                    if(input.name.includes(":")){
                       var name = input.name.split(":");
                       if(typeof body[name[0]]  != "undefined"){
                          body[name[0]][name[1]] =  input.value;
                       }else{
                          body[name[0]] =  {[name[1]] : input.value};
                       }

                     }else{
                       body[input.name] = input.value;
                     }
                }
          }
        }
  return body;
}


 reloadPage =(e, url)=>{
    //window.location.href= url;
    //window.location.reload();
 }

  switchLanguage =(link)=>{
   var url = link+"?lang=";
    return(
    <div class="langSwitchHeader">
     {this.state.allLanguages.map((language,i)=>
      <>
          <a href={url+language} class={getUrlParam("lang")==language || (getUrlParam("lang")=="" && i==0) ? "activLang" : ""} onClick={e=>this.reloadPage(e, url+language)}>
            <img src={window.API_ASSETS+"langicon/"+language.toUpperCase()+".png"} /> {language.toUpperCase()}
          </a> &nbsp; &nbsp;
      </>
     )}
    </div>
    );
  }


    duplicateContentImpl=(e, apiUrl )=>{
           if(!window.confirm(this.l("Are you sure?")))
             return null;

            this.showLoad();
            axios.get(window.API_URL+'cp/'+apiUrl+'&langFrom='+e.target.value+'&langTo='+this.getLang(),this.headers())
                 .then(res => {
                     if(res.data=="ok"){
                        window.location.reload();
                     }else{
                         alert(res.data);
                       }

                     this.hideLoad();
                 }).catch(error => {
                    alert(error);
                    this.hideLoad();
                 });
        }



     duplicateContent =(apiUrl )=>{
       return(
         <div class="duplicateSelect">
            <select onChange={e=> this.duplicateContentImpl(e, apiUrl)}>
             <option value="">{this.l("Duplicate from")}</option>
                {this.state.allLanguages.map((language,i)=>
                   <option value={language}>{this.l("Duplicate")} {language}</option>
                )}
            </select>
         </div>
       );
     }

    onChangeInput=(e, name)=>{
     this.setState({[name]:e.target.value});
    }

    setStateValue=(e, name, val)=>{
         e.preventDefault();
         this.setState({[name]: val});
    }


 }



export default HelpersClass;

/*
static getSettingVal =(dataArray,key,val)=>{
     var result = dataArray.filter(obj => {
           return obj[key] === val;
        });
   return typeof result != "undefined"  ?  result : false;
}

static getCurrency =(dataSettings)=>{

    var dataArray =  getSettingVal(dataSettings,"param","_currencies");
    var obj =  dataArray[0];
    console.log("Data array is:",(typeof obj !="undefined"  ? obj.value1:""));
    console.log("Data array is1:",dataSettings);

    if(dataArray ==false)
      return {name:"USD",code:"$",main:"yes",type:"left",rate:"1"};


  /*
     var result = dataArray['value1'].filter(obj => {
           return obj.main === "yes"
        });

   return typeof result != "undefined"  ?
          result : (result.length > 0 ? result[0] : {name:"USD",code:"$",main:"yes",type:"left",rate:"1"});

}




/*
 this will return the price in the format of money

  function L(props){
     var lang = "en";
     var text = "";
     if(isJson(props.text)){
       var parse =  JSON.parse(props.text);
       text =parse[lang];
     }else{
       text = props.text;
     }

  return (<>{text}</>);

}*/


/*
 this will return the price in the format of money

 const _l=(json)=>{
     var lang = "en";
     var text = "";
     if(isJson(json)){
       var parse =  JSON.parse(json);
       text =parse[lang];
     }else{
       text = json;
     }

  return text;

}

 isJson=(str)=> {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

*/


