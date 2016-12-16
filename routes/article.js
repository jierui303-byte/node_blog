var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');//引入mongoose模块


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('article', { title: 'article' });
// });

router.get('/:id', function(req, res, next) {
    //使用req.params来接收get请求参数
    var id = req.params.id;
    console.log(id);

    //获取到文章id后,连接mongodb数据库, 查询该id的文章信息
    mongoose.connect('mongodb://localhost/article');//连接本地mongodb数据库名:article
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));//判断是否连接失败
    db.once('open', function() {
        console.log('mongoose opened!');//数据库打开提示

        //创建数据模型,也就是定义数据库字段及字段类型
        var userSchema = new mongoose.Schema({
            // name:{type: String, unique: true},
            // password:String,
            title:String, //标题
            description:String, //文章描述
            author:String, //作者
            addTime:Date, //创建时间
            updateTime:Date, //更新时间
            glanceCount:Integer, //浏览次数
            comment:Array, //评论数组列表
            content:String, //文章内容
            articleTag:String //文章标签

        }, {collection: "article"});//声明表名
        //使用上方数据模型创建表
        var Article = mongoose.model('article', userSchema);

        //从表中查询数据 doc为查询结果对象  name为查询字段条件
        // Article.findOne({name:"WangEr"}, function(err, doc){
        //     if(err){
        //       console.log(err);
        //     }else{
        //       console.log(doc.name + ", password - " + doc.password);
        //     }
        // });

        //添加数据到数据库
        var lisi = new Article({
            name:"LiSi是是是",
            password:"123456"
        });
        //保存数据
        lisi.save(function(err, doc){
            if(err){
              console.log(err);
            }else{
              console.log(doc.name + ' saved');
            }
        });
    });

    db.close();//关闭数据库连接



    res.render('article', { title: 'article' });
});

module.exports = router;
