var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
const hbs = require('hbs');
var fs = require('fs');
var request = require('request');
var satelize = require('satelize');

var mailer = require('./serverFiles/mailer');
var addUserData = require('./serverFiles/addUserData');
var {checkExistingUser} = require('./serverFiles/checkUser');
var {checkExistingPin} = require('./serverFiles/checkPin');
var {Weather} = require('./serverFiles/weatherSchema');
var {getGeoLoc} = require('./serverFiles/googleGeo');
var {getWeather} = require('./serverFiles/darkSky');
var {fetchpin} = require('./serverFiles/getPin');
var {fetchWeatherFromDB} = require('./serverFiles/WeatherDB');
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
  var pin = req.body.pin;
  console.log(pin);
  checkExistingPin(pin,(data) => {
    if(data) {
      res.send('<h1> The given Pin already exists</h1>');
    } else {
      // console.log(data);
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

app.get('/getWeather',(req,res) => {
  fetchWeatherFromDB((err,data) => {
    if(err) res.status(400).send(`<h1> ERROR!!!! ${err}`)
    else res.send(data);
  });
});



/* ===== Manual Weather Save ===== */

app.get('/saveWeather',(req,res) => {
  fetchpin((err,data) => {
    if(err) return res.status(400).send('<h1> ERROR!! Unable to fetch the database</h1>');
    else{
      if(!data) return res.status(400).send('<h1> ERROR!! Database Empty! </h1>');
      else {
        var len = data.length;

        for(var i=0;i<len;i++){

          console.log('Data[i]: \n', JSON.stringify(data[i],undefined,2));
          let tempData = data[i];
          Weather.findOne({
            lat: data[i].lat,
            lng: data[i].lng
          },(err,result) => {
            // console.log(tempData,'inside then call');
            if(!result){
              // console.log(tempData);
              console.log(tempData,'is being saved');
              getWeather(tempData.lat,tempData.lng,(err,weather) => {
                if(err) console.log(err);
                else {
                  console.log(weather);
                  // res.send(weather);
                  enterWeather = new Weather(weather);
                  enterWeather.save();
                }
              });

            }
            else {
              console.log(tempData,'Already exists');
            }
          })
        }

        res.send('<h1> WOWWAWW</h1>');
      }
    }
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
      if(userInfo.pass === exist.pass){
        
        // Example retrieve IP from request 
        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress; 
        console.log('IP Address is : ', ip);
        // then satelize call 
        
        satelize.satelize({ip:'115.248.50.24'}, function(err, payload) {
          if(err) {
            console.log('Error!',err);
            res.render('userWelcome.hbs',exist);
          } else {
            console.log('Response: ', payload);
            
            request({
              url: `https://api.darksky.net/forecast/f1d413224992adae584dd90b72f51905/${payload.latitude},${payload.longitude}`,
              json: true
            }, (err,resp,body) => {
              var currentWeather;
              if(err) {
                currentWeather = 'Couldn\'t fetch the weather from our data base, please try somoetime later';
              } else { 
                currentWeather = (body.currently.temperature - 32)/1.8;
              }
              var sendInfo = {
                name: exist.name,
                ip: '115.248.50.24',
                payload: payload,
                currentWeather: currentWeather
              }
              res.render('userWelcome.hbs',sendInfo);
            });
            
          }
        });
      }
      else {
        res.render('wrongPass.hbs');
      }
    } else{
      res.render('loginFALSEsignup.hbs');
    }
  });
});

app.post('/getRaw',(req,res) => {
  fetchWeatherFromDB((err,data) => {
    if(err) res.status(400).send(`<h1> ERROR!!!! ${err}`)
    else res.send(data);
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

  /* ===== Automated Weather Save ===== */

  var currentDay = moment().format("dddd");
  console.log("Current Date Is: ",currentDay);
  
  if(currentDay === 'Monday') {
    fs.readFile('./flag.txt','utf8', (err, data) => {
      if (err) throw err;
      console.log(data);
      if(data === 'NO') {
        fetchpin((err,data) => {
          if(err) return res.status(400).send('<h1> ERROR!! Unable to fetch the database</h1>');
          else{
            if(!data) return res.status(400).send('<h1> ERROR!! Database Empty! </h1>');
            else {
              var len = data.length;
      
              for(var i=0;i<len;i++){
      
                console.log('Data[i]: \n', JSON.stringify(data[i],undefined,2));
                let tempData = data[i];
                Weather.findOne({
                  lat: data[i].lat,
                  lng: data[i].lng
                },(err,result) => {
                  // console.log(tempData,'inside then call');
                  if(!result){
                    // console.log(tempData);
                    console.log(tempData,'is being saved');
                    getWeather(tempData.lat,tempData.lng,(err,weather) => {
                      if(err) console.log(err);
                      else {
                        console.log(weather);
                        // res.send(weather);
                        enterWeather = new Weather(weather);
                        enterWeather.save();
                      }
                    });
      
                  }
                  else {
                    console.log(tempData,'Already exists');
                  }
                })
              }
      
              res.send('<h1> WOWWAWW</h1>');
            }
          }
        })
        fs.writeFile('flag.txt', 'YES', (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }
    });
  } else if(currentDay === 'Tuesday') {
    fs.readFile('./flag.txt','utf8', (err, data) => {
      if (err) throw err;
      console.log(data);
      if(data === 'YES') {
        fs.writeFile('flag.txt', 'NO', (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }
    });
  }
});
