$(function (){

	var paynow = $('.paynow'),
		addcart = $('.addcart'),
		gopay = $('.gopay'),
		download = $('.download-btn'),
		pay_info = $('.pay-info'),
		pay_method = $('.pay-method'),
		detail_wrap = $('.detail-wrap'),
		gopay = $('.gopay'),
		_method = 'ali',
		goods_id = detail_wrap.attr('data-id');

	// 立即下单
	paynow.on('click',function (){
		var _this = $(this);
		if(_this.attr('data-state') == 1){
			pay_info.hide();
			pay_method.show();
		}else if(_this.attr('data-state') == 0) {
			$.msgBox('提示','请先登录',function (){
				location.href = "/login";
			});
		}
	});

	// 加入购物车
	addcart.on('click',function (){
		$.post('/shop/goods-detail/addcart',{
			'goods_id': goods_id
		},function (e){
			$.msgBox.mini('添加成功');
		});
	});

	// 选择支付方式
	$('.method-box a').on('click',function (){
		var _this = $(this);
		_this.siblings().removeClass('active');
		_this.addClass('active');
		if(_this.hasClass('alipay')){
			_method = 'ali';
		}else {
			_method = 'tencen';
		}
	});

	// 去支付
	gopay.on('click',function (){
		$.post('/shop/goods-detail/gopay',{
			'pay_method': _method
		},function (){});
	});

	download.on('click',function (){
		
		// 获取商品下载链接
		$.post('/shop/goods-detail/download',{
			'goods_id': goods_id
		},function (e){
			window.open(e[0].download_url);
		});
	});

});







