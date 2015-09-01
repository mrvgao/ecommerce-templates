$(function (){

	var mark_btn = $('.list-mark-btn'),
		home_slider_l = $('.home-slider-l'),
		home_slider_r = $('.home-slider-r'),
		_li = $('.home-slider-box ul li'),
		_liW = _li.width()+56,
		_ulW = _liW*(_li.length-4)-56;

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

})