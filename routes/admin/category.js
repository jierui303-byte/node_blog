var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');//引入mongoose模块

//每次连接数据库获取到的对象不一样,这样才不会出现打开未关闭的已连接
var categoryConne = mongoose.createConnection('mongodb://localhost/category');//连接本地mongodb数据库名:article


//创建数据模型,也就是定义数据库字段及字段类型
var categorySchema = new mongoose.Schema({
    // categoryName:{type: String, unique: true}, //类目名称
    categoryName:String, //类目名称
    addTime:String, //新增时间
    updateTime:String //更新时间
}, {collection: "category"});//声明表名


/* get 文章类目根目录 可让其展示列表内容*/
router.get('/', function(req, res, next) {
    res.render('admin/category/index', { title: 'admin/article/index' });
});

//文章类目新增
router.get('/add', function(req, res, next) {
    res.render('admin/category/add', { title: '类目新增'});
});


//处理文章新增数据写入数据库控制器, 中间不用渲染页面
//这个路由是进行数据写入的, 新增和修改都用此路由
//修改信息之前先判断该条数据是否存在, 存在则进行修改,不存在则进行新增
router.post('/addData', function(req, res, next) {
    console.log(req.body);
    //以下是新增操作
    var categoryName = req.body.categoryName; //标题
    var addTime = getDate(); //创建时间
    var updateTime = getDate(); //更新时间

    //连接mongodb写入数据库操作
    //获取到文章id后,连接mongodb数据库, 查询该id的文章信息
    //使用上方数据模型创建表  userSchema是上方定义的数据模型
    var Category = categoryConne.model('category', categorySchema);

    //添加数据到数据库
    var CategoryObj = new Category({
        categoryName:categoryName, //标题
        addTime:addTime, //创建时间
        updateTime:updateTime //更新时间
    });


    //保存数据
    CategoryObj.save(function(err, doc){
        if(err){
            console.log(err);
        }else{
            console.log(doc.categoryName + ' saved');
            //添加成功执行跳转 到文章列表路由
            res.redirect('/admin/category/list');
        }
    });

});


//类目修改页面
router.get('/edit/id/:id', function(req, res, next) {
    //使用req.params来接收get请求参数
    var _id = mongoose.Types.ObjectId(req.params.id);
    console.log(_id);

    //通过_id查询该条数据
    var Category = categoryConne.model("category", categorySchema);
    //查询_id=_id的记录的title和description等字段
    Category.find({_id:_id},{
        categoryName:true,
        addTime:true,
        updateTime:true
    },function(err,docs){
        if(!err){
            console.log(docs);
            res.render('admin/category/edit', { title: '类目修改', articleInfo:docs[0] });
        }else{
            console.log(err);
        }
    });
});


//修改页面路由
router.post('/editData', function(req, res, next) {
    //执行更新表
    var _id = mongoose.Types.ObjectId(req.body._id);
    var Category = categoryConne.model("category", categorySchema);

    // console.log(_id+'hhh');
    // console.log(typeof _id);
    // console.log(req.body);

    Category.findById({_id:_id}, function(err, doc){
        // doc.title = 'jjjjj';
        //_id是主键, 主键不能更新, 所以把_id先删除
        delete req.body._id;
        console.log(req.body);

        // Article.update({_id:_id}, {title:'ddddd'}, {multi:true}, function(err,doc){
        Category.update({_id:_id}, req.body, {multi:true}, function(err,doc){
            if(!err){
                res.redirect('/admin/category/list');
            }else{
                return handleError(err);
            }
        });

    });

});


//类目删除操作
router.get('/del/id/:id', function(req, res, next) {
    //使用req.params来接收get请求参数
    var _id = mongoose.Types.ObjectId(req.params.id);
    console.log(_id);

    //通过_id查询该条数据
    var Category = categoryConne.model("category", categorySchema);
    //查询_id=_id的记录的title和description等字段
    Category.find({_id:_id},function(err,docs){
        if(!err){
            console.log(docs);
            Category.remove({_id:_id},function(err,docs){//删除id为4的记录
                console.log(docs);
                console.log('remove success');
                res.redirect('/admin/category/list');
            });
        }else{
            console.log(err);
        }
    });
});


//类目列表页
router.get('/list', function(req, res, next) {

    var Category = categoryConne.model("category", categorySchema);

    //查询所有记录的age和title字段
    Category.find({},{
        categoryName:true,
        addTime:true,
        updateTime:true
    },function(err,docs){
        if(!err){
            console.log(docs);//此时打印出来的是一个对象数组
            res.render('admin/category/list', { title: 'admin/category/list', articleLists: docs});
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
