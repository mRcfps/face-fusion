import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// import css
import './css/SelectScene.css';

// import picture
import bgHeader from './img/bgHeader.svg';
import back from './img/back.svg';

import scene1 from './img/scene1.svg';
import scene2 from './img/scene2.svg';
import scene3 from './img/scene3.svg';
import scene4 from './img/scene4.svg';
import scene5 from './img/scene5.svg';
import scene6 from './img/scene6.svg';
import scene7 from './img/scene7.svg';
import scene8 from './img/scene8.svg';
import scene9 from './img/scene9.svg';
import scene10 from './img/scene10.svg';

import tag1 from './img/tag1.svg';
import tag2 from './img/tag2.svg';
import tag3 from './img/tag3.svg';
import tag4 from './img/tag4.svg';
import tag5 from './img/tag5.svg';
import tag6 from './img/tag6.svg';

import footer from './img/footer.svg';

// import oss url
import { ossUrl } from '../util/';


export default class extends Component {

  render() {
    // construct recursive array
    const sceneClasses = [
      tag1,
      tag2,
      tag3,
      tag4,
      tag5,
      tag6,
    ];
    const scenes = [ 
      [ 
        scene8,
      ],  
      [
        scene7,
        scene6,
      ],
      [
        scene3,
        scene9,
      ],
      [
        scene10,
        scene4,
      ],
      [
        scene5,
      ],
      [
        scene2,
        scene1,
      ],
    ];

  // total number
  let totalNum = 0;
  const constructScene = sceneClasses.map((item, key) => {
    // construct image show in single scene
    const singleScene = scenes[key].map((sceneItem, sceneKey) => (

      <Link
        to={{
          pathname: '/homePage',

          // calculate the id in the img array
          state: { id: totalNum++ }
        }}
        key={sceneKey}
      >
        <img src={ossUrl + sceneItem} alt={`sceneItem-${sceneKey}`} className="sceneImg"/>
      </Link>
    ));
    
    return (
      <div className="scene" key={key}>
        <div className="tag">
          <div className="tagInner"><img src={ossUrl + item} alt={`item${key}`} className="tagItem"/></div>
          <div className="sceneShow">{singleScene}</div>
        </div>
      </div>
    )
  });

    return (
      <div id="selectScene">

        <div className="headerBg">
          <img src={ossUrl + bgHeader} alt="bgHeaderImg" className="bgHeaderImg" />
          <Link to="/"> <img src={ossUrl + back} alt="back" className="backImg" /> </Link>
        </div>

        {constructScene}

        <div className="selectFooter">
          <img src={ossUrl + footer} alt="footer" className="footerImg"/>
        </div>

      </div>
    );
  }
}
