import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// import css
import './css/SelectScene.css';

// import picture
import bgHeader from './img/bgHeader.svg';
import back from './img/back.png';
import tagMan from './img/tagMan.svg';
import tagWoman from './img/tagWoman.svg';
import scene1 from './img/scene1.svg';
import scene2 from './img/scene2.svg';
import footer from './img/footer.svg';


export default class extends Component {

  render() {
    const sceneClasses = [ tagWoman, tagMan ];
    const scenes = [ 
      [ 
        scene1,
      ],  
      [
        scene2,
      ],
    ];


    const constructScene = sceneClasses.map((item, key) => {
      // construct image show in single scene
      const singleScene = scenes[key].map((sceneItem, sceneKey) => (
          <Link
            to={{
              pathname: '/homePage',

              // calculate the id in the img array
              state: { id: (scenes[key].length * key) + sceneKey }
            }}
          >
            <img src={sceneItem} alt={`sceneItem-${sceneKey}`} className="sceneImg"/>
          </Link>
      ));

      // for different status render different classname
      const tagClass = classNames({
        tagMan: (key === 1) ? true : false,
      });
      
      return (
        <div className="scene">
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
          <img src={bgHeader} alt="bgHeaderImg" className="bgHeaderImg"/>
          <Link to="/"><img src={back} alt="back" className="backImg"/></Link>
        </div>
        {constructScene}
        <div className="selectFooter">
          <img src={footer} alt="footer" className="footerImg"/>
        </div>
      </div>
    );
  }
}
