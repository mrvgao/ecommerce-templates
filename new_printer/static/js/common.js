(function (){
	var gotop = $('#gotop'),
		contactonline = $('#contactonline'),
		contact_wrap = $('.contact-wrap');

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
		contact_wrap.show();
	});

}())