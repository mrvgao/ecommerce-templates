$(function (){

	var getCodeBtn = $('.getcode-btn'),
		empty_phone = $('.empty-phone'),
		empty_inputs = $('.empty-code-box input'),
		pwf_next = $('.pwf-next'),
		pwf_btn = $('.pwf-true'),
		empty_newpw = $('.empty-newpw'),
		empty_pwagin = $('.empty-pwagin'),
		remeber_ts = $('.get-code').find('.sign-warning'),
		ts_txt = remeber_ts.find('span'),
		validpw = false,
		valid_bool = false;

	// 获取验证码
	getCodeBtn.on('click',function (){
		var _txt = empty_phone.val();

		if(valid_bool){
			$.post('/account/send_verify_message',{'phone':_txt},function (e){
				
				$.msgBox.mini('验证码发送成功，请注意查收!',function (){
					empty_inputs.eq(0).focus();
				});
			});
		}else {
			remeber_ts.fadeIn();
		}
	});

	empty_phone.on('keyup',function (e){
		var _this = $(this),
			kc = e.keyCode,
			_txt = _this.val(),
			reg = /^1[3-8]+\d{9}$/;

		valid_bool = false;
		
		if(_txt.length == 11){
			if(_txt && reg.test(_txt)){

				$.post('/account/check_phone',{'phone':_txt},function (e){
					result = JSON.parse(e);
					if(result['status']=='TRUE'){
						remeber_ts.hide();
						valid_bool = true;
					}else {
						ts_txt.text('手机号未被注册');
						remeber_ts.fadeIn();
						valid_bool = false;
					}
				});
			}else {
				ts_txt.text('手机号格式不正确');
				remeber_ts.fadeIn();
			}
		}
	});

	function testPhone(){

	}

	// 设置长度只能为 1
	empty_inputs.attr('maxlength',1);
	empty_inputs.on('keyup',function (e){
		var _this = $(this),
			_txt = _this.val(),
			kc = e.keyCode;
		
		if(kc >= 48 && kc <= 57){
			_this.next().focus();
		}
		
	});

	// 进入下一步
	pwf_next.on('click',function (){
		var codeNum = '';
		var phone = empty_phone.val()
		for(var i=0;i<empty_inputs.length;i++){
			codeNum += empty_inputs.eq(i).val();
		}

		$.post('/account/pwd_checkcode',{'phone':phone,'code':codeNum},function (e){
			result = JSON.parse(e);
			if(result['status'] == 'TRUE'){
				$('.pwf-setnew ').show();
				$('.pwf-underline').animate({'left': 330});
				$('.find-cont').animate({'left': -280});
			}else {
				$.msgBox.mini('验证码输入错误');
			}
		});
		
	});

	// 输入密码
	empty_newpw.on('blur',function (){
		var _this = $(this),
			_txt = _this.val(),
			reg = /^[a-zA-Z0-9_]{6,18}$/,
			_new = empty_newpw.val(),
			_agin = empty_pwagin.val();

		if(reg.test(_txt)){
			if(_new == _agin){
				validpw = true;
				_this.removeClass('active');
				$('.newpw-ts').hide();
			}else {
				validpw = false;
				$('.aginpw-ts').fadeIn();
				empty_pwagin.addClass('active');
			}
			_this.removeClass('active');
			$('.newpw-ts').hide();
		}else {
			validpw = false;
			_this.addClass('active');
			$('.newpw-ts').fadeIn();
		}
	});

	// 确认密码
	empty_pwagin.on('blur',function (){
		var _this = $(this),
			_new = empty_newpw.val(),
			_agin = empty_pwagin.val();

		if(_new == _agin){
			validpw = true;
			_this.removeClass('active');
			$('.aginpw-ts').hide();
		}else {
			validpw = false;
			_this.addClass('active');
			$('.aginpw-ts').fadeIn();
		}
	});

	// 确认修改
	pwf_btn.on('click',function (){
		console.log(validpw);
		if(validpw){
			var new_password = empty_pwagin.val();

			$.post('/account/u_resetpwd',{'password':new_password},function (e){
				// do something
				result = JSON.parse(e);
				if (result['status'] == 'FAILURE'){
						$.msgBox.mini('重置密码出错');
					}else{
						window.location.assign('/shop/login_register');
					}
			});
		}
	});

})