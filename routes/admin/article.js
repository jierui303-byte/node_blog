var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');//引入mongoose模块

//每次连接数据库获取到的对象不一样,这样才不会出现打开未关闭的已连接
mongoose.connect('mongodb://localhost/article');//连接本地mongodb数据库名:article
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));//判断是否连接失败


//创建数据模型,也就是定义数据库字段及字段类型
var userSchema = new mongoose.Schema({
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

/* get 文章控制器根目录 可让其展示列表内容*/
router.get('/', function(req, res, next) {
    res.render('admin/article/index', { title: 'admin/article/index' });
});

//文章新增页
router.get('/add', function(req, res, next) {
    //从数据库查询类目信息,注入模板
    var categoryCon = mongoose.createConnection('mongodb://localhost/category');
    //创建数据模型,也就是定义数据库字段及字段类型
    var categorySchema = new mongoose.Schema({
        categoryName:String, //类目名称
        addTime:String, //新增时间
        updateTime:String //更新时间
    }, {collection: "category"});//声明表名
    var Category = categoryCon.model("category", categorySchema);

    //查询所有记录的age和title字段
    Category.find({},{
        categoryName:true,
        addTime:true,
        updateTime:true
    },function(err,docs){
        if(!err){
            console.log(docs);//此时打印出来的是一个对象数组
            res.render('admin/article/add', { title: '文章新增', categoryLists:docs});
        }else{
            console.log(err);
        }
    });
});


//处理文章新增数据写入数据库控制器, 中间不用渲染页面
//这个路由是进行数据写入的, 新增和修改都用此路由
//修改信息之前先判断该条数据是否存在, 存在则进行修改,不存在则进行新增
router.post('/addData', function(req, res, next) {
    console.log(req.body);
    //以下是新增操作
    var title = req.body.title; //标题
    var categoryId = req.body.categoryId; //类目id
    var description = req.body.description; //文章描述
    var author = req.body.author; //作者
    var addTime = getDate(); //创建时间
    var updateTime = getDate(); //更新时间
    var glanceCount = 0; //浏览次数, 初始值为0
    var comment = ''; //评论数组列表, 初始值是空数组
    var content = req.body.content; //文章内容
    var articleTag = req.body.articleTag; //文章标签


    //连接mongodb写入数据库操作
    //获取到文章id后,连接mongodb数据库, 查询该id的文章信息
    // mongoose.connect('mongodb://localhost/article');//连接本地mongodb数据库名:article
    // var db = mongoose.connection;

    // db.once('open', function() {
    //     console.log('mongoose opened!');//数据库打开提示

        //使用上方数据模型创建表  userSchema是上方定义的数据模型
        var Article = mongoose.model('article', userSchema);

        //添加数据到数据库
        var ArticleObj = new Article({
            title:title, //标题
            categoryId:categoryId, //类目
            description:description, //文章描述
            author:author, //作者
            addTime:addTime, //创建时间
            updateTime:updateTime, //更新时间
            glanceCount:glanceCount, //浏览次数
            comment:comment, //评论数组列表
            content:content, //文章内容
            articleTag:articleTag //文章标签
        });

        console.log(categoryId);

        //保存数据
        ArticleObj.save(function(err, doc){
            if(err){
                console.log(err);
            }else{
                console.log(doc.title + ' saved');
                //添加成功执行跳转 到文章列表路由
                res.redirect('/admin/article/list');
            }
        });

    // });

});


//文章修改页面
router.get('/edit/id/:id', function(req, res, next) {
    //使用req.params来接收get请求参数
    var _id = mongoose.Types.ObjectId(req.params.id);
    console.log(_id);

    var data = null;

    //通过_id查询该条数据
    var Article = mongoose.model("article", userSchema);
    //查询_id=_id的记录的title和description等字段
    Article.find({_id:_id},{
        title:true,
        categoryId:true,
        description:true,
        author:true,
        content:true,
        addTime:true,
        updateTime:true,
        articleTag:true
    },function(err,docs){
        if(!err){
            console.log(docs);
            data = docs[0];
        }else{
            console.log(err);
        }
    });


    //从数据库查询类目信息,注入模板
    var categoryCon = mongoose.createConnection('mongodb://localhost/category');
    //创建数据模型,也就是定义数据库字段及字段类型
    var categorySchema = new mongoose.Schema({
        categoryName:String, //类目名称
        addTime:String, //新增时间
        updateTime:String //更新时间
    }, {collection: "category"});//声明表名
    var Category = categoryCon.model("category", categorySchema);

    var categoryLists = null;
    //查询所有记录的age和title字段
    Category.find({},{
        categoryName:true,
    },function(err,docs){
        if(!err){
            console.log(docs);//此时打印出来的是一个对象数组
            categoryLists = docs;
            res.render('admin/article/edit', { title: '文章修改', articleInfo:data, categoryLists:categoryLists });
        }else{
            console.log(err);
        }
    });

});


//修改页面路由
router.post('/editData', function(req, res, next) {
    // mongoose.connect('mongodb://localhost/test');
    // var Cat = mongoose.model('Cat', {
    //     name: String,
    //     friends: [String],
    //     age: Number,
    // });
    // var _id = mongoose.Types.ObjectId('5853483aeb77fd2e89553a7b');
    //
    // Cat.findById({_id:_id}, function(err, doc){
    //     doc.name = 'jjjjj';
    //     Cat.update({age:3}, {name:'jierui303'}, {multi:true}, function(err, raw){
    //
    //     });
    // });


    //执行更新表
    var _id = mongoose.Types.ObjectId(req.body._id);
    var Article = mongoose.model("article", userSchema);

    // console.log(_id+'hhh');
    // console.log(typeof _id);
    // console.log(req.body);

    Article.findById({_id:_id}, function(err, doc){
        // doc.title = 'jjjjj';
        //_id是主键, 主键不能更新, 所以把_id先删除
        delete req.body._id;
        console.log(req.body);

        // Article.update({_id:_id}, {title:'ddddd'}, {multi:true}, function(err,doc){
        Article.update({_id:_id}, req.body, {multi:true}, function(err,doc){
            if(!err){
                res.redirect('/admin/article/list');
            }else{
                return handleError(err);
            }
        });

    });

});


//文章删除操作
router.get('/del/id/:id', function(req, res, next) {
    //使用req.params来接收get请求参数
    var _id = mongoose.Types.ObjectId(req.params.id);
    console.log(_id);

    //通过_id查询该条数据
    var Article = mongoose.model("article", userSchema);
    //查询_id=_id的记录的title和description等字段
    Article.find({_id:_id},function(err,docs){
        if(!err){
            console.log(docs);
            Article.remove({_id:_id},function(err,docs){//删除id为4的记录
                console.log(docs);
                console.log('remove success');
                res.redirect('/admin/article/list');
            });
        }else{
            console.log(err);
        }
    });
});


//文章列表页
router.get('/list', function(req, res, next) {
    //list页面从mongodb上获取所有的文章,并将数据渲染到页面中遍历出来
    // mongoose.connect('mongodb://localhost/article');//连接本地mongodb数据库名:article
    // var db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'connection error:'));//判断是否连接失败

    var Article = mongoose.model("article", userSchema);

    //查询所有记录的age和title字段
    Article.find({},{
        title:true,
        categoryId:true,
        description:true,
        author:true,
        content:true,
        addTime:true,
        updateTime:true,
        articleTag:true
    },function(err,docs){
        if(!err){
            // console.log(docs);//此时打印出来的是一个对象数组
            res.render('admin/article/list', { title: 'admin/article/list', articleLists: docs});
        }else{
            console.log(err);
        }
    });

});

module.exports = router;


/**
 * 获取当前执行的时间
 * @returns {string}
 */
function getDate(){

    var dateDigitToString = function (num) {
        return num < 10 ? '0' + num : num;
    };//这个函数的作用是把个位数的十位置0,凑成两位数，如：08 04

    var currentDate = new Date(),
        year = dateDigitToString(currentDate.getFullYear()),
        month = dateDigitToString(currentDate.getMonth() + 1),//Date.getMonth()的返回值是0-11,所以要+1
        date = dateDigitToString(currentDate.getDate()),
        hour = dateDigitToString(currentDate.getHours()),
        minute = dateDigitToString(currentDate.getMinutes()),
        second = dateDigitToString(currentDate.getSeconds()),
        formattedDateString = year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;
    // document.write(formattedDateString);
    return formattedDateString;
}
