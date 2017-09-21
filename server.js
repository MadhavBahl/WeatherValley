var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const hbs = require('hbs');

var mailer = require('./serverFiles/mailer');
var addUserData = require('./serverFiles/addUserData');
var {checkExistingUser} = require('./serverFiles/checkUser');
var {checkExistingPin} = require('./serverFiles/checkPin');
var {getGeoLoc} = require('./serverFiles/googleGeo');
var {getWeather} = require('./serverFiles/darkSky');
var {fetchpin} = require('./serverFiles/getPin');
var addPin = require('./serverFiles/addPin');
// var {mongoose} = require('./serverFiles/mongoose');
// var {User} = require('./serverFiles/userSchema');

const port = process.env.PORT || 8080;

var app = express();
app.use(bodyParser());

app.set('view engine','hbs');
app.use(express.static(__dirname + '/views'));
// app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.use(express.static(__dirname + '/views'));
// app.use(bodyParser.urlencoded({ extended: true }));


/* ========== ENTER THE PIN CODES ========== */

app.get('/enterPin',(req,res) => {
  res.render('enterPin.hbs');
});
app.post('/enterPin',(req,res) => {
  var pin = {
    pin: req.body.pin
  }
  console.log(pin);
  checkExistingPin(pin,(data) => {
    if(data) {
      res.send('<h1> The given Pin already exists</h1>');
    } else {
      console.log(data);
      addPin.addData(pin,(err,doc) => {
        if(err) {
          console.log('Unable to write data ',err);
          res.status(400).send('UNABLE TO ADD A NEW PIN!!!!');
        } else{
          console.log('Data was saved');
          console.log(JSON.stringify(doc,undefined,2));
        }
      });

        res.redirect('/enterPin');
    }

  })


});

app.get('/getPin',(req,res) => {
  fetchpin((err,data) => {
    if(err) res.send(`<h1> ERROR!!!! ${err}`);
    else res.send(data);
  })
});

/* ========== Main Routes ========== */

app.get('/',(req,res) => {
  res.render('index.hbs');
});

app.post('/login',(req,res) => {
  res.render('login.hbs');
});
app.get('/login',(req,res) => {
  res.render('login.hbs');
});

app.get('/signup',(req,res) => {
  res.render('signup.hbs');
});
app.post('/signup',(req,res) => {
  // console.log(req.body);
  res.render('signup.hbs');
});
app.get('/getLoc',(req,res) => {
  getGeoLoc('632014',(err,data) => {
    if(err) {
      res.send(err);
    } else{
      res.send(data);
    }
  });
});
app.get('/forgotPassword',(req,res) => {
  res.render('forgotPassword.hbs');
})
app.post('/forgotPassword',(req,res) => {
  var userInfo = {
    email: req.body.email
  }
  checkExistingUser(userInfo,(exist) => {
    // console.log(exist);
    if(exist) {
      // res.send(`<h1> The Given User Is Inside The Database As: ${exist} </h1>`);
      mailer.sendMail(exist,(err,info) => {
        if(err) {
          res.send('Could Not Send Your Password!!!');
        } else{
          console.log(`This User Forgot Password But Mail Was Sent: ${info}`);
          res.render('login.hbs');
        }
      })

    }
    else {
      res.render('loginFALSEsignup.hbs');
    }
  });
});

app.get('/welcome',(req,res) => {
  res.redirect('/');
});
app.post('/welcome',(req,res) => {
  var userInfo = {
    email: req.body.email,
    pass: req.body.pass
  }

  checkExistingUser(userInfo,(exist) => {
    if(exist) {
      console.log('The User Exists',exist);
      if(userInfo.pass === exist.pass)
        res.render('welcomePage.hbs',exist);
      else {
        res.render('wrongPass.hbs');
      }
    } else{
      res.render('loginFALSEsignup.hbs');
    }
  });
});

app.post('/sendUserInfo',(req,res) => {
  var userInfo =  {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    pass: req.body.pass
  };
  checkExistingUser(userInfo,(exist) => {
    if(exist){
      console.log('The Given User Already Exists');
      res.render('UserExistsSignup.hbs');

    } else{

      addUserData.addData(userInfo,(err,doc) => {
        if(err) {
          console.log('Unable to write data ',err);
          res.status(400).send('UNABLE TO MAKE A NEW USER!!!!');
        } else{
          console.log('Data was saved');
          console.log(JSON.stringify(doc,undefined,2));
        }
      });
      // res.render('welcomePage.hbs',userInfo);
      mailer.sendMail(userInfo,(err,info) => {
        if(err){
          console.log('Unable to send mail ',err);
          res.status(400).send('<h1>UNABLE TO MAKE A NEW USER!!!!</h1> <h1> Please Enter A Correct Email Id</h1>');
        } else{
          console.log(info);
          // res.send(`<h1>Welcome <b>${userInfo.name}</b></h1>`);
          res.render('welcomePage.hbs',userInfo);
        }
      });
      console.log(userInfo);
    }
  });



});

app.listen(port, () => {
  console.log(`The server is up on port ${port}`);
});
