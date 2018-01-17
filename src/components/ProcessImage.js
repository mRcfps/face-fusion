import React, { Component } from 'react';
import browserImageSize from 'browser-image-size';
import ProcessImage from 'react-imgpro';

export default class ProcessImageComp extends Component {


  render() {
    const { image, imageDimensions } = this.props;
    const { width, height } = imageDimensions;
    // image cropping parameters

    return (
      <ProcessImage
        image={image}
        resize={{ 
          width: 100,
          height: 100,
        }}
        processedImage={(src, err) => this.props.handleProcessed(err, src)}
      />
    );
  }
}
