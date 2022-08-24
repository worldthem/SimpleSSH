 import React from 'react'
 import ReactDOM from 'react-dom'
 import axios from 'axios';
 import HelpersClass from './../../HelpersClass.js';
 import {ShowPrice, lang, _l, getUrlParam, setInput,
         toJsonObj, random,reactSetVal, setValueByClass } from './../../Helpers.js';
 import {SetBulk} from './../../UtilsComponents.js';
 import serialize from 'form-serialize';
 import CatCheckBoxOnly from './../layouts/CatCheckBoxOnly.js';

 class MenuEdit extends HelpersClass{

   positions = { topMenuLogin:"Top menu when user is login",
                    topMenuNOTLogin:"Top menu when user is NOT login",
                    main:"Main menu",
                    footer:"Footer Menu",
                   }

   constructor(props) {
       super(props);
       this.initState({
         row: {},
         pages:[],
         categories:[],
         typeofCategories:{},
         customLinks:{},
         pIcon:'',
         pLink:'',
         pTitle:'',
         fields: {},
         selectedElement:null,
         menuList: '',
         showEdit: 'none',
         sIcon:'',
         sLink:'',
         sTitle:'',
         isActive:'custom',
         selectedOption:null,
         langDefault:'en',
       });
     }

   componentDidMount() {
         const script = document.createElement("script");
                        script.src = window.BASE_URL+"jsLibrary/dragANDdrop.js";
                        script.async = false;
         const head = document.head || document.getElementsByTagName('head')[0];
                        head.insertBefore(script, head.firstChild);

         this.getData();
         document.getElementById('menuListContainer').addEventListener( 'click', (event) => this.clickSettings(event), false );
    }

      componentWillReceiveProps(nextProps) {
           if(this.state.langDefault != getUrlParam("lang")&& getUrlParam("lang") !=""){
             this.getData();
           }
       }

     settingsButtons=(classSet="")=>{
       var settingsButtons =
                  '<div class="editBlockMenu" > '+
                    '<span class="setMegaMenu"><span class="fa '+(classSet.includes('megaMenu')? 'fa-check-square':'fa-minus-square')+'"></span> Mega Menu </span>'+
                    '<a href="#" class="fa_move fa_small move_bdn"></a>' +
                    '<a href="#" class="fa_delete fa_small delete_ittem"></a>' +
                    '<a href="#" class="fa_edit fa_small"></a> ' +
                  '</div>';
       return settingsButtons;
     }

     setBtn =()=>{
       var containerMenu = document.getElementById('menuListContainer');
       var li = containerMenu.getElementsByTagName("li");

       for (var i=0;i<li.length;i++){
             var className = li[i].className;
             li[i].insertAdjacentHTML('beforeend', this.settingsButtons(className));

             var uls = li[i].getElementsByTagName("ul");
             if(uls.length==0)
                li[i].insertAdjacentHTML('beforeend', "<ul></ul>");

             li[i].addEventListener(
                      'click',
                      (event) => this.clickLi(event),
                      false
                    );
         }


      var ul = containerMenu.getElementsByTagName("ul");
        for (var i=0;i<ul.length;i++){
          window.Sortable.create(ul[i], {
                                         group: 'nested',
                                         animation: 150,
                                         fallbackOnBody: true,
                                         swapThreshold: 0.65,

                                       });
       }

       window.Sortable.create(containerMenu, {
                                     group: 'nested',
                                     animation: 150,
                                     fallbackOnBody: true,
                                     swapThreshold: 0.65,
                              });
     }



        getData=()=>{
              this.showLoad();

              this.setState({ langDefault: this.getLang() });
              axios.get(window.API_URL+'cp/get-menu-single?id='+this.props.match.params.id, this.headers())
                   .then(res=> {
                       this.setState({
                           row: res.data.settings,
                           pages: res.data.pages,
                           categories: res.data.categories,
                           customLinks: res.data.customLinks,
                           typeofCategories: res.data.typeOfCategories,
                       });

                      setTimeout(()=>{ this.setBtn(); }, 1000);

                       this.hideLoad();
                     }).catch(error => {
                      alert(error);
                      this.hideLoad();
                   });
            }

    clickLi=(e)=>{
        if(e.target.tagName=="LI"){
            e.preventDefault();
             var haveClass = e.target.className.includes("activeIn");
             var all= document.getElementsByClassName("activeIn");
             for (var i=0;i<all.length;i++)
                   all[i].className =all[i].className.replace("activeIn","");

             var eClass = e.target.className;
             e.target.className = haveClass ? eClass.replace("activeIn","") : eClass+" activeIn";
         }else{

         }
     }


      clickSettings =(e)=>{
         e.preventDefault();
                var className = e.target.className;

                if (className.includes('fa_delete')) {
                   this.removeElement(e);
                } else if (className.includes('fa_edit')) {
                  this.editElement(e);
                } else if (className.includes('setMegaMenu')) {
                    var span = e.target.getElementsByTagName("span");
                     span[0].className= span[0].className.includes("fa-minus-square") ? "fa fa-check-square":"fa fa-minus-square"
                     var par = e.target.parentNode.parentNode;
                         par.className= span[0].className.includes("fa-minus-square") ? "": "megaMenu";

                  }
      }


      removeElement=(e)=>{
              var r = window.confirm("Are you sure you want to remove this block?");
              if (r == true) {
                 var par = e.target.parentNode.parentNode;
                 par.remove();
            }
        }

       editElement=(e)=>{
         var par = e.target.parentNode.parentNode;
         var a = par.getElementsByTagName("a");
         if(a.length>0){
              var i = a[0].getElementsByClassName("fa");

             this.setState({
                  pIcon:i.length>0 ? i[0].className.replace("fa ","") : '',
                  pLink:a[0].getAttribute("href"),
                  pTitle:a[0].textContent || a[0].innerText || "",
                  showEdit:"block",
                  selectedElement: a[0],
              });
          }
       }

       updateLink=(e)=>{
         e.preventDefault();
         var element = this.state.selectedElement;
         if(element !=null){
           element.href = this.state.pLink;
           element.innerHTML = (this.state.pIcon !=""? "<i class='fa "+this.state.pIcon+"'></i> " : "") + this.state.pTitle;
         }

         this.setState({ pIcon: '',
                         pLink:'',
                         pTitle:'',
                         showEdit:'none',
                         selectedElement: null
                      });
       }

       showIconPopup=(e, name='pIcon')=>{
             e.preventDefault();
             var popupWind = document.getElementsByClassName('showFaIconPopup');
              if(popupWind.length>0){
                   popupWind[0].click();
               }

            var iconsListContainer = document.getElementsByClassName('fontawesome-icon-list');
              if(iconsListContainer.length>0)
                iconsListContainer[0].addEventListener( 'click', (event) => this.iconClick(event,name),  false );
         }

          //when click to add a icon
           iconClick=(e,name)=>{
                e.preventDefault();
              var className = e.target.className;

               if (className.includes('fa ')) {
                   this.setState({[name]:className.replace("fa ","")});
                   document.getElementById("closeFaIconPopup").click();
               }else if (className.includes('fa-hover')) {
                   this.setState({[name]: e.target.dataset.icon});
                   document.getElementById("closeFaIconPopup").click();
                }
            }

  selectSimplePage=(e)=>{
   if(e.target.value !="")
      this.setState({ sLink:e.target.value,
                      sTitle: e.target.options[e.target.selectedIndex].text ||  "",
                    });
    }

  addMenu=(e)=>{
      e.preventDefault();

     this.pushLink(this.state.sIcon, this.state.sLink, this.state.sTitle);
     this.setState({ sLink:"",
                     sTitle: "",
                     sIcon: "",
                  });
   setTimeout(()=>{ this.activateSort(); }, 200);
  }

  pushLink=(icon,link,title)=>{
         var iTag =  icon != "" ? '<i class="fa '+icon+'"></i> ':"";
         var additionalClass = link.substring(0, 1) == "#" ?  " "+link.substring(1) : "";
         var menu = '<li data-newelement="newElementMenu">'+
                     '<a href="'+link.replace(/\s/g, '')+'"  class="simple_link'+ additionalClass +'">'+
                         iTag+title.trim()+
                     '</a><ul></ul>' + this.settingsButtons() +
                     '</li>';

            var activeIn = document.getElementsByClassName("activeIn");

             if( activeIn.length > 0){
                 var ul = activeIn[0].getElementsByTagName("ul");
                 if(ul.length>0){
                    ul[0].insertAdjacentHTML('beforeend', menu);
                 }else{
                    activeIn[0].insertAdjacentHTML('beforeend', '<ul>'+menu+'</ul>');
                 }

               }else{
                    document.getElementById("menuListContainer").insertAdjacentHTML('beforeend', menu);
               }

     var resetSelect = document.getElementsByClassName("resetSelect");
      for(var i=0;i<resetSelect.length;i++)
          resetSelect[i].value="";

  }

     

  activateSort=()=>{
    var container = document.getElementById("menuListContainer");
    var elem = container.getElementsByTagName("li");

    if(elem.length>0){
       for (var i=0; i<elem.length; i++){
          if(elem[i].getAttribute("data-newelement")=="newElementMenu"){
            elem[i].addEventListener( 'click', (event) => this.clickLi(event), false );

            const ul = elem[i].getElementsByTagName("ul");

            if(ul.length>0)
            window.Sortable.create(ul[0], { group: 'nested',
                                            animation: 150,
                                            fallbackOnBody: true,
                                            swapThreshold: 0.65 });
            elem[i].removeAttribute("data-newelement");
          }
       }
     }
  }

  onChangeSelect=(e)=>{
    this.setState({selectedOption:e.target});
  }

  addMenuBySelect=(e)=>{
    e.preventDefault();
    if(this.state.selectedOption !=null && this.state.selectedOption.value !=""){

     this.pushLink(this.state.sIcon, this.state.selectedOption.value,
                   this.state.selectedOption.options[this.state.selectedOption.selectedIndex].text );
     this.setState({ sIcon: "", selectedOption: null });

     setTimeout(()=>{ this.activateSort(); }, 200);
    }
  }

  addMenuByCheckbox=(e, id, type="")=>{
      e.preventDefault();

      var container = document.getElementById(id);
      var checkBoxesList = container.getElementsByClassName("categoriesCheckbox");
      var is=false;
      if(checkBoxesList.length>0){
          for(var i=0; i<checkBoxesList.length; i++){
          if(checkBoxesList[i].checked){
              is=true;
              this.pushLink(this.state.sIcon,
                            (type=="product" || type=="brand"  ? "/cat/": "/categories/")+checkBoxesList[i].dataset.fullcpu,
                            checkBoxesList[i].dataset.title);
             }

            checkBoxesList[i].checked = false;
          }
       }

       if(is){
         this.setState({ sIcon: "" });
         setTimeout(()=>{ this.activateSort(); }, 500);
       }
   }

   formUpdate =(e)=>{
      e.preventDefault()
      const form = e.currentTarget
      const body = serialize(form, {hash: true, empty: false})

      document.querySelectorAll(".editBlockMenu").forEach(el => el.remove());

      var innerHTML =document.getElementById("menuListContainer").innerHTML

      var value1 = toJsonObj(this.state.row.value1);
      value1[this.getLang()] =innerHTML.replaceAll("<ul></ul>","").replaceAll("<ul> </ul>","");

      body['value1']= JSON.stringify(value1);



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


   render() {
     return (
      <div>
        <div class="header headerBg">
             <div class="title">
               {this.state.row.value}
             </div>
             {this.duplicateContent('menu-duplicate?pageid='+this.state.row.id)}
             {this.switchLanguage(window.ADMIN_BASE_URL+"menu-single/"+this.state.row.id) }
        </div>

        <div class="col-sm-4">
          <div class="card">
          {/*-------------Custom links----------*/}
            <div class="block">
              <h3 class="header_block menu_open" onClick={e=>this.setStateValue(e,"isActive","custom")}>
                {this.l('Custom Link')}
              </h3>
              <div class={"paddinginside block_inside"+(this.state.isActive=="custom"? " active" :"")}>
                <label class="col-md-4">{this.l('Select Icon')}</label>
                <div class="col-md-8">
                      <input type="text" value={this.state.sIcon} onChange={e=>this.onChangeInput(e,"sIcon")} placeholder={this.l('Select icon')} name="link" style={{width:"calc(100% - 80px)"}}/>
                       <a href="#" onClick={e=>this.showIconPopup(e,"sIcon")}> <i class="fa fa-plus-circle"></i> </a>&#160;
                       <i class={"fa "+this.state.sIcon}></i>
                 </div>
                <div class="height10px"></div>
                <label class="col-md-4">{this.l('Select URL')}</label>
                <div class="col-md-8">
                  <select class="form-control resetSelect" onChange={this.selectSimplePage}>
                    <option value="">{this.l('Select')}</option>
                    {Object.entries(this.state.customLinks).map(([k,v])=>
                       <option value={k}>{v}</option>
                    )}
                  </select>
                </div>
                <div class="height10px"></div>
                <label class="col-md-4">{this.l('Url')}</label>
                <div class="col-md-8">
                  <input type="text" placeholder="#" value={this.state.sLink}
                                     onChange={e=>this.onChangeInput(e,"sLink")} name="link"
                                     class="form-control" />
                </div>
                <div class="height10px"></div>
                <label class="col-md-4">{this.l('Title')}</label>
                <div class="col-md-8">
                  <input type="text" value={this.state.sTitle}
                                     onChange={e=>this.onChangeInput(e,"sTitle")} placeholder="Home" name="link"
                                     class="form-control col-md-8" />
                </div>

                <div class="height10px"></div>
                <p class="col-md-12 text_align_right">
                  <a href="#" class="btn btn_small" onClick={this.addMenu}> {this.l('Add item')} </a>
                </p>
                <div class="clear"></div>
              </div>
            </div>
           {/*-----------Pages------------*/}
            <div class="block">
              <h3 class="header_block menu_open" onClick={e=>this.setStateValue(e,"isActive","pages")}>
               {this.l('Pages')}
             </h3>

              <div class={"paddinginside block_inside"+(this.state.isActive=="pages"? " active" :"")}>
                <label class="col-md-4">{this.l('Select Icon')}</label>
                <div class="col-md-8">
                      <input type="text" value={this.state.sIcon} onChange={e=>this.onChangeInput(e,"sIcon")} placeholder={this.l('Select icon')} name="link" style={{width:"calc(100% - 80px)"}}/>
                       <a href="#" onClick={e=>this.showIconPopup(e,"sIcon")}> <i class="fa fa-plus-circle"></i> </a>&#160;
                       <i class={"fa "+this.state.sIcon}></i>
                 </div>

                <div class="height10px"></div>
                <label class="col-md-4">{this.l('Page')}</label>
                <div class="col-md-8">
                  <select class="form-control link_page resetSelect" onChange={this.onChangeSelect}>
                    <option value="">{this.l('Select')}</option>
                   {this.state.pages.map(v=>
                    <option value={'/page/'+v.cpu} data-info={v.pageid}> {this.lang(v.title)} </option>
                   )}
                  </select>
                </div>
                <div class="height10px"></div>
                <p class="col-md-12 text_align_right">
                  <a href="#" class="btn btn_small" onClick={this.addMenuBySelect}> {this.l('Add item')} </a>
                </p>
                <div class="clear"></div>
              </div>
            </div>

            {/*------------Categories-----------*/}
            {Object.entries(this.state.typeofCategories).map(([k,v])=>
            <div class="block">
              <h3 class="header_block menu_open" onClick={e=>this.setStateValue(e,"isActive",k)}>
                 {this.l(v)}
              </h3>
              <div class={"paddinginside block_inside"+(this.state.isActive==k? " active" :"")}>
                 <label class="col-md-4">{this.l('Select Icon')}</label>
                 <div class="col-md-8">
                    <input type="text" value={this.state.sIcon} onChange={e=>this.onChangeInput(e,"sIcon")} placeholder={this.l('Select icon')} name="link" style={{width:"calc(100% - 80px)"}}/>
                    <a href="#" onClick={e=>this.showIconPopup(e,"sIcon")}> <i class="fa fa-plus-circle"></i> </a> &#160;
                    <i class={"fa "+this.state.sIcon}></i>
                 </div>

                <div class="height10px"></div>
                <label class="col-md-12">{this.l('Select')}:</label>
                <div class="col-md-12" id={"checkBoxesList"+k}>
                   <CatCheckBoxOnly rows={this.state.categories} catType={k} catid={[]} />
                </div>

                <div class="height10px"></div>
                <p class="col-md-12 text_align_right">
                  <a href="#" class="btn btn_small" onClick={e=>this.addMenuByCheckbox(e,"checkBoxesList"+k,k)} > {this.l('Add items')} </a>
                </p>
                <div class="clear"></div>
              </div>
             </div>
            )}
          </div>
        </div>
        {/*-----------------------*/}

        {/* ***************************** */}

        <div class="col-sm-8">
          <form action="#" method="post" onSubmit={this.formUpdate}>
            <div class="card">
              <div class="header_block">
                <div class="col-md-10 header_menue">
                  <em>{this.l('Menu name')}:</em>
                  <input type="text" name="value" defaultValue={this.state.row.value} class="form-control small_input" />

                  &nbsp;&nbsp;
                  <em>{this.l('Position')}:</em>
                  <select name="value2"   class="form-control small_input">
                        <option value="">{this.l('Select Position')}</option>
                       {Object.entries(this.positions).map(([key, row])=>(
                        <option value={key} selected={this.state.row.value2==key}>{this.l(row)}</option>
                        ))}
                  </select>

                </div>
                <div class="col-md-2 text_align_right">
                  <input type="submit" class="btn btn_small submit_form" value={this.l('Update')} />
                </div>
                <div class="clear"></div>
              </div>
              <div class="paddinginside">
                <input type="hidden" name="id" value={this.state.row.id} />
                <input type="hidden" name="param" value="website_menu" />
                <input type="hidden" name="lang" value={this.getLang()} />
                <textarea name="munuIttem" id="response" style={{ display: 'none' }}></textarea>

                <div class="clear"></div>
                <div class="menu-box">
                  <ul class="menu-list sortable" id="menuListContainer" dangerouslySetInnerHTML={{
                            __html: this.lang(this.state.row.value1),
                          }} />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="height20px"></div>
        
        <div class="edit_link_div" style={{display:this.state.showEdit}}>
               <div class="height10px"></div>
               <input  type="hidden" value="" class="link_edit_hidden_href"/>
               <label class="col-md-12">{this.l('Icon') } </label>
               <div class="col-md-12">
                  <input type="text" value={this.state.pIcon} onChange={e=>this.onChangeInput(e,"pIcon")} placeholder={this.l('Select icon')} name="link" style={{width:"calc(100% - 80px)"}}/>
                   <a href="#" onClick={this.showIconPopup}> <i class="fa fa-plus-circle"></i> </a>
                   &#160; <i class={"fa "+this.state.pIcon}></i>
               </div>


               <div class="height10px"></div>

              <label class="col-md-12">{this.l('Url') }</label>
              <div class="col-md-12">
               <input type="text" value={this.state.pLink} onChange={e=>this.onChangeInput(e,"pLink")} placeholder="#"  class="form-control" />
             </div>
              
             
              <div class="height10px"></div>
              <label class="col-md-12">{this.l('Title') }</label>
              <div class="col-md-12">
                <input type="text" placeholder="Home" value={this.state.pTitle} onChange={e=>this.onChangeInput(e,"pTitle")} class="form-control" />
              </div>
              
              <div class="height10px"></div>
              <p class="col-md-12">
                <a href="#" class="btn btn_small close_edit_div" onClick={e=>this.setStateValue(e,"showEdit","none")}>Close</a>
                <a href="#" class="btn btn_small" onClick={this.updateLink} style={{float:"right"}}>{this.l('Update') }</a>
              </p>
              <div class="clear"></div> 
            </div>
      </div>
      );
   }
}

export default MenuEdit;