import React, { Component } from 'react';

// import css
import './css/SelectScene.css';

// import picture
import bgHeader from './img/bgHeader.svg';
import back from './img/back.png';
import tagMan from './img/tagMan.svg';
import tagWoman from './img/tagWoman.svg';
import scene1 from './img/scene1.svg';
import scene2 from './img/scene2.svg';


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
          <img src={sceneItem} alt={`sceneItem-${sceneKey}`} className="sceneImg"/>
      ));
      
      return (
        <div className="scene">
          <div className="tag">
            <img src={item} alt={`item${key}`} className="tagWoman"/>
            <div className="sceneShow">{singleScene}</div>
          </div>
        </div>
      )
    });

    return (
      <div id="selectScene">
        <div className="headerBg">
          <img src={bgHeader} alt="bgHeaderImg" className="bgHeaderImg"/>
          <img src={back} alt="back" className="backImg"/>
        </div>

        {constructScene}
      </div>
    );
  }
}
