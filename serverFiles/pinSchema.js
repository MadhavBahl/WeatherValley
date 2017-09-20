var mongoose = require('mongoose');

var Pin = mongoose.model('pin',{
  pin: {
    type: String,
    required: true
  }
});

module.exports = {Pin};
