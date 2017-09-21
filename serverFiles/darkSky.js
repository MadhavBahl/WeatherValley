var request = require('request');

var getWeather = (lat,lng,callback) => {
  request({
    url: `https://api.darksky.net/forecast/f1d413224992adae584dd90b72f51905/${lat},${lng}`,
    json: true
  },(error,response,body) => {

    if(error)  callback('Unable to connect to forecast.io servers');
    else if(response.code) callback('Invalid location, ERROR:',response.code);
    else{
      var returnObj ={
        lat: response.body.latitude,
        lng: response.body.longitude,
        forecast: response.body.daily
      };
      callback(undefined,returnObj);
    }
  })
}

module.exports = {getWeather};
