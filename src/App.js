import React from 'react';
import { Upload, Icon, Modal } from 'antd';
import { faceFusion } from './fusion';
import 'antd/dist/antd.css'

class App extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
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

    faceFusion(image.thumbUrl.split(',')[1], 'cf_fuwa_yasuiqian', (data) => {
      console.log('data', data);
      that.setState({
        previewImage: data.img_url,
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
      <div className="clearfix">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        {
          previewImage && <img src={previewImage} alt="hhh" />
        }
        <button onClick={this.handleClick}>开始融合</button>
      </div>
    );
  }
}

export default App;
