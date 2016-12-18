var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');//引入mongoose模块

//每次连接数据库获取到的对象不一样,这样才不会出现打开未关闭的已连接
var homeConnect = mongoose.createConnection('mongodb://localhost/article');//连接本地mongodb数据库名:article
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));//判断是否连接失败


//创建数据模型,也就是定义数据库字段及字段类型
var userSchema = new mongoose.Schema({
    title:{type: String, unique: true}, //标题
    description:String, //文章描述
    author:String, //作者
    addTime:String, //创建时间
    updateTime:String, //更新时间
    glanceCount:String, //浏览次数
    comment:String, //评论数组列表
    content:String, //文章内容
    articleTag:String //文章标签
}, {collection: "article"});//声明表名


/* GET 前台首页 */
router.get('/', function(req, res, next) {
  //查询数据库, 获取相应条件的数据, 且渲染到首页列表
  //使用上方数据模型创建表
  var Article = homeConnect.model('article', userSchema);
  //查询所有数据
  Article.find({}, {
      title:true,
      description:true,
      author:true,
      content:true,
      addTime:true,
      updateTime:true,
      articleTag:true
  }, function(err, doc){
    if(err){
        console.log(err);
    }else{
        console.log(doc);
        res.render('home/index', { title: 'nodeBlogHome', articleLists:doc });
    }
  });

});

module.exports = router;
