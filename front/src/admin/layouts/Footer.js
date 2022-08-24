import React, { Component } from 'react';
import { ConfigVarContext} from './../../context/ConfigVarContext';
import IconsPopup from './IconsPopup';
class Footer extends Component {

static contextType = ConfigVarContext;

_header1 =  (dataArray1) => {
      return this.context[dataArray1];
  };

 render() {
   return (<>
    <IconsPopup/>
         <div dangerouslySetInnerHTML={{__html: this._header1('_footer_')}} />

    </>
   );
 }

}

export default Footer;