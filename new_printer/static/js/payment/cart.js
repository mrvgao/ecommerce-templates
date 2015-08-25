$(function (){

	var cart_head_all = $('.cart-head-all'),
		cart_foot_all = $('.cart-foot-all'),
		cart_checkbox = $('.cart-checkbox'),
		cart_pay_num = $('.cart-pay-num'),
		cart_download_num = $('.cart-download-num'),
		cart_total = $('.cart-total'),
		toPay = $('.toPay'),
		toDownload = $('.toDownload'),
		del_btn = $('.del-btn'),
		mark_btn = $('.mark-btn'),
		_method = 'alipay';
	
	goods_list = [];
	var bill_id;

	// head 的全选
	cart_head_all.on('click',function (){
		
		if(!document.getElementsByClassName('cart-foot-all')[0].checked){
			if(this.checked){
				cart_checkbox.each(function(){ this.checked = true; });
			}else {
				cart_checkbox.each(function(){ this.checked = false; });
			}
		}
		setAccount();
		setNum();
		goods_list = [];
		setGoodsId();	
	});

	// foot 的全选
	cart_foot_all.on('click',function (){
		
		if(!document.getElementsByClassName('cart-head-all')[0].checked){
			if(this.checked){
				cart_checkbox.each(function(){ this.checked = true; });
			}else {
				cart_checkbox.each(function(){ this.checked = false; });
			}
		}
		setAccount();
		setNum();
		goods_list = [];
		setGoodsId();
	});

	// 单选
	cart_checkbox.on('click',function (){
		setAccount();
		setNum();
		goods_list = [];
		setGoodsId();
	});

	// 金额计算方法
	function setAccount(){
		var account = 0;
		cart_checkbox.each(function(){
			var _this = $(this);
			if(this.checked){
				var _aPrice = _this.parents('.cart-layout').find('.cart-price');
				account += parseInt(_aPrice.text());
			}
		});
		cart_total.text('￥'+account);
	}

	// 数量计算方法
	function setNum(){
		var num = 0;
		cart_checkbox.each(function(){
			if(this.checked){
				num += 1;
			}
		});
		cart_pay_num.text(num);
	}

	//获取商品id
	function setGoodsId(){
		cart_checkbox.each(function(){
			var _this = $(this);
			if(this.checked){
				var _this = $(this),
					_parent = _this.parents('.cart-box'),
					goods_id = _parent.attr('data-id');
				goods_list.push(goods_id)
			}
		});
	}
	
	// 删除单个
	del_btn.on('click',function (){
		var _this = $(this),
			_parent = _this.parents('.cart-box'),
			goods_id = _parent.attr('data-id');
		
		$.post('/payment/del_cart',{
			'goods_id': goods_id
		},function (e){
			// 如果购物车中没有商品了，就返回 false
			result = JSON.parse(e);
			if(result['status'] == 'TRUE'){
				_parent.remove();
			}
			if(result['cart_is_exist'] == 'FALSE'){
				var str = "<p class='pl20 h200'>您购物车暂时还没有任何商品，<a class='ml10' style='color:#54c5d0' href='/shop'>马上去挑 >></a></p>";
				var contBox = _this.parents('.cart-cont');
				contBox.html('').append(str);
			}
		});
	});

	// 移入收藏夹
	mark_btn.on('click',function (){
		var _this = $(this),
			goods_id = _this.parents('.cart-box').attr('data-id');
			
		$.post('/payment/cart/mark',{
			'goods_id': goods_id
		},function (e){
			// 收藏成功，返回 true
			if(e){
				$.msgBox.mini('收藏成功');
			}
		});
	});

	toPay.on('click',function (){
		$('.cart-method-wrap').removeClass('hide');
		
		
		//生成订单		
		$.post('/payment/build_bills',{
			'goods_list': goods_list,
			'where':'cart'
		},function (e){
			// 生成订单成功，返回 SUCCESS
			result = JSON.parse(e);
			if(result['status'] == 'SUCCESS'){
				bill_id = result['bill_id'];
			}else{
				$.msgBox.mini('生成订单失败，请重新操作');
			}
		});
		
	});

	// 隐藏支付模块
	$('.cart-method-wrap').on('click',function (){
		$(this).addClass('hide');
	});

	// 组织事件冒泡
	$('.cart-method-box').on('click',function (e){
		e.stopPropagation();
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
	$('.gopay').on('click',function (){
		
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

});





