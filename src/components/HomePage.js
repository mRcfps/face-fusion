// import wide-holding fetch api
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fileSize from 'filesize';
import browserImageSize from 'browser-image-size';
import Cropper from 'cropperjs';
import Swiper from 'swiper/dist/js/swiper.min.js';
import './css/swiper.min.css';

import createHistory from "history/createBrowserHistory"

// import antd component
import { Upload, message, Spin, Icon, Modal, Alert } from 'antd';

// import upload file component
import PfUpload from './PfUpload';

// import jquery for better operation
import $ from 'jquery';

// convert to base64
import base64 from 'base-64';

// import img
import back from './img/back.svg';
import download from './img/download.svg';
import upload from './img/upload.svg';
import hint from './img/hint.svg';

import bg1 from './img/bg1.jpg';
import bg2 from './img/bg2.jpg';
import bg3 from './img/bg3.jpg';
import bg4 from './img/bg4.jpg';
import bg5 from './img/bg5.jpg';
import bg6 from './img/bg6.jpg';
import bg7 from './img/bg7.jpg';
import bg8 from './img/bg8.jpg';
import bg9 from './img/bg9.jpg';
import bg10 from './img/bg10.jpg';

// import css for this page
import './css/HomePage.css';

// import handle face fusion api and oss api
import { faceFusion, ossUrl } from '../util/';

require('es6-promise').polyfill();
require('isomorphic-fetch');


// create history
export const history = createHistory();

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
    'youtu_68981_20180109220002_5759',
  ],
  [
    'youtu_68981_20180109220023_5762',
    'youtu_68981_20180113163914_5920',
  ],
  [
    'youtu_68981_20180109220032_5764',
    'youtu_68981_20180109215952_5757',
  ],
  [
    'youtu_68981_20180109220049_5766',
    'youtu_68981_20180109220041_5765',
  ],
  [
    'youtu_68981_20180109215941_5756',
  ],
  [
    'youtu_68981_20180109215910_5754',
    'youtu_68981_20180109215929_5755',
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
    imageDimensions: null,
    takeOutWaterMark: false,
    isTakingOutWaterMark: false,
    takeOutWaterMarkSuccess: false,
  };

  componentDidMount() {
    // id is the order about scene
    const { id: dynastyMark } = this.props.location.state;
    

    console.log('face', faceFusionApi[dynastyMark]);
    if (faceFusionApi[dynastyMark].length > 1) {
      // id is the order about scene
    this.success('左右滑动能够选择不同的场景哦😯', 4);
    }

    this.swiper = new Swiper('.swiper-container', {
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    // use that trace the active swiper
    const that = this;
    this.swiper.on('slideChange', () => {
      console.log('this.swiper.activeIndex', this.swiper.activeIndex);
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
    console.log('activeScene', activeScene);
    
    console.log('face', faceFusionApi[dynastyMark][activeScene]);

    // starting upload
    faceFusion(getBaseData, faceFusionApi[dynastyMark][activeScene], async (err, imageUrl) => {
      console.log(err, imageUrl);
      if (!err && imageUrl.img_url) {

        // when success, replace background img
        that.setState({ 
          fusionSuccess: true,
          uploadedImg: imageUrl.img_url,
        });

        this.success('融合成功！');
        
        
        // replace the download link
        const downLoadBtn = $('.mainModal .ant-modal-footer').find('.ant-btn')[1];
        $(downLoadBtn).html(`
          <a href="${imageUrl.img_url}" download="image.png">下载图片</a>
        `);

        const modalFooterDiv = $('.mainModal .ant-modal-footer').find('div')[0];
        $(modalFooterDiv).append(
          '<button type="button" class="ant-btn ant-btn-primary" id="removeWaterMark"><span>去水印</span></span></button>'
        );

        $('#removeWaterMark').click(() => {
          console.log('click');
          that.setState({
            takeOutWaterMark: true,
          });
        });
      } else {
        // else error, hint error message
        if (err.ret === "1000") {
          this.error('未识别到人脸！请换一张图片哟');
        }

        if (err.ret === "-1000") {
          this.error('参数错误！请换一张图片哟');
        }

        if (err.ret === "-1001") {
          this.error('图像处理错误！请换一张图片哟');
        }
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
      this.error('啊哦😯！文件过大，建议上传500KB以内的图片哦', 10);
    }

    this.setState({
      uploadedImg: res,
      canDoFaceFusion:  detectFileSize < 500,
    });

    // start upload
    // this.handleUpload(getBaseData);
  }

  handleStartUpload = () => {
    console.log('start');
    this.setState({ 
      isUploading: true, 
      fusionSuccess: false,
      showModal: true,
      isFusioning: false,
      fusionSuccess: false,
      fusionedImg: '',
      canDoFaceFusion: false,
      takeOutWaterMark: false,
      takeOutWaterMarkSuccess: false,
      isTakingOutWaterMark: false,
    });

    $('#removeWaterMark').remove()

    // replace the download link
    const downLoadBtn = $('.ant-modal-footer').find('.ant-btn')[1];
    $(downLoadBtn).html('<span>开始融合</span>');
  }

  handleCancel = (e) => {
    this.setState({
      showModal: false,
    });
  }

  handleClose = () => {
    this.setState({
      isUploading: false,
      isFusioning: false,
      fusionSuccess: false,
      fusionedImg: '',
      showModal: false,
      canDoFaceFusion: false,
      takeOutWaterMark: false,
      takeOutWaterMarkSuccess: false,
      isTakingOutWaterMark: false,
    });

    // replace the download link
    const downLoadBtn = $('.ant-modal-footer').find('.ant-btn')[1];
    $(downLoadBtn).html('<span>开始融合</span>');
  }

  handleOk = () => {
    const { canDoFaceFusion, uploadedImg, fusionSuccess, takeOutWaterMarkSuccess } = this.state;
    if (!canDoFaceFusion || !uploadedImg) {
      this.error('对不起，照片不符合要求！', 3);
    } else if (fusionSuccess) {
      if (takeOutWaterMarkSuccess) {
        this.success('长按图片可以保存哟😝');
      } else {
        return;
      }
    } else {
      this.handleUpload(uploadedImg);
    }
  }

  handleProcessed = (err, src) => {
    
    this.setState({
      uploadedImg: src,
    });
  }

  handleWaterCancel = (e) => {
    this.setState({
      takeOutWaterMark: false,
    });
  }

  getCutOfImage = async () => {
  }

  handleWaterOk = async (e) => {
    const { uploadedImg } = this.state;

    this.setState({
      isTakingOutWaterMark: true,
    });

    const options = {
      method: 'POST',
      body: JSON.stringify({
        image: uploadedImg,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // save this state of that
    const that = this;
    console.log('uploadedImg', uploadedImg);

    console.log('options', options);
    console.log('fetch', fetch)

    try {
      const response = await fetch('http://antiwatermark.avosapps.us/', options)
      
      console.log('response', response);
      // ReadableStream convert to Blob
      const buffer = await response.blob();

      // filereader for convert blob to base64
      const reader = new FileReader();
      reader.onload = () => {
        // get the base64 result 
        const result = reader.result;
        that.setState({
          uploadedImg: result,
          takeOutWaterMark: false,
          isTakingOutWaterMark: false,
          takeOutWaterMarkSuccess: true,
        });

        this.success('去水印成功！长按图片下载您的穿越照片！', 10);
        // replace the download link
        const downLoadBtn = $('.mainModal .ant-modal-footer').find('.ant-btn')[1];
        $(downLoadBtn).html('<span>下载图片</span>');
      }

      // start uploadfile and convert to base64
      reader.readAsDataURL(buffer);

    } catch (e) {
      console.log('e', e);
      this.error('很遗憾！去水印失败 = =');
      that.setState({
        takeOutWaterMark: false,
        isTakingOutWaterMark: false,
        takeOutWaterMarkSuccess: false,
      });
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
      : ( <img src={ossUrl + upload} alt="upload button" className="uploadIcon"/> )
    );

    // dynastyMark about this page.
    const { id: dynastyMark } = this.props.location.state;

    // upload text status judge
    let uploadText = '上传照片';
    const { 
      isUploading, 
      isFusioning, 
      fusionedImg, 
      fusionSuccess, 
      imageDimensions,
      takeOutWaterMark, 
      showModal,
      isTakingOutWaterMark,
    } = this.state;
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
        <img src={this.state.uploadedImg} alt="" style={{ display: "inline-block", width: "100%", maxWidth: "100%", height: '100%' }} id="fushionedImg" />
      </Spin>
    )
    : (
      <img src={this.state.uploadedImg} alt="" style={
        { display: "inline-block", width: "100%", maxWidth: "100%", height: '100%', zIndex: 1000 }
      } id="fushionedImg" />
    );

    const cutWaterMarkMessage = (
      <Alert
        message="这是一条需要注意的消息"
        description="去水印花费的时间比较长，一般5-10秒左右，亲可以坐下来喝杯茶哟~"
        type="warning"
      />
    );

    // display cutwatermark
    const selectCutWaterMarkMessage = isTakingOutWaterMark
    ? (
      <Spin tip="去除水印中...">
        {cutWaterMarkMessage}
      </Spin>
    )
    : cutWaterMarkMessage;

    return (
      <div className="homePage">
        <Modal
          visible={takeOutWaterMark}
          closable={false}
          wrapClassName="waterMarkModal"
          onCancel={this.handleWaterCancel}
          cancelText="取消"
          onOk={this.handleWaterOk}
          okText="确认去除"
        >
          {selectCutWaterMarkMessage}
        </Modal>
        <Modal
          visible={showModal}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          afterClose={this.handleClose}
          closable={false}
          wrapClassName="mainModal"
          cancelText="取消"
          okText={fusionSuccess ? '下载图片' : '开始融合'}
        >
          <div className="uploadBox">
          {
            this.state.isUploading
            ? (
              <Spin tip="加载中...">
              </Spin>
            )
            : needDisplayImg
          }
          </div>
        </Modal>
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {
              bgArray[dynastyMark].map((bgImage, key) => (
                <div 
                  key={key}
                  className="swiper-slide" 
                  style={{
                    backgroundImage: `url(${ossUrl + bgImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100%',
                  }}
                ></div>
              ))
            }
          </div>
          <div className="swiper-pagination"></div>
        </div>
          <Link to="/selectScene"> <div className="backImg"><img src={ossUrl + back} alt="back" /></div> </Link>

        <div className="footerTool">

          <div className="upload">

            <PfUpload
              component="div"
              handleSuccess={this.handleSuccess}
              handleError={this.handleError}
              handleStartUpload={this.handleStartUpload}
              disabled={false}
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
