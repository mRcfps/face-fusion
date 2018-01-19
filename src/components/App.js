import React from 'react';
import { Upload, Icon, Modal, Button, Spin } from 'antd';

// import css
import './css/App.css';

// import img
import title from './img/title.svg';
import content from './img/content.svg';
import header from './img/header.svg';
import btn from './img/btn.svg';
import bgApp from './img/bgApp.jpg';
import footer from './img/footer.svg';

// import oss url
import { ossUrl } from '../util/';

// import router function
import { Link } from 'react-router-dom';

// import jquery for better operation
import $ from 'jquery';

class App extends React.Component {
  componentDidMount() {
    // get the bg dom, and replace background-image
    const bgDom = $('.bg')[0];
    $(bgDom).css('background-image', `url(${ossUrl + bgApp})`);
  }

  render() {
    return (
      <div id="app">
        <div className="bg"></div>
        <div className="title">
          <img src={ossUrl + title} alt="title" className="titleImg"/>
        </div>
        <div className="content">
          <img src={ossUrl + content} alt="content" className="contentImg"/>
          <img src={ossUrl + header} alt="header" className="headerImg"/>
        </div>
        <div className="footer">
          <Link to="/selectScene"><img src={ossUrl + btn} alt="btn" className="btnImg" onClick={this.handleClick}/></Link>
        </div>

        <div className="selectFooter">
          <Link to="/introBook"><img src={ossUrl + footer} alt="footer" className="footerImg"/></Link>
        </div>
      </div>
    );  
  }
}

export default App;
