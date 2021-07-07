var express = require('express');
const serveIndex = require('serve-index')
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || '5000';


app.get('/', function (request, response) {
  response.render('index', { env: process.env });
});

app.use('/uploads', express.static('./public/uploads'), serveIndex('./public/uploads', { 'icons': true }))


var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({
  storage: storage,
});

app.post('/bulk', upload.array('myfile', 4), (req, res) => {
  try {
    //res.send(req.files);
    res.redirect('/uploads')
  } catch (error) {
    console.log(error);
    res.send(400);
  }
});



app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
