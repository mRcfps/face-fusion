import React, { Component } from 'react';
// import router function
import { Link } from 'react-router-dom';

// import image
import bgHeader from './img/bgHeader7.svg';
import back from './img/back.svg';
import book from './img/book.svg';
import bookContent from './img/bookContent.svg';

// import css
import './css/IntroBook.css';

import { ossUrl } from '../util/';

export default class IntroBook extends Component {
  handleClick = () => {
    const location = this.props.location;
    console.log('location', location);
  }

  render() {
    const { from } = this.props.location.state;
    return (
      <div id="introBook">
        <div className="headerBg">
          <img src={ossUrl + bgHeader} alt="bgHeaderImg" className="bgHeaderImg" />
          <Link to={from}><div className="backImg" onClick={this.handleClick}><img src={ossUrl + back} alt="back" /></div></Link>
        </div>
        <div className="introContent">
          <img src={ossUrl + book} alt="bookContent" className="book"/>
          <img src={ossUrl + bookContent} alt="bookContent"/>
        </div>
      </div>
    );
  }
}
