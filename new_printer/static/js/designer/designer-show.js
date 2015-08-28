$(function (){

	var filter_bynum = $('.filter-bynum a'),
		goods_tomark = $('.goods-tomark'),
		list_box = $('.ds-list-box ul'),
		mark_btn = $('.show-mark-btn');

	filter_bynum.on('click',function (){
		var _this = $(this),
			_tag = _this.attr('data-tag');

		clickFocus(_this);

		switch(_tag){
			case 'filter_all': $.post('',{ 'work_kind': _tag },function (e){
				// do something

			});
				break;

			case 'filter_download_num': $.post('',{ 'work_kind': _tag },function (e){
				// do something

			});
				break;

			case 'filter_mark_num': $.post('',{ 'work_kind': _tag },function (e){
				// do something

			});
				break;

			case 'filter_time': $.post('',{ 'work_kind': _tag },function (e){
				// do something

			});
				break;
		}

	});

	// 关注 or 取消关注
	mark_btn.on('click',function (){
		var _this = $(this);
		if(_this.hasClass('active')){
			_this.removeClass('active');
			$.post('',{  },function (e){
				// do something

			});

		}else {
			_this.addClass('active');
			$.post('',{  },function (e){
				//do something
				
			});

		}
	});

	// 点击切换效果
	function clickFocus(obj){
		obj.siblings().removeClass('active');
		obj.addClass('active');
	}

})