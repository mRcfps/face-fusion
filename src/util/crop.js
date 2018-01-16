const sharp = require('sharp');
const sizeOf = require('image-size');

// image cropping parameters
const WIDTH_CROP_RATIO = 0.9;
const HEIGHT_CROP_RATIO = 0.82;

exports.cropImage = (image, callback) => {
  // get the demensions of the original image
  const origDimensions = sizeOf(image);

  // calculate the width and height of the cropped image
  const croppedWidth = Math.round(origDimensions.width * WIDTH_CROP_RATIO);
  const croppedHeight = Math.round(origDimensions.height * HEIGHT_CROP_RATIO);

  sharp(image)
    .resize(croppedWidth, croppedHeight)
    .crop(sharp.gravity.north)
    .toBuffer()
    .then(data => callback(null, data))
    .catch(err => callback(err));
};
