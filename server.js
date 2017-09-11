var express = require('express');
var bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

var app = express();

app.use(express.static(__dirname + '/views'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/',(req,res) => {
  res.render('index.html');
});
 app.post('/login',(req,res) => {
   res.render('login.html');
 });

app.listen(port, () => {
  console.log(`The server is up on port ${port}`);
});
