import React from 'react';
import { message } from 'antd';

// import css
import './css/App.css';

// import img
import title from './img/title.svg';
import content from './img/content.svg';
import header from './img/header.svg';
import header1 from './img/header1.svg';
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
  state = {
    headerImg: header,
  };

  success = (msg, duration = 3) => {
    message.success(msg, duration);
  }

  async componentDidMount() {
    const that = this;
    const clicked = await localStorage.getItem('clicked');
    if (clicked) {
      that.setState({
        headerImg: header1,
      });
    }

    // get the bg dom, and replace background-image
    const bgDom = $('.bg')[0];
    $(bgDom).css('background-image', `url(${ossUrl + bgApp})`);
  }

  handleClick = () => {
    this.success('哈哈哈哈，多谢赞赏😝！');
    this.setState({
      headerImg: header1,
    });

    localStorage.setItem('clicked', true);
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
          <img src={this.state.headerImg} alt="header" className="headerImg" onClick={this.handleClick}/>
        </div>
        <div className="footer">
          <Link to="/selectScene"><img src={ossUrl + btn} alt="btn" className="btnImg" onClick={this.handleClick}/></Link>
        </div>

        <div className="selectFooter">
          <Link to={{
            pathname: "/introBook",
            state: { from: '/' }
          }}><img src={ossUrl + footer} alt="footer" className="footerImg"/></Link>
        </div>
      </div>
    );  
  }
}

export default App;
