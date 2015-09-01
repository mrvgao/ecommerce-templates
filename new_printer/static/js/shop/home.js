$(function (){

	var mark_btn = $('.list-mark-btn'),
		home_slider_l = $('.home-slider-l'),
		home_slider_r = $('.home-slider-r'),
		_li = $('.home-slider-box ul li'),
		home_banner = $('.home-banner ul li'),
		h_b_l = $('.h-b-l'),
		h_b_r = $('.h-b-r'),
		_liW = _li.width()+56,
		_ulW = _liW*(_li.length-4)-56,
		_len = home_banner.length,
		_index = 0,
		timer;

	mark_btn.on('click',function (){
		var _this = $(this),
			_num = _this.attr('data-num');

		if(_this.hasClass('active')){
			_this.removeClass('active');
			toMark();
		}else {
			_this.addClass('active');
			toMark();
		}

		// mark 的ajax方法
		function toMark(){
			$.post('',{},function (){});
		}
	});

	home_slider_r.on('click',function (){
		var _sbox = $(this).parent().find('ul');
		var _left = parseInt(_sbox.css('left').split('px'));
		if(-_left >= 596){
			return false;
		}else {
			_sbox.animate({'left': _left-_liW});
		}
	});

	home_slider_l.on('click',function (){
		var _sbox = $(this).parent().find('ul');
		var _left = parseInt(_sbox.css('left').split('px'));
		if(_left >= 0){
			return false;
		}else {
			_sbox.animate({'left': _left+_liW});
		}
	});

	// 自动轮播
	function setSlider(){

		timer = setInterval(function () {
        	_index++;
	        if (_index >= _len) {
	        	_index = -1;
	        	_index++;
	        	home_banner.eq(_index).fadeIn(1000).siblings().fadeOut(1000);
	        }else {
	            home_banner.eq(_index).fadeIn(1000).siblings().fadeOut(1000);
	        }
	    },5000);
		
	}
	setSlider();

	// 点击左方键
	h_b_l.on('click',function (){
		clearInterval(timer);
		if(_index <= 0){
			_index = _len-1;
		}else {
			_index -= 1;
		}
		home_banner.eq(_index).fadeIn(1000).siblings().fadeOut(1000);
		setSlider();
	});

	// 点击右方键
	h_b_r.on('click',function (){
		clearInterval(timer);
		if(_index >= _len){
			_index = 0;
		}else {
			_index += 1;
		}
		home_banner.eq(_index).fadeIn(1000).siblings().fadeOut(1000);
		setSlider();
	});

})