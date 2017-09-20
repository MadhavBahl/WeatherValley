var {mongoose} = require('./mongoose');
var {Pin} = require('./pinSchema');

var addData = (pincode,callback) => {
  var pin = new Pin(pincode);
  console.log(pin);
  pin.save().then((doc) => {
    console.log('Pincode was saved');
    return callback(undefined,doc);
  },(e) => {
    console.log('Couldnt save  the pincode');
    return callback(e);
  });
  // console.log(userInfo);
}

module.exports = {addData};
