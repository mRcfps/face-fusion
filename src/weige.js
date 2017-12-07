var fs = require('fs');
var fusion = require('./fusion');

fusion.faceFusion(fs.readFileSync('/Users/pftom/Desktop/weige.jpg').toString('base64'), 'cf_fuwa_yasuiqian', function (content) {
  console.log(content);
});
