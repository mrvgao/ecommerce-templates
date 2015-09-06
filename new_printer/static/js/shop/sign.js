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
		signUp = $('.signUp'),
		phone_register,
		phone_code;

	var uphone = getCookie('uphone');
	if(uphone){
		$('.is_registered').val(uphone);
	}

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

				//注册，验证邀请码
				if(_this.hasClass('invitecode')){
					
					var _this = $(this);
					phone_register = _this.parents('.sign-bindphoto').find('.sign-input').eq(0).val();
					code_register = _this.parents('.sign-bindphoto').find('.sign-input').eq(1).val();
					
					$.post('/account/check_code',{'phone':phone_register,'code':code_register},function (e){
						result = JSON.parse(e);
						// 如果存在就返回 true , 否则就返回 false
						if(result['status']=='TRUE'){
							_next.slideUp();
							_this.removeClass('active');
							signInResult[1] = true;
						}else {
							_next.slideDown();
							_this.addClass('active');
							signInResult[1] = false;
						}
						
					});
				}

				//注册，验证用户名
				if(_this.hasClass('is_username')){
					
					var _this = $(this);
					username = _this.parents('.sign-signUp').find('.sign-input').eq(0).val();
					
					$.post('/account/check_username',{'username':username},function (e){
						result = JSON.parse(e);
						// 如果存在就返回 true , 否则就返回 false
						if(result['status']=='FALSE'){
							_next.slideUp();
							_this.removeClass('active');
							signInResult[0] = true;
						}else {
							_next.slideDown();
							_this.addClass('active');
							_ts.text('该用户名已被注册');
							signInResult[0] = false;
						}
						
					});
				}

				if(!_this.hasClass('is_registered') && !_this.hasClass('is_registered_r') && !_this.hasClass('invitecode') && !_this.hasClass('is_username') && !_this.hasClass('login-upw')){
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
			var _this = $(this);
			testNoBlur(_this);
			username = _this.parents('.sign-signUp').find('.sign-input').eq(0).val();
			pwd = _this.parents('.sign-signUp').find('.sign-input').eq(1).val();
			
			if(signUpResult[0] && signUpResult[1] && signUpResult[2]){
				$.post('/account/u_register',{'phone':phone_register,'code':code_register,'username':username,'password':pwd},function (e){
					result = JSON.parse(e);
					if (result['status'] == 'FAILURE'){
						$.msgBox.mini('注册失败，请重新注册');
					}else{
						$.msgBox.mini('注册成功，请登陆');
						input_play_box.animate({'left':-500});
					}

				});
			}
		});


		// 返回上一步
		back_prev.on('click',function (){
			input_play_box.animate({'left':0});
		});


		// 登陆
		login_btn.on('click',function (){
			
			var _this = $(this),
				_input = _this.parents('.sign-signIn').find('.sign-input'),
				phone = _input.eq(0).val(),
				pwd = _input.eq(1).val(),
				pwd_ts = _input.eq(1).next().find('span');

			testNoBlur(_this);

			// 记住密码 isRemeber: true 为记住, false 为不记住
			if(signIn_remeber.checked){
				isRemeber = true;
			}else {
				isRemeber = false;
			}

			if(signInResult[0] && signInResult[1]){
				
				$.post('/account/u_login',{'phone':phone,'password':pwd},function (e){
					result = JSON.parse(e);
					if (result['status'] == 'FAILURE'){
						pwd_ts.text('密码错误，请重新输入');
						_input.eq(1).addClass('active');
						_input.eq(1).next().slideDown();
					}else{
						if(isRemeber){
							// set Cookie
							addCookie('uphone', phone, 10);
						}
						
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

	// 设置 cookie
	function addCookie(name, value, expiresDays){ 
		var cookieString = name + "=" + escape(value);

		// 判断是否设置过期时间
		if(expiresDays>0){
			var date=new Date();
			date.setTime(date.getTime + expiresDays*24*3600*1000);
			cookieString = cookieString + "; expires=" + date.toGMTString();
		}
		document.cookie = cookieString;
	}

	// 获取 cookie
	function getCookie(name){
		var strCookie = document.cookie,
			arrCookie = strCookie.split("; ");

		for(var i=0;i<arrCookie.length;i++){
			var arr = arrCookie[i].split("=");
			if(arr[0] == name) return arr[1];
		}
		return "";
	}
	
})