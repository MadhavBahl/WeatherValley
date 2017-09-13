var mongoose = require('mongoose');

var User = mongoose.model('User',{
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  mobile: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  pass: {
    type: String,
    required: true
  }
});

module.exports = {User};
