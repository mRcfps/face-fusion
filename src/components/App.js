import React from 'react';
import { Upload, Icon, Modal, Button, Spin } from 'antd';

// import css
import './css/App.css';

// import img
import title from './img/title.svg';
import content from './img/content.svg';
import header from './img/header.svg';
import btn from './img/btn.svg';

class App extends React.Component {

  render() {
    return (
      <div id="app">
        <div className="title">
          <img src={title} alt="title" className="titleImg"/>
        </div>
        <div className="content">
          <img src={content} alt="content" className="contentImg"/>
          <img src={header} alt="header" className="headerImg"/>
        </div>
        <div className="footer">
          <img src={btn} alt="btn" className="btnImg"/>
        </div>
      </div>
    );  
  }
}

export default App;
