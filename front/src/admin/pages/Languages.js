import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import HelpersClass from './../../HelpersClass.js';
import {ShowPrice, lang, _l, getUrlParam, setInput,
        toJsonObj, random,reactSetVal, setValueByClass,fromJson } from './../../Helpers.js';
import {SetBulk} from './../../UtilsComponents.js';
import serialize from 'form-serialize';

class Languages extends HelpersClass{
  constructor(props) {
    super(props);
    this.initState({
              lang: 'en',
              row:  {},
              value1: {},
              frontLanguages: ['en'],
              adminLanguage: '',
              editLang: false,
              englishLang:[],
              editLanuage:{},
              editLangName:'',
             });
  }
  componentDidMount() {
    this.getData();
  }


     getData=()=>{
       this.showLoad();

       this.setState({ lang: this.getLang() });
       axios.get(window.API_URL+'cp/get-one-line-settings-by-param?param=_main_settings', this.headers())
            .then(res=> {
              var obj = fromJson(res.data.value1);
               this.setState({
                    row: res.data,
                    value1: obj,
                    frontLanguages: obj.languages,
                    adminLanguage: obj.adminlang,
                });

                this.hideLoad();
              }).catch(error => {
               alert(error);
               this.hideLoad();
            });
     }

  makeDefault=(e, lang)=>{
       e.preventDefault();
      var val1 = this.state.value1;
      var languages = val1.languages;
      var newArrayLang = languages.filter(function(e) { return e !== lang })
          newArrayLang.unshift(lang);
       val1["languages"] = newArrayLang;

      this.updateSettings(val1);
  }

   addLanguage=(e)=>{
         e.preventDefault();
        var lang = document.getElementById("frontLanguageSelect").value;
        var val1 = this.state.value1;
        var languages = val1.languages;
        var newArrayLang = languages.filter(function(e) { return e !== lang })
            newArrayLang.push(lang);
         val1["languages"] = newArrayLang;

        this.updateSettings(val1);
    }

    removeLanguage=(e, lang)=>{
             e.preventDefault();
            var val1 = this.state.value1;
            var languages = val1.languages;
            var newArrayLang = languages.filter(function(e) { return e !== lang })
                val1["languages"] = newArrayLang;

            this.updateSettings(val1);
        }

    setAdminLang=(e )=>{
            e.preventDefault();
           var lang = document.getElementById("adminLanguageSelect").value;
           var val1 = this.state.value1;
               val1["adminlang"] = lang;

           this.updateSettings(val1);
       }

  setDataState =(e,name)=>{
      this.setState({ [name]: e.target.value });
  }

  updateSettings=(value1={})=>{
         this.showLoad();
         var row =this.state.row;
             row["value1"] = JSON.stringify(value1);
         axios.put(window.API_URL+'cp/insert-update-settings',
                     row,
                     this.headers()).
               then(res => {
                    if(res.data=="ok"){
                       this.getData();
                       this.success(res.data);
                   }else{
                       alert(res.data);
                   }
               }). catch(error => {
                 alert(error);
                 this.hideLoad();
               });
   }

   editLang=(e, lang)=>{
         e.preventDefault();
        this.setState({ lang: this.getLang() });
        axios.get(window.API_URL+'cp/get-lang?lang='+lang, this.headers())
             .then(res=> {
                 this.setState({
                     englishLang: res.data.english == null ? [] : res.data.english,
                     editLanuage: res.data.lang == null ? {} :res.data.lang,
                     editLang: true,
                     editLangName: lang,
                 });

                 this.hideLoad();
               }).catch(error => {
                alert(error);
                this.hideLoad();
             });

   }

   updateLang =(e)=>{
     e.preventDefault()
       var inp  = document.getElementsByClassName("editLangInp");

          const data={};
          for(var i=0;i<inp.length;i++){
             data[inp[i].dataset.name] = inp[i].value;
           }

          this.showLoad();
           axios.put(window.API_URL+'cp/update-lang-file?lang='+this.state.editLangName,
                        data,
                        this.headers()).
                  then(res => {
                       if(res.data=="ok"){
                           this.success(res.data);
                      }else{
                          alert(res.data);
                      }
                  }). catch(error => {
                    alert(error);
                    this.hideLoad();
                  });
   }

  render() {
    return (
        <div class="card">
          <div class="header">
            <h4 class="title">{this.l('Language')} </h4>
          </div>
          <div class="add_new_top">
            <form action="#" method="post">
              <div class="col-md-3">
                <i class="fa fa-flag"></i> {this.l('Front end Language')} <br />

                <select name="language" class="form-control" id="frontLanguageSelect">
                  <option value="">{this.l('Select')}</option>
                   {this.languagesList.map((language) => (
                      <option value={language.code}>{language.nativeName}</option>
                    ))}
                </select>

                {this.state.frontLanguages.map((language, i) => (
                  <div>
                       <b>
                        <img src={window.API_ASSETS+'langicon/' + language.toUpperCase() + '.png' } /> {language.toUpperCase()}
                       </b>
                        <a href={window.ADMIN_BASE_URL+"languages?edit="+language} onClick={e=>this.editLang(e,language)}>
                            <span class="fa fa-pen"></span>
                        </a> &nbsp;
                        {i == 0 ? ( <>
                          <span class="fa fa-home"></span>{this.l('Default')}
                        </> ) : ( <>
                            <>&nbsp;
                             <a href="#" onClick={e=>this.makeDefault(e,language)}>{this.l('Make default')}</a> &nbsp;
                             <a href="#" onClick={e=>this.removeLanguage(e,language)}><i class="fa fa-trash"></i></a>
                            </>
                        </> )}

                  </div>
                ))}

              </div>

              <div class="col-md-2">
                <br />
                <button type="submit" class="btn btn_small" onClick={this.addLanguage}> {this.l('Add language')} </button>
              </div>

              <div class="col-md-3">
                <i class="fa fa-flag"></i> {this.l('Admin Language')} <br />

                <select name="adminlanguage" class="form-control" id="adminLanguageSelect"
                     style={{ width: 'calc(100% - 24px)', display: 'inline-table', }}
                     value={this.state.adminLanguage} onChange={e=>this.setDataState(e,"adminLanguage")}>
                   <option value="">{this.l('Select')}</option>

                     {this.languagesList.map((language) => (
                       <option value={language.code}>{language.nativeName}</option>
                     ))}
                </select>

                <a href="#">
                  <b>
                    <span class="fa fa-pencil"></span>
                  </b>
                </a>
              </div>
              <div class="col-md-2">
                <br />
                <button type="submit" class="btn btn_small" onClick={this.setAdminLang}>{this.l('Change')} </button>
              </div>

              <div class="clear"></div>
              <div class="col-md-12">
                  Put this short code in header like: <br /> [language] <br /> [language type=short]
              </div>

              <div class="clear"></div>

           </form>
          {this.state.editLang ? (
          <>
           <form  action="#" method="post" onSubmit={this.updateLang}>
                <input type="hidden" name="lang" value={this.state.editLangName} />

                <div class="rightSideSave" style={{right:"-40px"}}>
                  <button type="submit" class="buttonSave"><i class="fa fa-cloud-upload"></i>{this.l('Update')}</button>
                </div>

           <table class="table table-hover table-striped">
                <thead>
                    <th style={{width:"33%"}}> {this.l('In English')}</th>
                        <th>
                       <a href="#" class="shareTranslate lang1Share">
                             Share This Translate
                       </a><br />
                            &nbsp;&nbsp;
                            <img src={window.API_ASSETS+'langicon/' + this.state.editLangName.toUpperCase() + '.png' } /> &nbsp;
                             {this.state.editLangName.toUpperCase()}


                       </th>
                 </thead>
                 <tbody>
                   {this.state.englishLang.map(lang=>
                     <tr>
                        <td>{lang}</td>
                        <td>
                         <input type="text" class="form-control editLangInp" data-name={lang}
                                defaultValue={this.state.editLanuage[lang]} />
                       </td>
                     </tr>
                   )}
                </tbody>
           </table>
           </form>
           </>
          ):(<></>)}

          </div>
        </div>

    );
  }


languagesList =  [
                  { code: 'ab', name: 'Abkhaz', nativeName: 'аҧсуа' },
                  { code: 'aa', name: 'Afar', nativeName: 'Afaraf' },
                  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
                  { code: 'ak', name: 'Akan', nativeName: 'Akan' },
                  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
                  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
                  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
                  { code: 'an', name: 'Aragonese', nativeName: 'Aragonés' },
                  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
                  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
                  { code: 'av', name: 'Avaric', nativeName: 'авар мацӀ, магӀарул мацӀ' },
                  { code: 'ae', name: 'Avestan', nativeName: 'avesta' },
                  { code: 'ay', name: 'Aymara', nativeName: 'aymar aru' },
                  { code: 'az', name: 'Azerbaijani', nativeName: 'azərbaycan dili' },
                  { code: 'bm', name: 'Bambara', nativeName: 'bamanankan' },
                  { code: 'ba', name: 'Bashkir', nativeName: 'башҡорт теле' },
                  { code: 'eu', name: 'Basque', nativeName: 'euskara, euskera' },
                  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
                  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
                  { code: 'bh', name: 'Bihari', nativeName: 'भोजपुरी' },
                  { code: 'bi', name: 'Bislama', nativeName: 'Bislama' },
                  { code: 'bs', name: 'Bosnian', nativeName: 'bosanski jezik' },
                  { code: 'br', name: 'Breton', nativeName: 'brezhoneg' },
                  { code: 'bg', name: 'Bulgarian', nativeName: 'български език' },
                  { code: 'my', name: 'Burmese', nativeName: 'ဗမာစာ' },
                  { code: 'ca', name: 'Catalan; Valencian', nativeName: 'Català' },
                  { code: 'ch', name: 'Chamorro', nativeName: 'Chamoru' },
                  { code: 'ce', name: 'Chechen', nativeName: 'нохчийн мотт' },
                  {
                    code: 'ny',
                    name: 'Chichewa; Chewa; Nyanja',
                    nativeName: 'chiCheŵa, chinyanja',
                  },
                  {
                    code: 'zh',
                    name: 'Chinese',
                    nativeName: '中文 (Zhōngwén), 汉语, 漢語',
                  },
                  { code: 'cv', name: 'Chuvash', nativeName: 'чӑваш чӗлхи' },
                  { code: 'kw', name: 'Cornish', nativeName: 'Kernewek' },
                  { code: 'co', name: 'Corsican', nativeName: 'corsu, lingua corsa' },
                  { code: 'cr', name: 'Cree', nativeName: 'ᓀᐦᐃᔭᐍᐏᐣ' },
                  { code: 'hr', name: 'Croatian', nativeName: 'hrvatski' },
                  { code: 'cs', name: 'Czech', nativeName: 'česky, čeština' },
                  { code: 'da', name: 'Danish', nativeName: 'dansk' },
                  {
                    code: 'dv',
                    name: 'Divehi; Dhivehi; Maldivian;',
                    nativeName: 'ދިވެހި',
                  },
                  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands, Vlaams' },
                  { code: 'en', name: 'English', nativeName: 'English' },
                  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto' },
                  { code: 'et', name: 'Estonian', nativeName: 'eesti, eesti keel' },
                  { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe' },
                  { code: 'fo', name: 'Faroese', nativeName: 'føroyskt' },
                  { code: 'fj', name: 'Fijian', nativeName: 'vosa Vakaviti' },
                  { code: 'fi', name: 'Finnish', nativeName: 'suomi, suomen kieli' },
                  {
                    code: 'fr',
                    name: 'French',
                    nativeName: 'français, langue française',
                  },
                  {
                    code: 'ff',
                    name: 'Fula; Fulah; Pulaar; Pular',
                    nativeName: 'Fulfulde, Pulaar, Pular',
                  },
                  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
                  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
                  { code: 'de', name: 'German', nativeName: 'Deutsch' },
                  { code: 'el', name: 'Greek, Modern', nativeName: 'Ελληνικά' },
                  { code: 'gn', name: 'Guaraní', nativeName: 'Avañeẽ' },
                  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
                  {
                    code: 'ht',
                    name: 'Haitian; Haitian Creole',
                    nativeName: 'Kreyòl ayisyen',
                  },
                  { code: 'ha', name: 'Hausa', nativeName: 'Hausa, هَوُسَ' },
                  { code: 'he', name: 'Hebrew (modern)', nativeName: 'עברית' },
                  { code: 'hz', name: 'Herero', nativeName: 'Otjiherero' },
                  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी, हिंदी' },
                  { code: 'ho', name: 'Hiri Motu', nativeName: 'Hiri Motu' },
                  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
                  { code: 'ia', name: 'Interlingua', nativeName: 'Interlingua' },
                  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
                  {
                    code: 'ie',
                    name: 'Interlingue',
                    nativeName:
                      'Originally called Occidental; then Interlingue after WWII',
                  },
                  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
                  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo' },
                  { code: 'ik', name: 'Inupiaq', nativeName: 'Iñupiaq, Iñupiatun' },
                  { code: 'io', name: 'Ido', nativeName: 'Ido' },
                  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
                  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
                  { code: 'iu', name: 'Inuktitut', nativeName: 'ᐃᓄᒃᑎᑐᑦ' },
                  {
                    code: 'ja',
                    name: 'Japanese',
                    nativeName: '日本語 (にほんご／にっぽんご)',
                  },
                  { code: 'jv', name: 'Javanese', nativeName: 'basa Jawa' },
                  {
                    code: 'kl',
                    name: 'Kalaallisut, Greenlandic',
                    nativeName: 'kalaallisut, kalaallit oqaasii',
                  },
                  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
                  { code: 'kr', name: 'Kanuri', nativeName: 'Kanuri' },
                  { code: 'ks', name: 'Kashmiri', nativeName: 'कश्मीरी, كشميري‎' },
                  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі' },
                  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
                  { code: 'ki', name: 'Kikuyu, Gikuyu', nativeName: 'Gĩkũyũ' },
                  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda' },
                  { code: 'ky', name: 'Kirghiz, Kyrgyz', nativeName: 'кыргыз тили' },
                  { code: 'kv', name: 'Komi', nativeName: 'коми кыв' },
                  { code: 'kg', name: 'Kongo', nativeName: 'KiKongo' },
                  {
                    code: 'ko',
                    name: 'Korean',
                    nativeName: '한국어 (韓國語), 조선말 (朝鮮語)',
                  },
                  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî, كوردی‎' },
                  { code: 'kj', name: 'Kwanyama, Kuanyama', nativeName: 'Kuanyama' },
                  { code: 'la', name: 'Latin', nativeName: 'latine, lingua latina' },
                  {
                    code: 'lb',
                    name: 'Luxembourgish, Letzeburgesch',
                    nativeName: 'Lëtzebuergesch',
                  },
                  { code: 'lg', name: 'Luganda', nativeName: 'Luganda' },
                  {
                    code: 'li',
                    name: 'Limburgish, Limburgan, Limburger',
                    nativeName: 'Limburgs',
                  },
                  { code: 'ln', name: 'Lingala', nativeName: 'Lingála' },
                  { code: 'lo', name: 'Lao', nativeName: 'ພາສາລາວ' },
                  { code: 'lt', name: 'Lithuanian', nativeName: 'lietuvių kalba' },
                  { code: 'lu', name: 'Luba-Katanga', nativeName: '' },
                  { code: 'lv', name: 'Latvian', nativeName: 'latviešu valoda' },
                  { code: 'gv', name: 'Manx', nativeName: 'Gaelg, Gailck' },
                  { code: 'mk', name: 'Macedonian', nativeName: 'македонски јазик' },
                  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy fiteny' },
                  { code: 'ms', name: 'Malay', nativeName: 'bahasa Melayu, بهاس ملايو‎' },
                  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
                  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
                  { code: 'mi', name: 'Māori', nativeName: 'te reo Māori' },
                  { code: 'mr', name: 'Marathi (Marāṭhī)', nativeName: 'मराठी' },
                  { code: 'mh', name: 'Marshallese', nativeName: 'Kajin M̧ajeļ' },
                  { code: 'mn', name: 'Mongolian', nativeName: 'монгол' },
                  { code: 'na', name: 'Nauru', nativeName: 'Ekakairũ Naoero' },
                  {
                    code: 'nv',
                    name: 'Navajo, Navaho',
                    nativeName: 'Diné bizaad, Dinékʼehǰí',
                  },
                  { code: 'nb', name: 'Norwegian Bokmål', nativeName: 'Norsk bokmål' },
                  { code: 'nd', name: 'North Ndebele', nativeName: 'isiNdebele' },
                  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
                  { code: 'ng', name: 'Ndonga', nativeName: 'Owambo' },
                  { code: 'nn', name: 'Norwegian Nynorsk', nativeName: 'Norsk nynorsk' },
                  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
                  { code: 'ii', name: 'Nuosu', nativeName: 'ꆈꌠ꒿ Nuosuhxop' },
                  { code: 'nr', name: 'South Ndebele', nativeName: 'isiNdebele' },
                  { code: 'oc', name: 'Occitan', nativeName: 'Occitan' },
                  { code: 'oj', name: 'Ojibwe, Ojibwa', nativeName: 'ᐊᓂᔑᓈᐯᒧᐎᓐ' },
                  {
                    code: 'cu',
                    name: 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic',
                    nativeName: 'ѩзыкъ словѣньскъ',
                  },
                  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo' },
                  { code: 'or', name: 'Oriya', nativeName: 'ଓଡ଼ିଆ' },
                  { code: 'os', name: 'Ossetian, Ossetic', nativeName: 'ирон æвзаг' },
                  { code: 'pa', name: 'Panjabi, Punjabi', nativeName: 'ਪੰਜਾਬੀ, پنجابی‎' },
                  { code: 'pi', name: 'Pāli', nativeName: 'पाऴि' },
                  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
                  { code: 'pl', name: 'Polish', nativeName: 'polski' },
                  { code: 'ps', name: 'Pashto, Pushto', nativeName: 'پښتو' },
                  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
                  { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi, Kichwa' },
                  { code: 'rm', name: 'Romansh', nativeName: 'rumantsch grischun' },
                  { code: 'rn', name: 'Kirundi', nativeName: 'kiRundi' },
                  {
                    code: 'ro',
                    name: 'Romanian, Moldavian, Moldovan',
                    nativeName: 'română',
                  },
                  { code: 'ru', name: 'Russian', nativeName: 'русский язык' },
                  { code: 'sa', name: 'Sanskrit (Saṁskṛta)', nativeName: 'संस्कृतम्' },
                  { code: 'sc', name: 'Sardinian', nativeName: 'sardu' },
                  { code: 'sd', name: 'Sindhi', nativeName: 'सिन्धी, سنڌي، سندھی‎' },
                  { code: 'se', name: 'Northern Sami', nativeName: 'Davvisámegiella' },
                  { code: 'sm', name: 'Samoan', nativeName: 'gagana faa Samoa' },
                  { code: 'sg', name: 'Sango', nativeName: 'yângâ tî sängö' },
                  { code: 'sr', name: 'Serbian', nativeName: 'српски језик' },
                  { code: 'gd', name: 'Scottish Gaelic; Gaelic', nativeName: 'Gàidhlig' },
                  { code: 'sn', name: 'Shona', nativeName: 'chiShona' },
                  { code: 'si', name: 'Sinhala, Sinhalese', nativeName: 'සිංහල' },
                  { code: 'sk', name: 'Slovak', nativeName: 'slovenčina' },
                  { code: 'sl', name: 'Slovene', nativeName: 'slovenščina' },
                  { code: 'so', name: 'Somali', nativeName: 'Soomaaliga, af Soomaali' },
                  { code: 'st', name: 'Southern Sotho', nativeName: 'Sesotho' },
                  {
                    code: 'es',
                    name: 'Spanish; Castilian',
                    nativeName: 'español, castellano',
                  },
                  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda' },
                  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
                  { code: 'ss', name: 'Swati', nativeName: 'SiSwati' },
                  { code: 'sv', name: 'Swedish', nativeName: 'svenska' },
                  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
                  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
                  { code: 'tg', name: 'Tajik', nativeName: 'тоҷикӣ, toğikī, تاجیکی‎' },
                  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
                  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
                  {
                    code: 'bo',
                    name: 'Tibetan Standard, Tibetan, Central',
                    nativeName: 'བོད་ཡིག',
                  },
                  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen, Түркмен' },
                  {
                    code: 'tl',
                    name: 'Tagalog',
                    nativeName: 'Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔',
                  },
                  { code: 'tn', name: 'Tswana', nativeName: 'Setswana' },
                  { code: 'to', name: 'Tonga (Tonga Islands)', nativeName: 'faka Tonga' },
                  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
                  { code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga' },
                  { code: 'tt', name: 'Tatar', nativeName: 'татарча, tatarça, تاتارچا‎' },
                  { code: 'tw', name: 'Twi', nativeName: 'Twi' },
                  { code: 'ty', name: 'Tahitian', nativeName: 'Reo Tahiti' },
                  {
                    code: 'ug',
                    name: 'Uighur, Uyghur',
                    nativeName: 'Uyƣurqə, ئۇيغۇرچە‎',
                  },
                  { code: 'uk', name: 'Ukrainian', nativeName: 'українська' },
                  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
                  { code: 'uz', name: 'Uzbek', nativeName: 'zbek, Ўзбек, أۇزبېك‎' },
                  { code: 've', name: 'Venda', nativeName: 'Tshivenḓa' },
                  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
                  { code: 'vo', name: 'Volapük', nativeName: 'Volapük' },
                  { code: 'wa', name: 'Walloon', nativeName: 'Walon' },
                  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
                  { code: 'wo', name: 'Wolof', nativeName: 'Wollof' },
                  { code: 'fy', name: 'Western Frisian', nativeName: 'Frysk' },
                  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
                  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
                  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
                  {
                    code: 'za',
                    name: 'Zhuang, Chuang',
                    nativeName: 'Saɯ cueŋƅ, Saw cuengh',
                  },
                ];
}

export default Languages;
