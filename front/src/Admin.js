import React from 'react'
import ReactDOM from 'react-dom'

import Home from './admin/pages/Home';
import Header from './admin/layouts/Header';
import Footer from './admin/layouts/Footer';
import ProductList from './admin/pages/ProductList';
import ProductAddEdit from './admin/pages/ProductAddEdit';
import Categories from './admin/pages/Categories';
import Attributes from './admin/pages/Attributes';
import Languages from './admin/pages/Languages';
import EmailConfig from './admin/pages/EmailConfig';
import CategoriesAddEdit from './admin/pages/CategoriesAddEdit';


import ProductTabsEdit from './admin/pages/ProductTabsEdit';

import CheckoutFields from './admin/pages/CheckoutFields';
import Currencies from './admin/pages/Currencies';
import Countries from './admin/pages/Countries';
import ShippingMethods from './admin/pages/ShippingMethods';
import PaymentsList from './admin/pages/PaymentsList';
import PaymentSetting from './admin/pages/PaymentSetting';
import Users from './admin/pages/Users';
import UsersEdit from './admin/pages/UsersEdit';
import Subscribers from './admin/pages/Subscribers';
import Posts from './admin/pages/Posts';
import PostsEdit from './admin/pages/PostsEdit';

import PagesList from './admin/pages/PagesList';
import PagesEdit from './admin/pages/PagesEdit';
import EmailEditInsert from './admin/pages/EmailEditInsert';

import Contactform from './admin/pages/Contactform';
import ContactformEdit from './admin/pages/ContactformEdit';
import EditBlocks from './admin/pages/EditBlocks';

import GeneralSettings from './admin/pages/GeneralSettings';

import MenuList from './admin/pages/MenuList';
import MenuEdit from './admin/pages/MenuEdit';
import OrdersList from './admin/pages/OrdersList';
import Comments from './admin/pages/Comments';
import CouponsList from './admin/pages/CouponsList';

import ConfigVar from './context/ConfigVar';
import { BrowserRouter as Router, Route, Switch, HashRouter, Redirect} from 'react-router-dom';
import "./assets/admin/css/bootstrap.min.css";

import "./assets/cms/css/pageBuilderDefault.css";
import "./assets/admin/css/style.css";
import "./assets/admin/css/colorpicker.css";
import "./assets/admin/css/animate.min.css";

class Admin extends React.Component{

  render(){
    return(
      <div class="main-panel isAdminPanel" >{/*keep the name of the class "isAdminPanel" to detect if it's admin panel*/}
           <div id="ajaxGif"></div>
           <div class="successOperation"></div>

          <ConfigVar>
             <HashRouter>
               <div class="main-panel">
                 <Header/>
                   <div class="container-fluid">
                     <div class="row">
                      <div class="col-md-12">
                        <section>
                            <div class="main-panel">
                              <Switch>
                               <Route exact path='/' component={OrdersList} />
                               <Route exact path='/orders-list' component={OrdersList} />
                               <Route exact path='/comments' component={Comments} />
                               <Route exact path='/pages/edit-add-emails/:type/:id' component={EmailEditInsert} />
                               <Route exact path='/coupons-list' component={CouponsList} />

                               <Route exact path='/products-list' component={ProductList} />
                               <Route exact path='/products/edit-product/:id' component={ProductAddEdit} />
                               <Route exact path='/products/add-product/:id' component={ProductAddEdit} />
                               <Route exact path='/categories/list/:type' component={Categories} />
                               <Route exact path='/categories/add-edit/:type/:id' component={CategoriesAddEdit} />
                               <Route exact path='/attributes/:type' component={Attributes} />


                               <Route exact path='/pages-list/:type' component={PagesList} />


                               <Route exact path='/pages/edit-add-tabs/:type/:id' component={ProductTabsEdit} />

                               <Route exact path='/checkout-fields/:type' component={CheckoutFields} />
                               <Route exact path='/money-currencies' component={Currencies} />
                               <Route exact path='/checkout-countries' component={Countries} />
                               <Route exact path='/checkout-shipping' component={ShippingMethods} />
                               <Route exact path='/checkout-payment' component={PaymentsList} />
                               <Route exact path='/checkout-payment-settings/:id' component={PaymentSetting} />


                               <Route exact path='/users' component={Users} />
                               <Route exact path='/users/edit-insert/:id' component={UsersEdit} />
                               <Route exact path='/subscribers' component={Subscribers} />


                               <Route exact path='/pages/posts' component={Posts} />
                               <Route exact path='/pages/edit-add-posts/:type/:id' component={PostsEdit} />

                                <Route exact path='/contact-form' component={Contactform} />
                                <Route exact path='/contact-form-edit/:id' component={ContactformEdit} />
                                <Route exact path='/editable-blocks/:param/:type' component={EditBlocks} />

                               <Route exact path='/pages/edit-add-pages/:type/:id' component={PagesEdit} />

                               <Route exact path='/menu' component={MenuList} />
                               <Route exact path='/menu-single/:id' component={MenuEdit} />


                               <Route exact path='/general-settings' component={GeneralSettings} />
                               <Route exact path='/languages' component={Languages} />
                               <Route exact path='/email-settings' component={EmailConfig} />
                              </Switch>
                            </div>
                        </section>
                      </div>
                     </div>
                   </div>
                 <Footer />
               </div>
             </HashRouter>
           </ConfigVar>
     </div>
    )
  }
}

export default Admin;