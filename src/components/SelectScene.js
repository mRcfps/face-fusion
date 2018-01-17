import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// import css
import './css/SelectScene.css';

// import picture
import bgHeader from './img/bgHeader.svg';
import back from './img/back.svg';

import selectScene1 from './img/selectScene1.svg';
import selectScene2 from './img/selectScene2.svg';
import selectScene3 from './img/selectScene3.svg';
import selectScene4 from './img/selectScene4.svg';
import selectScene5 from './img/selectScene5.svg';
import selectScene6 from './img/selectScene6.svg';

import footer from './img/footer.svg';

// import oss url
import { ossUrl } from '../util/';


export default class extends Component {

  render() {
    // construct recursive array
    const sceneClasses = [
      selectScene1,
      selectScene2,
      selectScene3,
      selectScene4,
      selectScene5,
      selectScene6,
    ];

  // total number
  let totalNum = 0;
  const constructScene = sceneClasses.map((item, key) => {
    // construct image show in single scene

    const singleScene = (
      <Link
        to={{
          pathname: '/homePage',

          // calculate the id in the img array
          state: { id: totalNum++ }
        }}
        key={key}
      >
        <img src={item} alt={`sceneClasses-${key}`} className="sceneImg"/>
      </Link>
    );
    
    return (
      <div className="scene" key={key}>
        <div className="tag">
          <div className="sceneShow">{singleScene}</div>
        </div>
      </div>
    )
  });

    return (
      <div id="selectScene">

        <div className="headerBg">
          <img src={bgHeader} alt="bgHeaderImg" className="bgHeaderImg" />
          <Link to="/"> <div className="backImg"><img src={ossUrl + back} alt="back" /></div> </Link>
        </div>

        {constructScene}

        <div className="selectFooter">
          <img src={ossUrl + footer} alt="footer" className="footerImg"/>
        </div>
      </div>
    );
  }
}
