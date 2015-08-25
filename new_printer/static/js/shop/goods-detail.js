$(function (){

	var paynow = $('.paynow'),
		addcart = $('.addcart'),
		gopay = $('.gopay'),
		download = $('.download-btn'),
		pay_info = $('.pay-info'),
		pay_method = $('.pay-method'),
		detail_wrap = $('.detail-wrap'),
		gopay = $('.gopay'),
		_method = 'alipay',
		goods_id = detail_wrap.attr('data-id');
	goods_list = [];
	
	// 立即下单
	paynow.on('click',function (){
		var _this = $(this);
		
		if(_this.attr('data-state') == 1){
			
			goods_list.push(goods_id);
			//生成订单		
			$.post('/payment/build_bills',{
				'goods_list': goods_list,
				'where':'detail'
				},function (e){
				// 生成订单成功，返回 SUCCESS
				result = JSON.parse(e);
				if(result['status'] == 'SUCCESS'){
					bill_id = result['bill_id'];
				}else{
					$.msgBox.mini('生成订单失败，请重新操作');
				}
			});
			
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
		$.post('/payment/add_cart',{
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
			_method = 'alipay';
		}else {
			_method = 'tenpay';
		}
	});

	// 去支付
	gopay.on('click',function (){

		$.post('/payment/pay',{
			'bills_id': bill_id,
			'pay_method': _method
		},function (e){
			var url = JSON.parse(e)['state'];
			gotoUrl(url);
		});

	});

	function gotoUrl(url) {
    	var gotoLink = document.createElement('a');
    	gotoLink.href = url;
    	document.body.appendChild(gotoLink);
    	gotoLink.click();
	};

	download.on('click',function (){
		
		// 获取商品下载链接
		$.post('/shop/goods-detail/download',{
			'goods_id': goods_id
		},function (e){
			window.open(e[0].download_url);
		});
	});

});







