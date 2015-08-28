$(function (){
	var contact_btn = $('.contact-btn'),
		no_invite = $('.no-invite'),
		contact_wrap = $('.contact-info-wrap'),
		contact_close = $('.contact-close'),
		chat_box = $('.contact-wrap'),
		chat_btn = $('.contact-service-btn'),
		sign_input = $('.sign-input'),
		register_next = $('.register-next'),
		register_btn = $('.register-btn'),
		login_btn = $('.login-btn'),
		back_prev = $('.back-prev'),
		signIn_remeber = document.getElementsByClassName('signIn-remeber')[0],
		input_play_box = $('.input-play-box'),
		signIn = $('.signIn'),
		signUp = $('.signUp');


	// 显示弹出框
	contact_btn.on('click',function (){
		contact_wrap.show();
	});
	no_invite.on('click',function (){
		contact_wrap.show();
	});

	// 隐藏弹出框
	contact_close.on('click',function (){
		contact_wrap.hide();
	});

	// 点击联系客服
	chat_btn.on('click',function (){
		contact_wrap.fadeOut();
		chat_box.fadeIn();
	});

	signUp.on('click',function (){
		input_play_box.animate({'left':0});
		
		signHeadCut($(this));

	});

	signIn.on('click',function (){
		input_play_box.animate({'left':-500});
		
		signHeadCut($(this));
		
	});

	// 登陆、注册切换
	function signHeadCut(_this){
		var _parent = _this.parent(),
			_siblings = _this.parent().siblings();

		if(_parent.hasClass('fr')){
			_this.removeClass('f16').addClass('f20');
			_siblings.find('a').removeClass('f20').addClass('f16');
			_parent.removeClass('fr').addClass('fl');
			_siblings.removeClass('fl').addClass('fr');
		}
	}


	// sign 验证
	(function (){

		var bindphoneResult = [],
			signUpResult = [],
			signInResult = [],
			validResult = [],
			isRemeber = false,
			pw,
			pwagin;

		sign_input.on('blur',function (){
			var _this = $(this),
				_index = _this.parent().index(),
				_parents = _this.parent().parent().attr('data-p'),
				_next = _this.next(),
				_ts = _next.find('span'),
				_txt = _this.val(),
				_name = _this.attr('valid-type'),
				reg;

			switch(_name){
				case 'signUp-phone': reg = /^1[3-8]+\d{9}$/;
					break;
				case 'signUp-invitecode': reg = /^\d{4}$/;	// 邀请码为 4 个数字
					break;
				case 'signUp-name': reg = /([\s\S]*)/;	// 任意字符
					break;
				case 'signUp-pw': pw = _this.val();reg = /^[a-zA-Z0-9_]{6,18}$/;	// 密码限制为 6~18 位
					break;
				case 'signUp-pwagin': pwagin = _this.val();reg = /^[a-zA-Z0-9_]{6,18}$/;	// 密码限制为 6~18 位
					break;
			}

			if(_txt && reg.test(_txt)){
				validResult[_index] = true;

				// 验证确认密码
				if(_name == 'signUp-pwagin'){
					if(pw != pwagin){
						_next.slideDown();
						_this.addClass('active');
						validResult[_index] = false;
					}
				}

				// 登录， 查找该手机号是否存在于数据库中
				if(_this.hasClass('is_registered')){
					
					$.post('/account/check_phone',{'phone':_txt},function (e){
						result = JSON.parse(e);
						// 如果存在就返回 true , 否则就返回 false
						if(result['status']=='TRUE'){
							_next.slideUp();
							_this.removeClass('active');
							signInResult[0] = true;
						}else {
							_next.slideDown();
							_this.addClass('active');
							_ts.text('手机号未被注册');
							signInResult[0] = false;
						}
						
					});
				}
				
				if(_this.hasClass('is_registered_r')){
					
					$.post('/account/check_phone',{'phone':_txt},function (e){
						result = JSON.parse(e);
						// 如果存在就返回 true , 否则就返回 false
						if(result['status']=='TRUE'){
							_next.slideDown();
							_this.addClass('active');
							_ts.text('手机号已被注册');
							signInResult[0] = false;
						}else {
							_next.slideUp();
							_this.removeClass('active');
							signInResult[0] = true;
						}
						
					});
				}
				if(!_this.hasClass('is_registered') && !_this.hasClass('is_registered_r')){
					if(_next.css('display') == 'block'){
						_next.slideUp();
						_this.removeClass('active');
					}
				}
				
			}else {
				if(_this.hasClass('is_registered')){
					_ts.text('手机号格式不正确');
				}else if(_this.hasClass('is_registered_r')){
					_ts.text('手机号格式不正确');
				}
				validResult[_index] = false;
				_next.slideDown();
				_this.addClass('active');

			}

			switch(_parents){
				case 'bindphone': bindphoneResult = validResult;
					break;
				case 'signUp': signUpResult = validResult;
					break;
				case 'signIn': signInResult = validResult;
					break;
			}

			
			
		});

		// 点击下一步
		register_next.on('click',function (){
	
			testNoBlur($(this));

			if(bindphoneResult[0] && bindphoneResult[1]){
				input_play_box.animate({'left':-250});
			}
		});

		// 点击注册
		register_btn.on('click',function (){
			
			testNoBlur($(this));

			if(signUpResult[0] && signUpResult[1] && signUpResult[2]){
				$.post('',{},function (){
					// do something

				});
			}
		});

		// 返回上一步
		back_prev.on('click',function (){
			input_play_box.animate({'left':0});
		});

		// 登陆
		login_btn.on('click',function (){
			
			var _this = $(this);
			testNoBlur(_this);
			var phone = _this.parents('.sign-signIn').find('.sign-input').eq(0).val();
			var pwd = _this.parents('.sign-signIn').find('.sign-input').eq(1).val();
			
			
			// 记住密码 isRemeber: true 为记住, false 为不记住
			if(signIn_remeber.checked){
				isRemeber = true;
			}
			console.log(phone)
			if(signInResult[0] && signInResult[1]){
				
				$.post('/account/u_login',{'phone':phone,'password':pwd},function (e){
					result = JSON.parse(e);
					if (result['status'] == 'FAILURE'){
						$.msgBox.mini('登录失败，请重新输入');
					}else{
						window.location.assign('/shop/home');
					}
				});
				
			}
		});

		// 未点击input时直接点击了button
		function testNoBlur(_this){
			var _len = _this.parent().find('.sign-empty-box').length,
				_inputs = _this.parent().find('.sign-input');

			for(var i=0;i<_len;i++){
				if(_inputs.eq(i).val() == '' || _inputs.eq(i).val() == null){
					_inputs.eq(i).next().slideDown();
					_inputs.eq(i).addClass('active');
				}
			}
		}

	}());
	
})