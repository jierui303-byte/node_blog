/**
 * Created by mac on 2016/12/14.
 */
$(function(){
    //写html5小示例的开门效果
    var kmLis = $('.lxsl ul li');

    //开门初始化
    h5init();

    //初始化, 当浏览器屏幕大小发生变化时,图片的宽度重新获取
    $(window).resize(function(){
        h5init();
    });

    function h5init(){
        //获取父级元素的宽高
        var pw = kmLis.children('.imgP').find('.imgLeft').width()*2;
        // var ph = kmLis.children('.imgP').find('.imgLeft').height();
        console.log(pw+'==');//宽度随浏览器窗口变换, 高度160不变
        kmLis.children('.imgP').find('.imgLeft').find('img').css({
            'width' : pw+'px'
        });
        kmLis.children('.imgP').find('.imgRight').find('img').css({
            'width' : pw+'px',
            'left' : -(pw/2)+'px'
        });
    }

    //鼠标移上时
    kmLis.hover(function(){
        //实时动态获取圆图片所显示的宽高及位置
        var pw1 = $(this).find('.imgLeft').width();//取得a标签下的div宽度
        var ph1 = $(this).find('.imgLeft').height();

        var xv = pw1/2;//左右移动距离

        //pw = 左溢距离+右移距离+中心圆宽度
        // 左溢距离=右移距离=pw1/2
        //中心圆的位置: 左溢距离-中心圆宽度的一半ph1/2
        //中心圆的宽度计算: [ph1]

        var leftN = ph1/2;
        console.log(leftN);

        //把左门打开,使用translate移位或者rotate翻转
        $(this).find('.imgCenter').css({
            'left':((pw1-ph1)+leftN)+'px',
        });
        $(this).find('.imgCenter img').css({
            'width':ph1+'px',
            'height': ph1+'px'
        });//给中心圆相同宽高,以外层高度为宽


        $(this).find('.imgLeft').css({
            'transform':'translate(-'+leftN+'px)'
        });
        $(this).find('.imgRight').css({
            'transform':'translate('+leftN+'px)'
        });
    });
    //鼠标离开时
    kmLis.mouseleave(function(){
        console.log('aaaa');
        //把左门打开,使用translate移位或者rotate翻转
        $(this).find('.imgLeft').css({
            'transform':'translate(0)'
        });
        $(this).find('.imgRight').css({
            'transform':'translate(0)'
        });
    });






    //元素出现高度再出现宽度特效
    //获取当前元素的高度和宽度, 定义标题框出现的位置
    var ysjsLis = $('.ysjs ul li');


    ysjsLis.hover(function(){

        getYsjsW();

        // t.to($(this).find('.qyztitle'), 1, {width:10, height:1, border:'1px solid #fff', background:'rgba(255,255,255,0.5)'});
        // t.to($(this).find('.qyztitle'), 1, {width:Lpw-10, height:Lph-10, border:'1px solid #fff', background:'rgba(255,255,255,0.5)'});
    });

    ysjsLis.mouseleave(function(){
        $(this).find('.qyztitle').css({
            // left:10,
            // top:10,
            // width:(Lpw-10)+'px',
            // height:(Lph-10)+'px',
            // background:'rgba(0,0,0,0.5)'

            // top: '10px',
            // left: '10px',
            // width:0,
            // height:0,
            // background:'rgba(0,0,0,0.3)'
        });

        // t.to($(this).find('.qyztitle'), 1, {width:0, height:0, border:'none', display:'none'});
    });

    function getYsjsW(){
        //获取父级元素的宽高
        var Lpw = ysjsLis.children('.imgP').width();
        var Lph = ysjsLis.children('.imgP').height();
        console.log(Lpw+'==js');//宽度随浏览器窗口变换, 高度160不变

        $(this).find('.qyztitle').css({
            width:(Lpw-10),
            height:(Lph-10)
        });
    }





    //给中间标题添加一个
    // ysjsLis.children('.imgP').find('img').css({
    //     'width' : pw+'px'
    // });
    // ysjsLis.children('.imgP').find('img').css({
    //     'width' : pw+'px',
    //     'left' : -(pw/2)+'px'
    // });





    //给分类栏目写随机背景色和字体颜色, 背景色深色, 字体颜色浅色



});