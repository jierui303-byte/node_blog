var express = require('express');
var router = express.Router();

/* GET admin 后台首页 */
router.get('/', function(req, res, next) {
    res.render('admin/index', { title: 'nodeBlog' });
});




module.exports = router;
