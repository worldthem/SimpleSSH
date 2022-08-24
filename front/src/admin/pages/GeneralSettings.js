import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import serialize from 'form-serialize';
import HelpersClass from './../../HelpersClass.js';
import {  lang, _l, getUrlParam, setInput, fromJson } from './../../Helpers.js';

/**
Controller : controllers.cp.SettingsAdminController
*/
class GeneralSettings extends HelpersClass{
  constructor(props) {
    super(props);
    this.state = {
      logo:"",
      favicon:"",
      rows: {},
      title:"General Settings",
      pages:[],
      values:{},
    };
  }
  componentDidMount() {
      this.getData();

  }

  // get data from the server
       getData=()=>{
             this.showLoad();

             this.setState({ lang: this.getLang() });

             const reqOne = axios.get(window.API_URL+'cp/get-one-line-settings-by-param?param=_main_settings', this.headers());
             const reqTwo = axios.get(window.API_URL+'cp/pages-list-all?type=pages', this.headers());

             axios.all([reqOne,reqTwo ], this.headers())
                  .then(axios.spread((...res) => {

                     var obj = fromJson(res[0].data.value1);

                    this.setState({
                          row: res[0].data,
                          values:obj,
                          pages:res[1].data,
                          logo: obj.logo,
                          favicon: obj.favicon,
                     });

                      setInput(obj, "en");

                    this.hideLoad();

                  })).catch(error => {
                     alert(error);
                     this.hideLoad();
                  });
         }

   formUpdate =(e)=>{
     e.preventDefault()
     const form = e.currentTarget
     const body = serialize(form, {hash: true, empty: true})

     const mainOptions = this.state.values;

     for(var k in body)
       mainOptions[k] = body[k];

     var data ={param:"_main_settings" ,
                value:"",
                value1: JSON.stringify(mainOptions),
                autoload:"yes",
               }

     if(this.state.row.id)
       data['id'] = this.state.row.id;

    // Request made to the backend api
    // Send formData object
    this.showLoad();
    axios.put(window.API_URL+'cp/insert-update-settings',
                data,
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

  uploadImg =(e, name)=>{
           // Create an object of formData
           const formData = new FormData();
           var files = e.target.files;
           formData.append( "file", files[0]);

            this.showLoad()
          // Request made to the backend api
          // Send formData object
           axios.post(window.API_URL+'cp/simple-upload', formData, this.headers()).
                then(res => {
                    this.setState({[name]: res.data});
                    this.hideLoad();
                }). catch(error => {
                    alert(error);
                    this.hideLoad()
                });
    }

  render() {
    return (

   <div class="card">
        <div class="header headerBg">
           <div class="title">
             {this.l(this.state.title)}
           </div>
        </div>

        <form action="#" method="POST" enctype="multipart/form-data" onSubmit={this.formUpdate}>
              <div class="col-md-12 text_align_right">
               <input type="submit" class="btn btn_small" value={this.l('Update')}/>
             </div>
              <div class="col-md-6">
                 <table  class="table_admin_settings">
                   <tr>
                         <th>
                           <i class="fa fa-file-picture-o"></i> {this.l('Logo')}
                         </th>
                         <td>
                            <div class="col-md-12">
                               <input type="hidden" name="logo" value={this.state.logo}/>
                               <input type="file" class="form-control" onChange={e=>this.uploadImg(e,"logo")} />
                               {this.state.logo !=""?
                                    (<img src={window.API_ASSETS+"images/"+this.state.logo} style={{maxHeight:"70px"}}/>):
                                    (<></>)}

                            </div>
                            <div class="height10px"></div>
                         </td>
                     </tr>
                     <tr>
                         <th>
                           <i class="fa fa-file-picture-o"></i> {this.l('Favicon') }
                         </th>
                         <td>
                            <div class="col-md-12">
                                <input type="hidden" name="favicon" value={this.state.favicon}/>
                                <input type="file" class="form-control" onChange={e=>this.uploadImg(e,"favicon")}  />
                                {this.state.favicon !=""?
                                    (<img src={window.API_ASSETS+"images/"+this.state.favicon} style={{maxHeight:"70px"}}/>):
                                    (<></>)}
                            </div>
                         </td>
                     </tr>

                      <tr>
                         <th>
                           <h4>{this.l('Media') }:</h4>
                         </th>
                         <td>

                         </td>
                     </tr>
                      <tr>
                          <th>
                           <i class="fa fa-file-picture-o"></i> {this.l('Crop image by dimension') }
                         </th>
                         <td>
                             <div class="col-sm-12">
                             <label class="switch">
                                <input type="checkbox" class="checkbox" name="media_crop" value="yes" />
                                <span class="slider round"></span>
                              </label>
                           </div>
                         </td>
                     </tr>
                      <tr>
                          <th> <i class="fa fa-file-picture-o"></i> {this.l('Thumbnail size') } (pixel)</th>
                         <td>
                             <div class="col-sm-6">
                                 <input type="text" class="form-control" placeholder="255" name="media_width"  />
                            </div>
                              <div class="col-sm-6">
                                 <input type="text" class="form-control" placeholder="383" name="media_height" />
                             </div>
                         </td>
                     </tr>

                </table>
              </div>

               <div class="col-md-6">
                   <table  class="table_admin_settings">
                       <tr>
                           <th> {this.l("Forse login on checkout page")}</th>
                           <td>
                               <div class="col-md-12">
                                   <label class="switch">
                                       <input type="checkbox" class="checkbox" name="forseCheckoutLogin" value="yes"   />
                                   <span class="slider round"></span>
                                   </label>
                               </div>
                           </td>
                       </tr>
                       <tr>
                           <th> {this.l("Website on maintenance")}</th>
                           <td>
                               <div class="col-md-12">
                                   <label class="switch">
                                    <input type="checkbox" class="checkbox" name="websiteonmaintenance" value="yes" />
                                    <span class="slider round"></span>
                                   </label>
                               </div>
                           </td>
                       </tr>
                       <tr>
                           <th> {this.l("Minify css to increase the speed of website")}</th>
                           <td>
                               <div class="col-md-12">
                                   <label class="switch">
                                     <input type="checkbox" class="checkbox" name="developmentmode" value="yes"  />
                                     <span class="slider round"></span>
                                   </label>
                               </div>
                           </td>
                       </tr>
                       <tr>
                           <th><i class="fa fa-at"></i> {this.l("Email Address")}</th>
                           <td>
                               <div class="col-md-12">
                                   <input type="text" class="form-control" name="admin_email" />
                               </div>
                           </td>
                       </tr>
                       <tr>
                           <th><i class="fa fa-link"></i> {this.l("Site Address")}(URL)</th>
                           <td>
                               <div class="col-md-12">
                                   <input type="text" class="form-control"  name="baseurl" />
                                   </div>
                           </td>
                       </tr>
                       <tr>
                           <th><i class="fa fa-file"></i> {this.l("Site Title")}</th>
                           <td>
                               <div class="col-md-12">
                                   <input type="text" class="form-control" name="site_title" />
                                   </div>
                           </td>
                       </tr>
                       <tr>
                           <th><i class="fa fa-file"></i> {this.l("Meta descriptions")}</th>
                           <td>
                               <div class="col-md-12">
                                   <input type="text" class="form-control"  name="metad" />
                                   </div>
                           </td>
                       </tr>
                       <tr>
                           <th><i class="fa fa-file"></i> {this.l("Meta keyword")}</th>
                           <td>
                               <div class="col-md-12">
                                   <input type="text" class="form-control"  name="metak" />
                                   </div>
                           </td>
                       </tr>
                       <tr><th><h4>Shop pages:</h4></th> <td></td></tr>
                       <tr>
                           <th>  {this.l("Home Page")}</th>
                           <td>
                               <div class="col-md-12">
                                   <select name="pageHome" class="form-control">
                                       <option value="0">{this.l("Select")}</option>
                                       {this.state.pages.map(row=>
                                         <option value={row.pageid}>{this.lang(row.title)}</option>
                                       )}
                                   </select>
                               </div>
                           </td>
                       </tr>
                       <tr>
                           <th>  {this.l("Checkout term and condition page")}</th>
                           <td>
                               <div class="col-md-12">
                                   <select name="checkoutTermandcondition" class="form-control">
                                       <option value="0">{this.l("Select")}</option>
                                        {this.state.pages.map(row=>
                                             <option value={row.pageid}>{this.lang(row.title)}</option>
                                         )}
                                   </select>
                               </div>
                           </td>
                       </tr>
                       <tr>
                           <th><i class="fa fa-file"></i> {this.l("Any js like google analitycs code or chat")}</th>
                           <td>
                               <div class="col-md-12">
                                   <textarea name="_footerjs_" class="form-control"></textarea>
                               </div>
                           </td>
                       </tr>

                </table>
              </div>

            <div class="col-md-12 text_align_right">
               <input type="submit" class="btn btn_small" value={this.l('Update') }/>
           </div>
         </form>
         <div class="height20px"></div>
      </div>


     );
  }
}

export default GeneralSettings;