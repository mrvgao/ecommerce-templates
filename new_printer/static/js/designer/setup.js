(function (){

	var add_alipay = $('.add-alipay-btn'),
		set_wrap = $('.set-alipay-wrap'),
		pay_empty = $('.pay-empty'),
		bind_btn = $('.bind-btn'),
		close_bind = $('.close-bind'),
		close_set = $('.close-set'),
		test_ico = $('.test-ico'),
		btn_changepw = $('.btn-changepw'),
		head_portrait = $('.head-portrait'),
		set_headportrait = $('.set-headportrait-wrap'),
		close_headportrait = $('.close-headportrait'),
		change_wrap = $('.change-headportrait-wrap'),
		close_change = $('.close-change'),
		change_btn = $('.change-btn'),
		ali_test = [],
		ali_val = [];



	// 取消设置/关闭弹出框
	close_set.on('click',function (){
		set_wrap.hide();
	});
	close_bind.on('click',function (){
		set_wrap.hide();
	});

	// 打开弹框
	add_alipay.on('click',function (){
		set_wrap.fadeIn();
	});

	// 支付宝绑定验证
	pay_empty.eq(0).on('blur',function (){
		var _this = $(this),
			_val = _this.val(),
			reg = /[\u4e00-\u9fa5]{2,4}/;/^[a-zA-Z]{1}[0-9a-zA-Z_]{1,}$/
		ali_val[0] = _val;

		if(_val && reg.test(_val)){
			test_ico.eq(0).removeClass('test-false');
			test_ico.eq(0).addClass('test-true');
			ali_test[0] = true;
		}else {
			test_ico.eq(0).removeClass('test-true');
			test_ico.eq(0).addClass('test-false');
			ali_test[0] = false;
		}

	});

	pay_empty.eq(1).on('blur',function (){
		var _this = $(this),
			_val = _this.val(),
			reg = /^[-\w]+$/;
		ali_val[1] = _val;
		if(_val && reg.test(_val)){
			test_ico.eq(1).removeClass('test-false');
			test_ico.eq(1).addClass('test-true');
			ali_test[1] = true;
		}else {
			test_ico.eq(1).removeClass('test-true');
			test_ico.eq(1).addClass('test-false');
			ali_test[1] = false;
		}
	});

	pay_empty.eq(2).on('blur',function (){
		var _this = $(this),
			_val = _this.val(),
			val = pay_empty.eq(1).val(),
			reg = /^[-\w]+$/;

		if(_val && reg.test(_val) && _val == val){
			test_ico.eq(2).removeClass('test-false');
			test_ico.eq(2).addClass('test-true');
			ali_test[2] = true;
		}else {
			test_ico.eq(2).removeClass('test-true');
			test_ico.eq(2).addClass('test-false');
			ali_test[2] = false;
		}
	});

	bind_btn.on('click',function (){

		for(var i=0;i<pay_empty.length;i++){
			var _txt = pay_empty.eq(i).val();
			if(_txt == '' || _txt == null){
				test_ico.eq(i).addClass('test-false');
			}
		}
		//alert('1');
		//console.log(ali_test[0],ali_test[1],ali_test[2])
		if(ali_test[0] && ali_test[1] && ali_test[2]){
			
			$.post('/designer/add_alipay',{'ali_name': ali_val[0], 'ali_num': ali_val[1] },function (e){
				result = JSON.parse(e);
				if(result['status'] == 'success'){
					window.location.reload();
				}else{
				}
					
			});
		}
	});

	// 更改密码
	btn_changepw.on('click',function (){
		alert ('该应用暂停服务');
	});

	head_portrait.on('click',function (){
		change_wrap.fadeIn();
	});

	// 编辑头像时

	close_headportrait.on('click',function (){
		change_wrap.hide();
	});



}())