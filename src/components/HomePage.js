import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import antd component
import { Upload, message, Spin, Icon } from 'antd';

// import upload file component
import PfUpload from './PfUpload';

// import jquery for better operation
import $ from 'jquery';

// import img
import back from './img/back.svg';
import download from './img/download.svg';
import upload from './img/upload.png';
import hint from './img/hint.svg';

import bg1 from './img/bg1.png';
import bg2 from './img/bg2.png';
import bg3 from './img/bg3.png';
import bg4 from './img/bg4.png';
import bg5 from './img/bg5.png';
import bg6 from './img/bg6.png';
import bg7 from './img/bg7.png';
import bg8 from './img/bg8.png';
import bg9 from './img/bg9.png';
import bg10 from './img/bg10.png';

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
    const { id } = this.props.location.state;
    const bgDom = $('.bg')[0];
    // add oss and file path
    console.log('bg', `url(${bgArray[id]})`);
    $(bgDom).css('background-image', `url(${bgArray[id]})`);
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

    // starting upload
    faceFusion(imageData, 'cf_lover_fanli', (err, imageUrl) => {
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
    let uploadText = '上传头像';
    const { isUploading, isFusioning, fusionedImg } = this.state;
    if (isUploading) {
      uploadText = '上传中...';
    }
    if (isFusioning) {
      uploadText = '融合中...';
    }

    return (
      <div className="homePage">

        <div className="bg"></div>

        <div className="footerTool">

          <Link to="/selectScene">
            <img src={back} alt="back button" className="backIcon"/>
          </Link>

          <div className="upload">

            <PfUpload
              component="div"
              handleSuccess={this.handleSuccess}
              handleError={this.handleError}
              handleStartUpload={this.handleStartUpload}
            >

              <div className="innerUpload">
                <span className="uploadText">{uploadText}</span>
                { uploadStatusIcon }
              </div>

            </PfUpload>

          </div>

          { 
            fusionedImg 
            && ( 
              <a href={fusionedImg} download="image.png">
                <img src={download} alt="download button" className="downloadIcon"/>
              </a>
            )
          }

        </div>
      </div>
    );
  }
}
