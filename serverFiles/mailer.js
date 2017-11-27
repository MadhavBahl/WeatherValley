var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'proxxxxxxxxlley@gmail.com',
    pass: 'xxxxxxxx'
  }
});

var sendMail = (userInfo,callback) => {
  // console.log(userInfo);
  var send = `Hi ${userInfo.name}, \n
You have signed up for the Weather Valley.
Congratulations!! You are a part of WeatherValley,
Your Password is : "${userInfo.pass}". Please keep it safe and secret :) \n
REGARDS,
Madhav Bahl
Project Head,
Team WeatherValley`;

  var mailOptions = {
    from: 'PROJECT WEATHER VALLEY',
    to: userInfo.email,
    subject: 'Welcome To Weather Valley',
    text: send
  };

  transporter.sendMail(mailOptions,(err,info) => {
    if(err){
      return callback(err);
    } else {
      return callback(undefined, info.response);
    }
  });
}

module.exports = {sendMail}
