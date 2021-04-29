$(document).ready(function($) {
    // 手机导航
    $('.menuBtn').append('<b></b><b></b><b></b>');
    $('.menuBtn').click(function(event) {
        $(this).toggleClass('open');
        var _winw = $(window).width();
        var _winh = $(window).height();
        if( $(this).hasClass('open') ){
            $('body').addClass('open');
            if( _winw<=747 ){
                $('.nav').stop().slideDown();
            }
        }else{
            $('body').removeClass('open');
            if( _winw<=747 ){
                $('.nav').stop().slideUp();
            }
        }
    });
    $(window).on('resize', function (e) {
        if($(window).width() > 747) {
            $('.menuBtn').removeClass('open');
            $('.nav').css('display', '');
			$('#mobile_so').css('display','none');
			$('#pc_so').css('display','block');
        }else{
			$('#mobile_so').css('display','block');
			$('#pc_so').css('display','none');
		}
    });
    // 弹出框
    $('.myfancy').click(function(){
        var _id = $(this).attr('href');
        $(_id).animate({"left":"0"}, 500);
        $(_id).find(".pop-bg").fadeIn();
    });
    $('.pop-bg,.close').click(function(){
        $(this).parents('.m-pop').animate({"left":"9999px"}, 500);
        $(".pop-bg").fadeOut();
    });
// document.write ('<script type="text/javascript"  src="https://js.users.51.la/19471745.js"></script>');

});

