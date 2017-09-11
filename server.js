var express = require('express');
var bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

var app = express();

app.use(express.static(__dirname + '/views'));
// app.set('views', __dirname + '/views');

app.get('/',(req,res) => {
  res.render('index.html');
});

app.listen(port, () => {
  console.log(`The server is up on port ${port}`);
});
