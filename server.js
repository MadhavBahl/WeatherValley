var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var mailer = require('./serverFiles/mailer');
var addUserData = require('./serverFiles/addUserData');
// var {mongoose} = require('./serverFiles/mongoose');
// var {User} = require('./serverFiles/userSchema');

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
  addUserData.addData(userInfo,(err,doc) => {
    if(err) {
      console.log('Unable to write data ',err);
      res.status(400).send('UNABLE TO MAKE A NEW USER!!!!');
    } else{
      console.log('Data was saved');
      console.log(JSON.stringify(doc,undefined,2));
    }
  });
  mailer.sendMail(userInfo,(err,info) => {
    if(err){
      console.log('Unable to send mail ',err);
      res.status(400).send('<h1>UNABLE TO MAKE A NEW USER!!!!</h1> <h1> Please Enter A Correct Email Id</h1>');
    } else{
      console.log(info);
      res.send(`<h1>Welcome <b>${userInfo.name}</b></h1>`);
    }
  });
  console.log(userInfo);


});

app.listen(port, () => {
  console.log(`The server is up on port ${port}`);
});
