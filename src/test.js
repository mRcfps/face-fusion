var fs = require('fs');
var fusion = require('./fusion');

fusion.faceFusion(fs.readFileSync('/Users/mRc/Downloads/weige.jpg').toString('base64'), 'cf_fuwa_yasuiqian', function (success, imageUrl) {
  if (success) {
      console.log(imageUrl);
  }
});
