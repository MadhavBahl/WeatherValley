var {mongoose} = require('./mongoose');
var {Weather} = require('./weatherSchema');

var fetchWeatherFromDB = (callback) => {
  Weather.find().then((result) => {
    // console.log(result);
    return callback(undefined,result);
  },(e) => {
    console.log(e);
    return callback(e);
  });
};

module.exports = {fetchWeatherFromDB}
