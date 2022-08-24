import React from 'react';

class RegistrationLoginForm extends React.Component {

constructor(props) {
       super(props);
          this.state = {rand1: Math.random().toString(36).substring(7),
                        rand2: Math.random().toString(36).substring(7),
                        rand3: Math.random().toString(36).substring(7),
                        randtab1: Math.random().toString(36).substring(7),
                        randtab2: Math.random().toString(36).substring(7),
                      }
 }


 render() {
  return (
   <div>
      <ul>
         <li class="resp-tab-item tab_buttons tab1-1 active"  onclick="return setTab('tab1-1');" ><span>${view.l('Sign in')}</span></li>
         <li class="resp-tab-item tab_buttons tab2-2"  onclick="return setTab('tab2-2');" ><span>${view.l('Create an Account')}</span></li>
      </ul>
      <div class="tab-1 resp-tab-content tab-pane" id="tab1-1" aria-labelledby="tab_item-0">
         <div class="facts">
            <div class="register">
               <form action="/login" method="post" id="login_form${rand1}" class="login_${rand1}" onsubmit="simplePost('${baseurl}signin','.show_result${rand1}', '', '#login_form${rand1}' , '.show_result${rand1}'); return false;" >
                      <input type="hidden" name="typelogin" value="${typeLogin!}" />
                      <input type="hidden" name="method" value="ajax" />

                     <input name="email" placeholder="Email Address" type="email" required="" value=""> <!--name="username"-->
                     <input name="password" placeholder="Password" type="password" required="" value="">
                     <div class="sign-up">
                      <input type="submit" value="Sign in"  />
                      <a href="#" class="tab3-3 tab_buttons reset_pass_btn" onclick="return setTab('tab3-3');" ><span> ${view.l('Forgot Your Password?')} </span></a>
                    </div>
                  <p> <span class="show_result${rand1}"></span></p>
               </form>

            </div>
         </div>
      </div>
      <div class="tab-2 resp-tab-content tab-pane display_none" id="tab2-2" aria-labelledby="tab_item-1">
         <div class="facts">
            <div class="register">
               <form  action="${baseurl}registration" method="post" id="registration_form${rand2}"  class="registration_${rand2}" onsubmit="simplePost('${baseurl}registration', '.show_result${rand2}', '', '#registration_form${rand2}', '.show_result${rand2}' ); return false;" >
                      <input type="hidden" name="method" value="ajax" />
                   <input type="hidden" name="typelogin" value="${typeLogin!}" />
                   <input placeholder="${view.l('First Name')}" name="firstName" required="" type="text">
                   <input placeholder="${view.l('Last Name')}" name="lastName" required="" type="text">
                   <input placeholder="${view.l('Email Address')}" name="email" type="email" required="">
                   <input placeholder="${view.l('Password')}" name="password" type="password" required="">

                   <div class="sign-up">
                    <input type="submit" value="${view.l('Create an Account')}" />
                  </div>
                  <p> <span class="show_result${rand2}"></span></p>
               </form>
            </div>
         </div>
      </div>
      <div class="tab-3 resp-tab-content tab-pane display_none" id="tab3-3" aria-labelledby="tab_item-2">
         <div class="facts">
            <div class="register">
               <form action="${baseurl}reset-password" method="post" id="reset_pass${rand3}" class="reset_pass_${rand3}" onsubmit="simplePost('${baseurl}reset-password', '.show_result${rand3}', '', '#reset_pass${rand3}', '.show_result${rand3}' ); return false;">
                    <input name="email" placeholder="${view.l('Email Address')}" type="email" required=""/>
                   <div class="sign-up">
                     <input type="submit" value="${view.l('Reset password')}" />
                   </div>

                   <p> <span class="show_result${rand3}" ></span></p>
               </form>
            </div>
         </div>
      </div>
   </div>
  );
 }
}

export default RegistrationLoginForm;