/* 表单验证插件
 * 
 * 需要引入jQuery
 * 注意不要在css里给div标签设置样式,会影响效果
 * 必须给需要验证的input、textarea、select标签加上 form-valid 自定义属性 
 * 需要给提交按钮加上 form-submit 属性
 * form-null 属性，设置内容为空时显示的提示文字
 * form-err 属性，设置输入验证错误时的提示文字
 * form-type 属性设置验证的类型，有 email、tel、qq、s、url、psw，idcard intnum(整数),zipCode(邮编)
 * 小箭头▲ ▶ ◀ ▼ 可替换sanjiao里的箭头 可以在函数里改变样式 更简单的定义样式方法待补充
 * 不能对对象父级添加 line-height 属性
 */

var form_bool = false;	// 验证的最终 BOSS

(function(){

	var testInputs = $('input,textarea,select').filter("[form-valid]"),
		testSubmit = $('input,button').filter("[form-submit]"),
		isTrue = true,
		isWarn = false,		//警告框是否出现
		_txtNull = "输入不能为空",
		_txtErr = "输入格式不正确";

	testInputs.each(function(index,el) { 
		$(this).wrap('<div style="position: relative; display:inline-block; margin:0;padding:0;"></div>');
		$(this).parent().append('<div class="warningtip"></div><div class="sanjiao">▼</div>');
	});

	var warningtip = $('.warningtip');
	var sanjiao = $('.sanjiao');
	warningtip.css({ 	//设置警告框的样式
		position: 'absolute',
		top: '-51px',
		left:'0',
		opacity: 0,
		fontSize:'12px',
		color: '#fff',
		height:'14px',
		background:'#cb484c',
		borderRadius:'5px',
		padding:'5px 10px',
		whiteSpace:'nowrap',
		transition:'all .4s ease'

	});
	sanjiao.css({ //警告框的小三角
		position: 'absolute',
		top: '-32px',
		left:'20px',
		color:'#cb484c',
		fontSize:'12px',
		opacity:'0',
		transition:'all .4s ease'
	});
	function warnShow(element,thistext){ //警告框显示函数
		var thiswarn = element.siblings('.warningtip'),
			thisSanjiao = element.siblings('.sanjiao');
		thiswarn.text(thistext);
		thiswarn.css({
				top: '-31px',
				opacity: '1'
			});
		thisSanjiao.css({
				top: '-12px',
				opacity: '1'
			});
		isWarn = true;
		setTimeout(function (){		// 避免突兀，3s后提示框消失
			thiswarn.css({
				top: '-52px',
				opacity: '0'
			});
			thisSanjiao.css({
				top: '-32px',
				opacity: '0'
			});
		},3000);
	}

	function warnhide(element){ 	//警告框隐藏函数
		var thiswarn = element.siblings('.warningtip'),
			thisSanjiao = element.siblings('.sanjiao');
		thiswarn.css({
				top: '-52px',
				opacity: '0'
			});
		thisSanjiao.css({
				top: '-32px',
				opacity: '0'
			});
		isWarn = false;
	}

	function testNull(){	//测试是否为空的函数
		testInputs.each(function(index, el) { 
			var _this = $(this);
			var $txt = _this.val();
			if($txt === "" || $txt.length == 0){
				var thistext = _this.attr('form-null') || _txtNull;
				warnShow(_this,thistext);
			}
		});
		return isWarn === true ? false : true;
	}

	function getType(element){	//获取格式
		var _this =element;
			_thisType = _this.attr('form-type');
			if(_thisType){	//当有设置form-type属性时，检测格式是否正确
				var _thisCont = _this.val();
				typeTest(_this,_thisType,_thisCont);
			}else{
				return true;
			}
		return isTrue === true?true:false;
	}

	function typeTest(element,type,content){	//根据type类型调用相应的方法;
		var el = element,
			telReg = /^1[3|4|5|8][0-9]\d{4,8}$/,
			emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
			qqReg = /[1-9]\d{4,}/,
			zipCodeReg = /[1-9]\d{5}(?!\d)/,
			idcardReg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
			intnumReg = /^-?[1-9]\d*$/;

		switch(type){
			case "tel": testCont(el,content,telReg);
				break;
			case "email": testCont(el,content,emailReg);
				break;
			case "url": testCont(el,content,emailReg);
				break;
			case "qq": testCont(el,content,qqReg);
				break;
			case "zipCode": testCont(el,content,zipCodeReg);
				break;
			case "idcard": testCont(el,content,idcardReg);
				break;
			case "intnum": testCont(el,content,intnumReg);

		}
	}

	function testCont(element,content,reg){	//检测格式是否正确
		if(reg.test(content)){
			isTrue = true;
			return true;
		}else{
			var thisErr = element.attr('form-err') || _txtErr;
			warnShow(element,thisErr);
			isTrue = false;
			return false;
		}
	}

	testInputs.each(function(index, el){	//输入框填入内容时，取消警告框
		$(this).change(function(event) {
			var _this = $(this);
			if((_this.val()==="") ||(_this.val()==0)){
				var thischangetext = _this.attr('form-null') || _txtNull;
				warnShow(_this,thischangetext);
			}else if(!getType(_this)){
				var thiserrtext = _this.attr('form-err') || _txtErr;
				warnShow(_this,thiserrtext);
			}else{
				warnhide(_this);
			}
		});
	});

	testSubmit.on('click',function (){	//点击按钮后进行判断
		if(!testNull()){
			form_bool = false;
			return false;
		}else {
			form_bool = true;
		}
	});

})();