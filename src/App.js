import React from 'react';
import { Upload, Icon, Modal, Button, Spin } from 'antd';
import { faceFusion } from './fusion';
import 'antd/dist/antd.css';
import './css/App.css';

class App extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    isFusion: false,
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  handleClick = () => {
    const that = this;
    const { fileList } = this.state;
    const image = fileList[0];
    console.log('image', image);
    this.setState({
      isFusion: true,
    });

    faceFusion(image.thumbUrl.split(',')[1], 'cf_lover_libai', (data) => {
      console.log('data', data);
      that.setState({
        previewImage: data.img_url,
        isFusion: false,
      });
    });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="app">
        <div className="container">
          <div className="upload">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
          </div>
          <div className="loading">
            {
              this.state.isFusion
              && (
                <Spin tip="加载中..."></Spin>
              )
            }  
          </div>
          <div className="fusionBtn">
            <Button onClick={this.handleClick} type="dashed">开始融合</Button>
          </div>
          <div className="result">
            {
              previewImage 
              && (
                <img src={previewImage} alt="hhh" className="resultImg"/>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
