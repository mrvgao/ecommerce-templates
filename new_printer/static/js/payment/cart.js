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
		_method = 'ali';

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

	});

	// 单选
	cart_checkbox.on('click',function (){
		setAccount();
		setNum();
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

	// 删除单个
	del_btn.on('click',function (){
		var _this = $(this),
			_parent = _this.parents('.cart-box'),
			goods_id = _parent.attr('data-id');
		
		$.post('/payment/cart/remove',{
			'goods_id': goods_id
		},function (e){
			// 如果购物车中没有商品了，就返回 false
			if(e){
				_parent.remove();
			}else {
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
			_method = 'ali';
		}else {
			_method = 'tencen';
		}
	});

	// 去支付
	$('.gopay').on('click',function (){
		$.post('/shop/goods-detail/gopay',{
			'pay_method': _method
		},function (){});
	});

});





