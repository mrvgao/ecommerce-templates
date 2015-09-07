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
		goods_id = detail_wrap.attr('data-id'),
		slider_img = $('.slider-img'),
		goods_img = $('.goods-img'),
		login_page = $('.login-page'),
		airm_before = $('.airm-before'),
		goods_tomark = $('.goods-tomark'),
		list_mark_btn = $('.list-mark-btn'),
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
			login_page.fadeIn();
		}
	});

	// 加入购物车
	addcart.on('click',function (){
		var _that = paynow;
		if(_that.attr('data-state') == 1){

			$.post('/payment/add_cart',{
				'goods_id': goods_id
			},function (e){
				result = JSON.parse(e);
				if(result['status'] == 'SUCCESS'){
					$.msgBox.mini('添加成功');
				}else{
					$.msgBox.mini('添加失败');
				}
			});

		}else if(_that.attr('data-state') == 0) {
			login_page.fadeIn();
		}
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
		goods_list.push(goods_id);	
		
		$.post('/designer/file_download',{
			'goods_list': goods_list
		},function (e){
			result = JSON.parse(e);
			glist = result['glist'];
			file_download_url = result['file_server_download'];
			for(var r in glist){
				md5 = glist[r]['md5'];
				zip_name = glist[r]['zip_name'];
				url = file_download_url+'/'+md5+'/'+zip_name;
				var obj=document.getElementById('download'); 
				obj.contentWindow.location.href=url; 
			}
		});

	});

	airm_before.eq(0).addClass('active');
	// 切换商品图片
	airm_before.on('click',function (){
		var _this = $(this),
			_src = _this.find('img').attr('src'),
			g_img = goods_img.find('img');
		if(_this.hasClass('slider-img')){
			g_img.attr('src',_src);
			$('#show-3d').hide();
		}else if(_this.hasClass('watch3d-img')){
			var stlId = GetRequest();
			showStlFileInRemoteServer(stlId, '', 460, 460, 'show-3d');
			$('#show-3d').show();
		}
		airm_before.removeClass('active');
		_this.addClass('active');
	});


	// added by white: get params in localhref
	function GetRequest() {
		var url = location.search; //获取url中"?"符后的字串
		if (url.indexOf("?") != -1) {    //判断是否有参数
			var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
			strs = str.split("=");   //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
			return strs[1];
		}
	}

	// mark
	goods_tomark.on('click',function (){
		var _this = $(this);
		toMark(_this,goods_id);
	});

	list_mark_btn.on('click',function (){
		var _this = $(this),
			_num = _this.attr('data-num');

		toMark(_this,_num);
	});

	// mark 的ajax方法
	function toMark(_this,id){
		$.post('/shop/mark-goods',{ goods_id: id },function (e){
            var data = JSON.parse(e);
            if(data.state == 'SUCCESS'){
            	if(_this.hasClass('active')){
            		_this.removeClass('active');
            	}else {
            		_this.addClass('active');
            	}
            }else {
            	$('.login-page').fadeIn();
            }
        });
	}

});







