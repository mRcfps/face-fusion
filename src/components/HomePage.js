import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import antd component
import { Upload, message, Spin, Icon } from 'antd';
import Swiper from 'swiper';
import './css/swiper.min.css';

// import upload file component
import PfUpload from './PfUpload';

// import jquery for better operation
import $ from 'jquery';

// import img
import back from './img/back.svg';
import download from './img/download.svg';
import upload from './img/upload.svg';
import hint from './img/hint.svg';

import bg1 from './img/bg1.svg';
import bg2 from './img/bg2.svg';
import bg3 from './img/bg3.svg';
import bg4 from './img/bg4.svg';
import bg5 from './img/bg5.svg';
import bg6 from './img/bg6.svg';
import bg7 from './img/bg7.svg';
import bg8 from './img/bg8.svg';
import bg9 from './img/bg9.svg';
import bg10 from './img/bg10.svg';

import bgHeaderImg1 from './img/bgHeader1.svg';
import bgHeaderImg2 from './img/bgHeader2.svg';
import bgHeaderImg3 from './img/bgHeader3.svg';
import bgHeaderImg4 from './img/bgHeader4.svg';
import bgHeaderImg5 from './img/bgHeader5.svg';
import bgHeaderImg6 from './img/bgHeader6.svg';

// import css for this page
import './css/HomePage.css';

// import handle face fusion api and oss api
import { faceFusion, ossUrl } from '../util/';

// construct bg array
const bgArray = [
  bg5,
  bg7,
  bg6,
  bg8,
  bg4,
  bg10,
  bg9,
  bg3,
  bg1,
  bg2,
];

// face fusion api
const faceFusionApi = [
  'youtu_69152_20171211171232_4210',
  'youtu_69152_20171211171337_4212',
  'youtu_69152_20171211171256_4211',
  'youtu_69152_20171211171450_4213',
  'youtu_69152_20171211171203_4209',
  'youtu_69152_20171211210519_4220',
  'youtu_69152_20171211210532_4221',
  'youtu_69152_20171211171101_4208',
  'youtu_69152_20171211171027_4206',
  'youtu_69152_20171211171042_4207',
];

export default class extends Component {
  state = {
    isUploading: false,
    isFusioning: false,
    fusionSuccess: false,
    fileList: [],
    count: 0,
    fusionedImg: '',
  };

  componentDidMount() {
    // id is the order about scene
    const { id } = this.props.location.state;
    const bgDom = $('.bg')[0];

    // add oss and file path
    // console.log('bg', `url(${bgArray[id]})`);
    // $(bgDom).css('background-image', `url(${bgArray[id]})`);

    this.swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 60,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows : true,
        },
    });
  }

  success = (msg) => {
    message.success(msg);
  }

  error = (msg) => {
    message.success(msg);
  }

  handleUpload = (imageData) => {
    // store that instance, for async function usage
    const that = this;

    // update the upload status to isLoading
    this.setState({ isFusioning: true });

    // id is the order about scene
    const { id } = this.props.location.state;

    // starting upload
    faceFusion(imageData, faceFusionApi[id], (err, imageUrl) => {
      console.log(err, imageUrl);
      if (!err && imageUrl.img_url) {
        // when success, replace background img
        this.handleReplaceBackground(imageUrl);
        this.success('融合成功！');
      } else {
        // else error, hint error message
        this.error('融合失败！请换一张图片');
      }

      // update the upload status to loaded
      that.setState({ isFusioning: false });
    });
  }

  handleReplaceBackground = (imageUrl) => {
    // let download icon can make effects
    this.setState({ fusionedImg: imageUrl.img_url });

    // get the bg dom, and replace background-image
    const bgDom = $('.bg')[0];
    $(bgDom).css('background-image', `url(${imageUrl.img_url})`);
  }

  handleError = () => {
    // if error, alert hint
    this.setState({ isUploading: false });
    this.error('无效的图片，请重新上传！');
  }

  handleSuccess = (res) => {
    // if success, alert hint
    this.success('上传图片成功！');
    this.setState({ isUploading: false });

    // take out base64 (data:image/jpeg;base64,) prefix
    const getBaseData = res.split(',')[1];

    // start upload
    this.handleUpload(getBaseData);
  }

  handleStartUpload = () => {
    this.setState({ isUploading: true, fusionSuccess: false });
  }

  render() {
    // the uploadIcon for the isUploading status 
    const uploadIcon = ( 
      <Icon 
        type="loading" 
        style={{ fontSize: 20, color: 'rgba(17, 17, 17, .6)' }} 
        spin />
    );

    // upload icon status judge
    const uploadStatusIcon = (
      (this.state.isUploading || this.state.isFusioning)
      ? ( <span className="isUploading"><Spin indicator={uploadIcon} /></span> )
      : ( <img src={upload} alt="upload button" className="uploadIcon"/> )
    );

    // upload text status judge
    let uploadText = '穿  越';
    const { isUploading, isFusioning, fusionedImg } = this.state;
    if (isUploading) {
      uploadText = '上传中...';
    }
    if (isFusioning) {
      uploadText = '融合中...';
    }

    return (
      <div className="homePage">
        <div className="headerBg">
          <img src={bgHeaderImg1} alt="bgHeaderImg" className="bgHeaderImg" />
          <Link to="/selectScene"> <div className="backImg"><img src={ossUrl + back} alt="back" /></div> </Link>
        </div>
        <div className="swiper-container">
          <div className="swiper-wrapper">
            <div className="swiper-slide" style={{
              backgroundImage: `url(${bg5})`
              }}></div>
            <div className="swiper-slide" style={{
              backgroundImage: `url(${bg2})`
              }}></div>
            <div className="swiper-slide" style={{
              backgroundImage: `url(${bg3})`
              }}></div>
          </div>
        </div>

        <div className="footerTool">

          <div className="upload">

            <PfUpload
              component="div"
              handleSuccess={this.handleSuccess}
              handleError={this.handleError}
              handleStartUpload={this.handleStartUpload}
            >

              <div className="innerUpload">
                { uploadStatusIcon }
                <span className="uploadText">{uploadText}</span>
              </div>

            </PfUpload>

          </div>

        </div>
      </div>
    );
  }
}

// { 
//   fusionedImg 
//   && ( 
//     <a href={fusionedImg} download="image.png">
//       <img src={ossUrl + download} alt="download button" className="downloadIcon"/>
//     </a>
//   )
// }
