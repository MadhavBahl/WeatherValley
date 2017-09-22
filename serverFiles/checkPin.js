var {mongoose} = require('./mongoose');
var {Pin} = require('./pinSchema');

var checkExistingPin = (pincode,callback) => {
  console.log('Checking Pin: ',pincode);
  // var pin = new Pin({pincode});
  Pin.findOne({
    pin: pincode
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
