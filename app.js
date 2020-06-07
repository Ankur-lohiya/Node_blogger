var express = require('express');
var path = require('path');
var favicon=require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var session=require('express-session');
var mongo=require('mongo');
var db=require('monk')('localhost/nodeblog');
var multer=require('multer');
var upload=multer({dest:'uploads/'});

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var categoryRouter=require('./routes/category');

var app = express();

app.locals.moment=require('moment');
app.locals.truncateText=function(text,Length){
  var truncatedText=text.substring(0,Length);
  return truncatedText
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

app.use(require('connect-flash')());
app.use(function(req,res,next){
  res.locals.messages=require('express-messages')(req,res);
  next();
})

app.use(function(req,res,next){
  req.db=db;
  next();
});

app.use('/', indexRouter);
app.use('/post', postsRouter);
app.use('/category',categoryRouter);

app.listen(3000,function(){
  console.log('Listening on port 5000');
});
module.exports = app;
