var {mongoose} = require('./mongoose');
var {User} = require('./userSchema');

var addData = (userInfo,callback) => {
  var user = new User(userInfo);
  user.save().then((doc) => {
    return callback(undefined,doc);
  },(e) => {
    // console.log(e);
    return callback(e);
  });
  // console.log(userInfo);
}

module.exports = {addData};
