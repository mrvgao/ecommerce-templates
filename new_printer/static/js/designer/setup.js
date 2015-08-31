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
		set_head_btn = $('.set-head-btn'),
		head_file = $('.head-file'),
		change_wrap = $('.change-headportrait-wrap'),
		close_change = $('.close-change'),
		change_btn = $('.change-btn'),
		ali_test = [];

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
		alert(1)
		//console.log(ali_test[0],ali_test[1],ali_test[2])
		if(ali_test[0] && ali_test[1] && ali_test[2]){
			$.post('/designer/add_alipay',{},function (){});
		}
	});

	// 更改密码
	btn_changepw.on('click',function (){
		alert ('该应用暂停服务');
	});

	// 编辑头像
	head_portrait.on('click',function (){
		set_headportrait.fadeIn();
	});

	// 关闭编辑头像
	close_headportrait.on('click',function (){
		set_headportrait.hide();
	});

	set_head_btn.on('click',function (){
		head_file.click();
	});

	head_file.on('change',function (){
		set_headportrait.hide();
		change_wrap.fadeIn();
	});


	// 编辑头像时

	close_headportrait.on('click',function (){
		change_wrap.hide();
	});

	// 取消修改
	close_change.on('click',function (){
		change_wrap.hide();
	});

	// 点击确认修改头像完毕
	change_btn.on('click',function (){

	});

}())