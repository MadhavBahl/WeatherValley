var mongoose = require('mongoose');

var Pin = mongoose.model('pin',{
  pin: {
    type: String,
    required: true
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  },
  address: {
    type: String
  }
});

module.exports = {Pin};
