// chat
var Chat = {};
Chat.localChatData = [];
/*Chat.bubbleListWithNickname = [];*/
/*Chat.chatWithBubble = false;*/
Chat.nowTargUser = null;
Chat.lastTargUser = null;
Chat.mainTargUser = null;
/*Chat.timerForHiddingBubble = null;*/

var socket = io('http://127.0.0.1:3000');

// main
var Main = {};
Main.userInfo = null;


Main.getUserInfoInLocalStorage = function(){
	Main.userInfo = null;
	if(localStorage.userInfo){
		Main.userInfo = JSON.parse(localStorage.userInfo);
	}
}

/*Main.checkLogin = function(){*/
/*if(Main.userInfo === undefined){*/
/*location.href = './login.html'*/
/*}*/
/*}*/


function l(cont){
	console.log(cont);
}


function last(cont, data){
	console.log(cont+JSON.stringify(data));data
};


Chat.messageSide = {
	mySide: 'left',
	otherSide: 'right'
};


Chat.getDateAndTime = function(){
	var date = new Date();
	var myDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	return myDate;
}


$(function(){
	Main.getUserInfoInLocalStorage();

	/*Main.checkLogin();*/

	// emit connect message to node
	/*if(Main.userInfo === null){*/
	/*var sessionUsername = sessionStorage.getItem('myUsername');*/
	var cookieUsername = Chat.getCookie('myUsername');
	socket.emit('chat/anonymous_user/connect', cookieUsername);

	/*}else{*/
	/*socket.emit('chat/logged_in_user/connect', Main.userInfo);*/
	/*}*/

	Chat.registerUserElement();

	socket.on('callback/chat/logged_in_user/connect', function(usersInfos){

		for (var i=0; i < usersInfos.length; i++ ){

			if(usersInfos[i].username !== Main.userInfo.username){
				l('app_user:'+usersInfos[i].nickname);
				/*ChatUI.appendUserList(usersInfos[i]);*/
				/*Chat.registerUserElement();*/
			}
		}
	});


	socket.on('chat/a_user_connect', function(userInfo){
		/*ChatUI.appendUserList(userInfo);*/
		/*Chat.registerUserElement();*/
		;
	});


	socket.on('callback/chat/anonymous_user/connect',function(myUsername, myNickname, customerService,chatData){
		Chat.myUsername = myUsername;
		Chat.myNickname = myNickname;
		Chat.nowTargUser = customerService;	
		/*sessionStorage.setItem("myUsername", myUsername);*/
		Chat.addCookie('myUsername', myUsername, 2);
		if(chatData !== null){
			console.log('data:'+JSON.stringify(chatData));
			Chat.appendChatContainerWithHistoryMsg(chatData);
		}
	});


	socket.on('chat/a_user_disconnect', function(userInfo){
		var nickname = userInfo.nickname;
		$('.user-info-nickname:contains('+nickname+')').parents('.user-inlist').remove();
	});


	socket.on('chat/new_chat_message', function(message, fromUser, fromNickname){
		l('chat/new_chat_message:'+message+'/'+fromUser);

		if(Chat.nowTargUser === fromUser){
			Chat.appendChatContainerWithReceiveMsg(message, fromNickname);
			var	chatContainerDom = $('.chated-txt');
			Chat.contentToBottom(chatContainerDom);
		}else{
			;
		}
		/*Chat.saveChatDataInLocal( message, fromUser, fromUser);*/
	});


	socket.on('callback/chat/get_chat_data', function(chatWithUser, data){

		if(chatWithUser === Chat.nowTargUser){
			Chat.loadChatHistory(data);

			if(typeof(Chat.localChatData[chatWithUser]) === 'undefined'){
				Chat.localChatData[chatWithUser] = [];
			}
			Chat.localChatData[chatWithUser] = [];

			// 把聊天记录保存到内存
			data.forEach(function(item, index){
				Chat.localChatData[chatWithUser].push(item);
			});
			Chat.contentToBottom($('.chated-txt'));
		}
	});


	Chat.loadChatHistory = function(data){
;
/*// 逐条把聊天记录放到聊天面板里*/
/*data.forEach(function(item, index){*/

/*if(item.from_user === Main.userInfo.nickname){*/
/*Chat.appendChatContainerWithHistoryMsg(item.content, Chat.messageSide.mySide);*/
/*}else{*/
/*Chat.appendChatContainerWithHistoryMsg(item.content, Chat.messageSide.otherSide);*/
/*}*/
/*});	*/
	}


	window.onbeforeunload = function(){
		/*socket.emit('chat/disconnect', Main.userInfo);*/
	}


	window.onkeydown = function (e) {
		e = e || window.event;
		var keycode = parseInt(e.keyCode);

		/*if (keycode === 9) { // tab键*/
		/*Chat.tabForBubble(e, keycode); // tab*/

		/*e.returnValue = false;*/
		/*return false;*/
		/*}*/

		/*if (keycode === 27) { // esc键*/

		/*// jump back to main chat window*/
		/*var targBubbleUser = $('.user-bubble-choosed').find('.user-info-nickname').html();*/
		/*Chat.jumpBackToMainChatWin( targBubbleUser );*/
		/*}*/

		if (keycode === 13) { // enter
			Chat.sendMsg();

			e.returnValue = false;
			return false;
		}
	}


	/*Chat.chatTextareaReturnKeyEvent($('.chat-input-area'));*/
	/*Chat.chatTextareaReturnKeyEvent($('.chat-bubble-input-area'));*/


	$('.chatting-btn').click(function(){
		Chat.sendMsg();
	});


	$('.chat-problem-cont a').click(function(){
		var chatProblem = $(this).html();
		Chat.appendChatContainerWithChatMsg(chatProblem, Chat.myUsername);
		Chat.contentToBottom($('.chated-txt'));
		socket.emit('chat/FAQ',chatProblem);
	});

	Chat.quickToolStuff();

	var r = true;
	$(window).unload(function () {
		if (r) {

			//这里面证明用户不是点的F5刷新 执行你的操作
			$.ajax({
				type: "Post",
				url: "/shop/chat_customer_service_win",
				error: function (e) { alert("出错:"+JSON>stringify(e)); },
				success: function (data, textStatus) {
					alert('关闭窗体');
				}
			});
		}
	});

	$('.chat-entry').focus();
});


Chat.appendChatContainerWithReceiveMsg = function(newChatMsg, sender){
	var message = 
		'<div class="chat-word-us">'+
		'<p style="color:#6393d6" class="chat-word-title mb5">'+sender+'</p>'+
		'<div class="chat-word-cont">'+newChatMsg+'</div>'+
		'</div>';
	$('.chated-txt').html($('.chated-txt').html()+message);
}


Chat.appendChatContainerWithHistoryMsg = function(data){
	data.forEach(function(item, index){
		if(item.fromUser === Chat.myUsername){
			Chat.appendChatContainerWithChatMsg(item.message, item.fromNickname);
		}else{
			Chat.appendChatContainerWithReceiveMsg(item.message, item.fromNickname);
		}
	});
}


Chat.contentToBottom = function(chatContainerDom){
	chatContainerDom.scrollTop( chatContainerDom[0].scrollHeight);
}


Chat.registerUserElement = function(){
	ChatUI.userInListHoverEffect();

	$('.user-inlist').click(function(){
		var thisUser = $(this).find('.user-info-nickname').html();
		$(this).addClass('user-choosed').siblings().removeClass('user-choosed');
		Chat.nowTargUser = thisUser;
		$('.chat-input-area').focus();

		$('.chated-txt').html('');

		if(Chat.localChatData[Chat.nowTargUser] === undefined){
			var selectFrom = 0;
			var selectSum = 10; 
			socket.emit('chat/get_chat_data', Main.userInfo.nickname, Chat.nowTargUser, selectFrom, selectSum);
		}else{
			Chat.loadChatHistory(Chat.localChatData[Chat.nowTargUser]);
			Chat.contentToBottom($('.chated-txt'));
		}
	}); 
}


Chat.saveChatDataInLocal = function(content, fromUser, chatWith){
	var oneChatData;
	var date = Chat.getDateAndTime();
	oneChatData = { content: content, from_user: fromUser, date: date }; 

	if(typeof(Chat.localChatData[chatWith]) === 'undefined'){
		Chat.localChatData[chatWith] = [];
	}
	Chat.localChatData[chatWith].unshift(oneChatData);		
}

Chat.sendMsg = function(){
	var inputCont = $('.chat-entry').html();						
	if(inputCont === ''){
		return;
	} 
	Chat.appendChatContainerWithChatMsg(inputCont, Chat.myNickname);
	Chat.contentToBottom($('.chated-txt'));
	socket.emit('chat/new_chat_message',Chat.myUsername, Chat.myNickname, Chat.nowTargUser, inputCont);
}


Chat.appendChatContainerWithChatMsg = function(newChatMsg, sender){
	var message = 
		'<div class="chat-word-customer>'+
		'<p class="chat-word-title mb5">'+sender+'</p>'+
		'<div class="chat-word-cont">'+newChatMsg+'</div>'+
		'</div>';


	var message = 
		'<div class="chat-word-customer">'+
		'<p class="chat-word-title mb5">'+sender+'</p>'+
		'<div class="chat-word-cont">'+newChatMsg+'</div>'+
		'</div>';
	$('.chated-txt').html($('.chated-txt').html()+message);
	$('.chat-entry').html(null);
}


Chat.quickToolStuff = function(){
	$('.user-tool-download').click(function(){
		opener.location = '/vender/vender-center';
	});

	$('.user-tool-mark').click(function(){
		opener.location = '/vender/myCollection/works';
	});

	$('.user-tool-help').click(function(){
		/*opener.location = '/vender/myCollection/designers';*/
	});
}


// 设置 cookie
Chat.addCookie = function(name, value, expiresDays){ 
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
Chat.getCookie = function(name){
	var strCookie = document.cookie,
		arrCookie = strCookie.split("; ");

	for(var i=0;i<arrCookie.length;i++){
		var arr = arrCookie[i].split("=");
		if(arr[0] == name) return arr[1];
	}   
	return ""; 
}
