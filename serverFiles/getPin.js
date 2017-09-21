var {mongoose} = require('./mongoose');
var {Pin} = require('./pinSchema');

var fetchpin = (callback) => {
  Pin.find().then((result) => {
    console.log(result);
    return callback(undefined,result);
  },(e) => {
    console.log(e);
    return callback(e);
  });
};

module.exports = {fetchpin}
