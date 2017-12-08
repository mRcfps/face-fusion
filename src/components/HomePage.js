import React, { Component } from 'react';

// import antd component
import { Upload } from 'antd';

// import img
import background from './img/background.png';
import back from './img/back.png';
import download from './img/download.png';
import upload from './img/upload.png';

// import css for this page
import './css/HomePage.css';

// import handle face fusion api
import { faceFusion } from '../util/fusion';

export default class extends Component {
  state = {
    isUploading: false,
  };

  handleUpload = (imageData) => {
    // store that instance, for async function usage
    const that = this;

    // update the upload status
    this.setState({ isUploading: true });

    // starting upload
    faceFusion(imageData, 'isUploading', (err, imageUrl) => {
      if (!err) {
        // when success, replace background img
        this.handleReplaceBackground(imageUrl);
      } else {
        // else error, hint error message
        switch (err) {
          
        }
      }
    })
  }

  handleChange = ({ fileList }) => {
    // start upload this image file to the faceFusion sdk
    // split the base64 data from the 
    const file = fileList[0];
    const imageData = file.thumbUrl.split(',')[1];
    this.handleUpload(imageData);
  }

  render() {

    return (
      <div className="homePage">
        <div className="bg"></div>
        <div className="footerTool">
            <img src={back} alt="back button" className="backIcon"/>
            <div className="upload">
              <Upload
                listType="picture"
                onChange={this.handleChange}
                beforeUpload={this.beforeUpload}
              >
                <div className="innerUpload">
                  <span className="uploadText">上传头像</span>
                  <img src={upload} alt="upload button" className="uploadIcon"/>
                </div>
              </Upload>
            </div>
            <img src={download} alt="download button" className="downloadIcon"/>
        </div>
      </div>
    );
  }
}
