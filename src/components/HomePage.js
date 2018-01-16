import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fileSize from 'filesize';

// import antd component
import { Upload, message, Spin, Icon, Modal } from 'antd';
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

const headerImgArray = [
  bgHeaderImg1,
  bgHeaderImg2,
  bgHeaderImg3,
  bgHeaderImg4,
  bgHeaderImg5,
  bgHeaderImg6,
];

// construct bg array
const bgArray = [
  [
    bg5,
  ],
  [
    bg7,
    bg6,
  ],
  [
    bg8,
    bg4,
  ],
  [
    bg10,
    bg9,
  ],
  [
    bg3,
  ],
  [
    bg1,
    bg2,
  ]
];

// face fusion api
const faceFusionApi = [
  [
    'youtu_69152_20171211171232_4210',
  ],
  [
    'youtu_69152_20171211171337_4212',
    'youtu_69152_20171211171256_4211',
  ],
  [
    'youtu_69152_20171211171450_4213',
    'youtu_69152_20171211171203_4209',
  ],
  [
    'youtu_69152_20171211210519_4220',
    'youtu_69152_20171211210532_4221',
  ],
  [
    'youtu_69152_20171211171101_4208',
  ],
  [
    'youtu_69152_20171211171027_4206',
    'youtu_69152_20171211171042_4207',
  ],
];

export default class extends Component {
  state = {
    isUploading: false,
    isFusioning: false,
    activeScene: 0,
    fusionSuccess: false,
    fusionedImg: '',
    showModal: false,
    canDoFaceFusion: false,
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
        uploadedImg: '',
    });

    // use that trace the active swiper
    const that = this;
    this.swiper.on('slideChange', () => {
      that.setState({
        activeScene: this.swiper.activeIndex,
      });
    });
  }

  success = (msg, duration = 3) => {
    message.success(msg, duration);
  }

  error = (msg, duration = 3) => {
    message.error(msg, duration);
  }

  handleUpload = (imageData) => {
    // store that instance, for async function usage
    const that = this;

    // take out base64 (data:image/jpeg;base64,) prefix
    const getBaseData = imageData.split(',')[1];

    // update the upload status to isLoading
    this.setState({ isFusioning: true });

    // id is the order about scene
    const { id: dynastyMark } = this.props.location.state;
    const { activeScene } = this.state;

    // starting upload
    faceFusion(getBaseData, faceFusionApi[dynastyMark][activeScene], (err, imageUrl) => {
      console.log(err, imageUrl);
      if (!err && imageUrl.img_url) {
        // when success, replace background img
        that.setState({ 
          uploadedImg: imageUrl.img_url,
          fusionSuccess: true,
        });
        this.success('融合成功！');


        // replace the download link
        const downLoadBtn = $('.ant-modal-footer').find('.ant-btn')[1];
        $(downLoadBtn).html(`
          <a href="${imageUrl.img_url}" download="image.png">下载图片</a>
        `);
      } else {
        // else error, hint error message
        this.error('融合失败！请换一张图片');
      }

      // update the upload status to loaded
      that.setState({ isFusioning: false });
    });
  }

  handleError = () => {
    // if error, alert hint
    this.setState({ isUploading: false });
    this.error('无效的图片，请重新上传！');
  }

  handleSuccess = (res, file) => {
    // if success, alert hint
    this.success('上传图片成功！');
    this.setState({ isUploading: false });

    // detect this image size, when greater than 
    const detectFileSize = parseFloat(fileSize(file.size));
    if (detectFileSize > 500) {
      this.error('文件过大，请重新上传！', 10);
    }

    this.setState({
      uploadedImg: res,
      canDoFaceFusion:  detectFileSize < 500,
    });

    // start upload
    // this.handleUpload(getBaseData);
  }

  handleStartUpload = () => {
    this.setState({ 
      isUploading: true, 
      fusionSuccess: false,
      showModal: true,
    });
  }

  handleCancel = (e) => {
    this.setState({
      isUploading: false,
      isFusioning: false,
      activeScene: 0,
      fusionSuccess: false,
      fusionedImg: '',
      showModal: false,
      canDoFaceFusion: false,
    });

    // replace the download link
    const downLoadBtn = $('.ant-modal-footer').find('.ant-btn')[1];
    $(downLoadBtn).html('<span>开始融合</span>');
  }

  handleOk = () => {
    const { canDoFaceFusion, uploadedImg, fusionSuccess } = this.state;
    if (!canDoFaceFusion || !uploadedImg) {
      message.destory();
      this.error('对不起，照片不符合要求！', 3);
    } else if (fusionSuccess) {
      return 
    } else {
      this.handleUpload(uploadedImg);
    }
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

    // dynastyMark about this page.
    const { id: dynastyMark } = this.props.location.state;

    // upload text status judge
    let uploadText = '上传照片';
    const { isUploading, isFusioning, fusionedImg } = this.state;
    if (isUploading) {
      uploadText = '上传中...';
    }
    if (isFusioning) {
      uploadText = '融合中...';
    }


    // display image
    const needDisplayImg = this.state.isFusioning 
    ? (
      <Spin tip="融合中...">
        <img src={this.state.uploadedImg} alt="" style={{ display: "inline-block", width: "100%" }} />
      </Spin>
    )
    : (
      <img src={this.state.uploadedImg} alt="" style={{ display: "inline-block", width: "100%" }} />
    )

    return (
      <div className="homePage">
        <Modal
          visible={this.state.showModal}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          okText={this.state.fusionSuccess ? '下载图片' : '开始融合'}
        >
            {
              this.state.isUploading
              ? (
                <Spin tip="加载中...">
                </Spin>
              )
              : needDisplayImg
            }
        </Modal>
        <div className="headerBg">
          <img src={headerImgArray[dynastyMark]} alt="bgHeaderImg" className="bgHeaderImg" />
          <Link to="/selectScene"> <div className="backImg"><img src={ossUrl + back} alt="back" /></div> </Link>
        </div>
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {
              bgArray[dynastyMark].map((bgImage, key) => (
                <div 
                  key={key}
                  className="swiper-slide" 
                  style={{
                    backgroundImage: `url(${bgImage})`
                  }}
                ></div>
              ))
            }
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
