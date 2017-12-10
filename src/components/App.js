import React from 'react';
import { Upload, Icon, Modal, Button, Spin } from 'antd';

// import css
import './css/App.css';

// import img
import title from './img/title.svg';
import content from './img/content.svg';
import header from './img/header.svg';
import btn from './img/btn.svg';

// import oss url
import { ossUrl } from '../util/';

// import router function
import { Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <div id="app">
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
      </div>
    );  
  }
}

export default App;
