var {mongoose} = require('./mongoose');
var {User} = require('./userSchema');

var checkExistingUser = (userInfo,callback) => {
  console.log('Checking User: ',userInfo.email);
  var user = new User(userInfo);
  User.findOne({
    email: userInfo.email
  }).then((user) => {
    if(!user){
      return callback(undefined);
    } else {
      return callback(user);
    }
  })
};

module.exports = {checkExistingUser};
