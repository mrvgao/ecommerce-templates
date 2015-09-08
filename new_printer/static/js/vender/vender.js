$(function (){

	var cancel_btn = $('.cancel-btn'),
		follow_btn = $('.follow-btn a'),
		vender_nav = $('.vender-nav');

	// 取消收藏作品
	cancel_btn.on('click',function (){
		var _this = $(this),
			_num = _this.attr('data-num');

		$.post('/shop/mark-goods',{ goods_id: _num },function (e){
			var data = JSON.parse(e);
            if(data.state == 'SUCCESS'){
            	$.msgBox.mini('取消成功');
            	_this.parent().remove();
            }else {
            	$.msgBox.mini('取消失败');
            }
		});
	});

	// 取消关注设计师
	follow_btn.on('click',function (){
		var _this = $(this),
			_id = vender_nav.attr('data-id'),
			_num = _this.attr('data-num');

		$.post('/designer/cancel_focus',{ 'd_id': _num, 'v_id': _id },function (e){
			var data = JSON.parse(e);
            if(data.state == 'SUCCESS'){
            	$.msgBox.mini('取消成功');
            	_this.parents('.designer-box').remove();
            }else {
            	$.msgBox.mini('取消失败');
            }
		});

	});

})