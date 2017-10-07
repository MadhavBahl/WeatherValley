var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var path = require('path');

var app = express();
app.use(bodyparser());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

mongoose.connect('mongodb://localhost/testUser');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    mobile: {
        type: String,
        required: false,
        minlength: 10,
        maxlength: 10
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

var User = mongoose.model('UserModel',userSchema);



app.get('/',(req,res) => {
    res.render('index.html');
});

app.post('/welcome',(req,res) => {
    var name = req.body.name;
    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass
    });
    newUser.save().then((doc) => {
        console.log(doc);
    }).catch((err) => {
        console.log('Unable to save the document!');
    });
    res.redirect(`/:${name}/:${req.body.email}`);
});
app.get('/:name/:email',(req,res) =>{
    var name = req.params.name;
    console.log(req.params);
    res.send(`<h2> Hello ${name} </h2>`);
});
app.listen(3000,() => {
    console.log('Playground server is up on port 3000');
});