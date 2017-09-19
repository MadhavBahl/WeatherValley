var request = require('request');

var getGeoLoc = (address,callback) => {
  var encodedAddress = encodeURIcomponent(address);
  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
    json: true
  },(err,response,body) => {
    if(err) callback('Unable To Connect To The Google Servers');
    else if(body.status === 'ZERO RESULTS') callback('Unable To Find The Searched Location');
    else if(body.status === 'OK') callback(undefined,{
      address: body.results[0].formatted_address,
      latitude: body.results[0].geometry.location.lat,
      longitude: body.results[0].geometry.location.lng
    });
  });
};

module.exports = {getGeoLoc};
