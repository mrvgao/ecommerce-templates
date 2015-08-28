(function (){
	var gotop = $('#gotop'),
		contactonline = $('#contactonline'),
		contact_wrap = $('.contact-wrap'),
		dl_btn = $('.site-dl'),
		login_page = $('.login-page'),
		dl_close = $('.dl-close');

	// goTop
	$(window).scroll(function (){
		if($(window).scrollTop() > 700){
			gotop.fadeIn();
		}else {
			gotop.fadeOut();
		}
	});
	gotop.on('click',function (){
		$('body').animate({'scrollTop':0});
	});

	// contactonline
	contactonline.on('click',function (){
		/*contact_wrap.show();*/
		window.open ('shop/new_chat','newwindow','height=587,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
	});

	// just for test via white
	/*window.open ('shop/new_chat','newwindow','height=587,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');*/

	// 登陆部分
	dl_btn.on('click',function (){
		login_page.fadeIn();
	});

	dl_close.on('click',function (){
		login_page.fadeOut();
	});

}())
