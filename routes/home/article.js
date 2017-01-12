var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');//引入mongoose模块

//每次连接数据库获取到的对象不一样,这样才不会出现打开未关闭的已连接
var articleConnect = mongoose.createConnection('mongodb://localhost/article');//连接本地mongodb数据库名:article

//创建数据模型,也就是定义数据库字段及字段类型
var articleSchema = new mongoose.Schema({
    title:{type: String, unique: true}, //标题
    categoryId:String, //类目id
    description:String, //文章描述
    author:String, //作者
    addTime:String, //创建时间
    updateTime:String, //更新时间
    glanceCount:String, //浏览次数
    comment:String, //评论数组列表
    content:String, //文章内容
    articleTag:String //文章标签
}, {collection: "article"});//声明表名

//某个文章的详情页
router.get('/:id', function(req, res, next) {
    //使用req.params来接收get请求参数
    var id = req.params.id;
    console.log(id);
    var _id = mongoose.Types.ObjectId(req.params.id);

    //使用上方数据模型创建表
    var Article = articleConnect.model('article', articleSchema);

    //从表中查询数据 doc为查询结果对象  name为查询字段条件
    Article.findOne({_id:_id}, function(err, doc){
        if(err){
          console.log(err);
        }else{
          console.log(doc);
            res.render('home/article', { title: 'article内容页', articleInfo:doc });
        }
    });

});


//获取某个类目下的list列表
router.get('/list/:id', function(req, res, next) {
    //使用req.params来接收get请求参数
    var CategoryId = req.params.id;//类目id
    console.log(CategoryId);

    //查询文章表中同一个类目的文章列表
    CategoryId = mongoose.Types.ObjectId(CategoryId);

    //使用上方数据模型创建表
    var Article = articleConnect.model('article', articleSchema);

    //从表中查询数据 doc为查询结果对象  name为查询字段条件
    Article.find({categoryId:CategoryId}, function(err, doc){
        if(err){
            console.log(err);
        }else{
            console.log(doc);
            res.render('home/list', { title: 'list列表', articleLists:doc });
        }
    });

});

module.exports = router;
