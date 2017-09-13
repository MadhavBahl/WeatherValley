var mongoose = require('mongoose');

var User = mongoose.model('User',{
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  mobile: {
    type: Number,
    required: true,
    min: [7, 'Enter a valid Phone number'],
    max: 11
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
