var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');//引入mongoose模块

//每次连接数据库获取到的对象不一样,这样才不会出现打开未关闭的已连接
var articleConnect = mongoose.createConnection('mongodb://localhost/article');//连接本地mongodb数据库名:article
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));//判断是否连接失败


//创建数据模型,也就是定义数据库字段及字段类型
var articleSchema = new mongoose.Schema({
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
    var data = {};//把两个数据库查询结果全部放在一个对象中

  //查询文章数据库, 获取相应条件的数据, 且渲染到首页列表
  //使用上方数据模型创建表
  var Article = articleConnect.model('article', articleSchema);
  //查询所有文章数据
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
        // console.log(doc);
        data.articleLists = doc;
        // res.render('home/index', { title: 'nodeBlogHome', articleLists:doc });
    }
  });


    //查询所有的分类列表数据库
    var categoryConnect = mongoose.createConnection('mongodb://localhost/category');//连接本地mongodb数据库名:category
    //创建数据模型,也就是定义数据库字段及字段类型
    var categorySchema = new mongoose.Schema({
        categoryName:String, //类目名称
        addTime:String, //新增时间
        updateTime:String //更新时间
    }, {collection: "category"});//声明表名
    //查询数据库, 获取相应条件的数据, 且渲染到首页列表
    //使用上方数据模型创建表
    var Category = categoryConnect.model('category', categorySchema);
    //查询所有分类数据
    Category.find({}, {
        categoryName:true,
        addTime:true,
        updateTime:true
    }, function(err, doc){
        if(err){
            console.log(err);
        }else{
            // console.log(doc);
            data.categoryLists = doc;
            console.log(data);
            res.render('home/index', { title: 'nodeBlogHome', articleLists:data.articleLists, categoryLists:data.categoryLists });
        }
    });

});

module.exports = router;
