import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// import css
import './css/SelectScene.css';

// import picture
import bgHeader from './img/bgHeader.svg';
import back from './img/back.png';

import scene1 from './img/scene1.png';
import scene2 from './img/scene2.png';
import scene3 from './img/scene3.png';
import scene4 from './img/scene4.png';
import scene5 from './img/scene5.png';
import scene6 from './img/scene6.png';
import scene7 from './img/scene7.png';
import scene8 from './img/scene8.png';
import scene9 from './img/scene9.png';
import scene10 from './img/scene10.png';

import tag1 from './img/tag1.png';
import tag2 from './img/tag2.png';
import tag3 from './img/tag3.png';
import tag4 from './img/tag4.png';
import tag5 from './img/tag5.png';
import tag6 from './img/tag6.png';

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
        scene6,
        scene7,
      ],
      [
        scene3,
        scene9,
      ],
      [
        scene4,
        scene10,
      ],
      [
        scene5,
      ],
      [
        scene1,
        scene2,
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
        <img src={sceneItem} alt={`sceneItem-${sceneKey}`} className="sceneImg"/>
      </Link>
    ));

    // for different status render different classname
    const tagClass = classNames({
      tagMan: (key %2 === 1) ? true : false,
    });
    
    return (
      <div className="scene" key={key}>
        <div className="tag">
          <div className={tagClass}><img src={item} alt={`item${key}`} className="tagWoman"/></div>
          <div className="sceneShow">{singleScene}</div>
        </div>
      </div>
    )
  });

    return (
      <div id="selectScene">

        <div className="headerBg">
          <img src={bgHeader} alt="bgHeaderImg" className="bgHeaderImg" />
          <Link to="/"> <img src={back} alt="back" className="backImg" /> </Link>
        </div>

        {constructScene}

        <div className="selectFooter">
          <img src={footer} alt="footer" className="footerImg"/>
        </div>

      </div>
    );
  }
}
