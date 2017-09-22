var {mongoose} = require('./mongoose');
var {Pin} = require('./pinSchema');
var {getGeoLoc} = require('./googleGeo');

var addData = (pincode,callback) => {
  console.log('Inside addPin pin:',pincode);
  getGeoLoc(pincode,(err,location) => {
    if(err) {
      return console.log(err);
    }
    console.log('Location: ',location);
    var locData = {
      pin: pincode,
      lat: location.latitude,
      lng: location.longitude,
      address: location.address
    };
    console.log('LocData: ',locData);

    var pin = new Pin(locData);
    console.log(pin);
    pin.save().then((doc) => {
      console.log('Pincode was saved');
      return callback(undefined,doc);
    },(e) => {
      console.log('Couldnt save  the pincode');
      return callback(e);
    });
  })


  // console.log(userInfo);
}

module.exports = {addData};
