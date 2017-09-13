var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var mailer = require('./serverFiles/mailer');
var addUserData = require('./serverFiles/addUserData');
// var {mongoose} = require('./serverFiles/mongoose');
var {User} = require('./serverFiles/userSchema');

const port = process.env.PORT || 8080;

var app = express();


app.use(express.static(__dirname + '/views'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser());

app.get('/',(req,res) => {
  res.render('index.html');
});

app.post('/login',(req,res) => {
  res.render('login.html');
});

app.post('/signup',(req,res) => {
  // console.log(req.body);
  res.render('signup.html');
});

app.post('/signup/sendUserInfo',(req,res) => {
  var userInfo =  {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    pass: req.body.pass
  };
  addUserData.addData(userInfo);
  mailer.sendMail(userInfo,(err,info) => {
    if(err){
      console.log('Unable to send mail ',err);
    } else{
      console.log(info);
    }
  });
  // console.log(userInfo);

  res.send('WELCOME');
});

app.listen(port, () => {
  console.log(`The server is up on port ${port}`);
});
