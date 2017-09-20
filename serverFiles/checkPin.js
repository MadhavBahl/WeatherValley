var {mongoose} = require('./mongoose');
var {Pin} = require('./pinSchema');

var checkExistingPin = (pincode,callback) => {
  console.log('Checking Pin: ',pincode.pin);
  var pin = new Pin(pincode);
  Pin.findOne({
    pin: pincode.pin
  }).then((pinMain) => {
    if(!pinMain){
      console.log('Pincode does not exists');
      return callback(undefined);
    } else {
      console.log('Pincode already exists')
      return callback('yes');
    }
  });
};

module.exports = {checkExistingPin};
