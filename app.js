var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var mongoose = require('mongoose');//引入mongoose模块
// mongoose.connect('mongodb://localhost/article');//连接本地mongodb数据库名:article


//前台路由文件引入
var index = require('./routes/home/index');
var article = require('./routes/home/article');
var users = require('./routes/users');



//后台路由文件引入
var adminIndex = require('./routes/admin/index');//后台首页路由
var adminArticle = require('./routes/admin/article');//文章路由
var adminCategory = require('./routes/admin/category');//类目路由




var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.disable('trust proxy');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

//使用前台路由解析
app.use('/', index);
app.use('/article', article);
app.use('/users', users);


//使用后台路由解析 adminIndex
app.use('/admin', adminIndex);//后台首页
app.use('/admin/article', adminArticle);//文章控制器
app.use('/admin/category', adminCategory);//文章控制器



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
