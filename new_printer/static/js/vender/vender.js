$(function (){

	var cancel_btn = $('.cancel-btn');

	cancel_btn.on('click',function (){
		var _this = $(this),
			_num = _this.attr('data-num');

		$.post('/shop/mark-goods',{ goods_id: _num },function (e){
			var data = JSON.parse(e);
            if(data.state == 'SUCCESS'){
            	$.msgBox.mini('取消成功');
            	_this.find('.work-list').remove();
            }else {
            	$.msgBox.mini('取消失败');
            }
		});
	});

})