var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:ben10000@ds139904.mlab.com:39904/weathervalley');

module.exports = {mongoose};
