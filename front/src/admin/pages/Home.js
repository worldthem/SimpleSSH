import React from 'react'
import ReactDOM from 'react-dom'
//import AppNavbar from './../layouts/AppNavbar';
import { Link } from 'react-router-dom';


class Home extends React.Component {


  constructor(props) {
       super(props);
       this.state = {apiresponse : [], text: '', title: '',  isLoading: true}
 }

  async componentDidMount(){
        this.setState({isLoading: true });
        const response = await fetch(window.API_URL+'homepage');
        const data = await response.json();
        this.setState({text: data.text , isLoading: false});
        document.title = data.title;

        if(typeof data.css !== 'undefined' &&
                   data.css !== "" && data.css !== null){
           const $style = document.createElement("style");
           document.head.appendChild($style);
           $style.innerHTML = `${data.css}`;
         }
  }

  render() {
    return (
       <div>home admin


       </div>
    );
  }
}

export default Home;