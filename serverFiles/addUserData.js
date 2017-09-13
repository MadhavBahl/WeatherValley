var {mongoose} = require('./mongoose');
var {User} = require('./userSchema');

var addData = (userInfo) => {
  // var user = new User({
  //   // name:
  // });
  // add.save().then((doc) => {
  //   // res.send(200)
  //   console.log(doc);
  // },(e) => {
  //   console.log(e);
  // });
  console.log(userInfo);
}

module.exports = {addData};
