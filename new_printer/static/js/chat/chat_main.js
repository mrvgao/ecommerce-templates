// chat
var Chat = {};
Chat.localChatData = [];
Chat.bubbleListWithNickname = [];
Chat.chatWithBubble = false;
Chat.nowTargUser = null;
Chat.lastTargUser = null;
Chat.mainTargUser = null;
Chat.timerForHiddingBubble = null;

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
	socket.emit('chat/anonymous_user/connect');
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


	socket.on('callback/chat/anonymous_user/connect',function(myUsername, customerService){
		Chat.myUsername = myUsername;
		Chat.nowTargUser = customerService;	
		l('myname:'+Chat.myUsername);
		l('targ:'+Chat.nowTargUser);
	});


	socket.on('chat/a_user_disconnect', function(userInfo){
		var nickname = userInfo.nickname;
		$('.user-info-nickname:contains('+nickname+')').parents('.user-inlist').remove();
	});


	socket.on('chat/new_chat_message', function(message, fromUser){
		l('chat/new_chat_message:'+message+'/'+fromUser);

		if(Chat.nowTargUser === fromUser){
			Chat.appendChatContainerWithReceiveMsg(message, fromUser);
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

		// 逐条把聊天记录放到聊天面板里
		data.forEach(function(item, index){

			if(item.from_user === Main.userInfo.nickname){
				Chat.appendChatContainerWithHistoryMsg(item.content, Chat.messageSide.mySide);
			}else{
				Chat.appendChatContainerWithHistoryMsg(item.content, Chat.messageSide.otherSide);
			}
		});	
	}


	window.onbeforeunload = function(){
		/*socket.emit('chat/disconnect', Main.userInfo);*/
	}


	window.onkeydown = function (e) {
		e = e || window.event;
		var keycode = parseInt(e.keyCode);

		if (keycode === 9) { // tab键
			Chat.tabForBubble(e, keycode); // tab

			e.returnValue = false;
			return false;
		}

		if (keycode === 27) { // esc键

			// jump back to main chat window
			var targBubbleUser = $('.user-bubble-choosed').find('.user-info-nickname').html();
			Chat.jumpBackToMainChatWin( targBubbleUser );
		}

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
});


Chat.jumpBackToMainChatWin = function(bubbleTargUser){
	var chatBubble = $('.chat-bubble-main');
	var lastBubbleUser = Chat.bubbleListWithNickname[0];
	var bubbleUserDom = $('.user-info-nickname:contains("'+bubbleTargUser+'")').parents('.user-inlist');

	bubbleUserDom.removeClass('user-bubble-choosed');
	chatBubble.hide();
	$('.chat-input-area').focus();
	var targ = Chat.mainTargUser;
	Chat.mainTargUser = Chat.nowTargUser;
	Chat.nowTargUser = targ;
	Chat.chatWithBubble = false;
}


Chat.tabForBubble = function(e, keycode){
	var chatBubble = $('.chat-bubble-main');
	var bubbleMessageContDom = $('.chat-bubble-cont');
	var lastBubbleUser = Chat.bubbleListWithNickname[0];
	var bubbleUserDom = $('.user-info-nickname:contains("'+lastBubbleUser+'")').parents('.user-inlist');

	if( !Chat.chatWithBubble && Chat.bubbleListWithNickname.length > 0){
		bubbleUserDom.addClass('user-bubble-choosed').removeClass('remind');
		chatBubble.show();
		Chat.mainTargUser = Chat.nowTargUser;
		Chat.nowTargUser = lastBubbleUser;
		/*l('now user:'+Chat.nowTargUser);*/
		/*l('last user:'+Chat.mainTargUser);*/
		bubbleMessageContDom.html('');
		Chat.localChatData[lastBubbleUser].forEach(function(item, index){

			if(item.from_user !== Main.userInfo.nickname){	
				Chat.appendChatBubbleWithMsg( item.content, 'right');
			}else{
				Chat.appendChatBubbleWithMsg( item.content, 'left');
			}
		});
		Chat.contentToBottom(bubbleMessageContDom);
		$('.chat-bubble-input-area').focus();
		Chat.chatWithBubble = true;
	}else{
		;
	}
}


/*Chat.chatTextareaReturnKeyEvent = function(textareaDom){*/
/*textareaDom.focus(function (){ */
/*window.onkeydown = function (e) {*/
/*e = e || window.event;*/
/*var keycode = parseInt(e.keyCode);*/

/*if (keycode === 13) {// 回车键*/

/*if(textareaDom.html() !== null && textareaDom.html() !== ''){*/
/*var cont = Chat.sendMsg(textareaDom);*/
/*var chatContDomStr = '.'+textareaDom.attr('class').replace('input-area', 'cont');*/
/*l(chatContDomStr);*/
/*var chatContDom = $(chatContDomStr);*/
/*Chat.contentToBottom( chatContDom );	*/
/*Chat.saveChatDataInLocal( cont, Main.userInfo.nickname, Chat.nowTargUser);*/
/*}*/

/*e.returnValue = false;*/
/*return false;*/
/*}   */

/*if (keycode === 9) {// tab键*/
/*Chat.tabForBubble(e, keycode); // tab*/

/*e.returnValue = false;*/
/*return false;*/
/*}*/

/*if (keycode === 27) {// esc键*/

/*if(Chat.chatWithBubble){*/
/*Chat.bubbleListWithNickname.forEach(function(item, index){*/

/*// 在气泡消息列表里删除已读过气泡消息的用户记录*/
/*if(item === Chat.nowTargUser){*/
/*Chat.bubbleListWithNickname.splice(index, 1);*/
/*}*/
/*});*/

/*// jump back to main chat window*/
/*var targBubbleUser = $('.user-bubble-choosed').find('.user-info-nickname').html();*/
/*Chat.jumpBackToMainChatWin( targBubbleUser );*/
/*}*/
/*}*/

/*};  */
/*window.onkeyup = function (e) {*/
/*e = e || window.event;*/
/*var keycode = parseInt(e.keyCode);*/

/*if (keycode === 13) {// 回车键*/

/*if(Chat.timerForHiddingBubble !== null ){*/
/*clearTimeout(Chat.timerForHiddingBubble);*/
/*Chat.timerForHiddingBubble = null;*/
/*}*/
/*}*/
/*};*/
/*}); */
/*}*/


Chat.appendChatContainerWithReceiveMsg = function(newChatMsg, sender){
	/*var chatContDom = $('.chated-txt');*/
	/*var myMsg =*/
	/*"<div class='chat-message-container'>"+*/
	/*"<div class='chat-message "+side+"'>"+message+"</div>"+*/
	/*"</div>";*/
	/*chatContDom.html(chatContDom.html()+myMsg);*/

	var message = 
		'<div class="chat-word-us">'+
		'<p style="color:#6393d6" class="chat-word-title mb5">'+sender+'</p>'+
		'<div class="chat-word-cont">'+newChatMsg+'</div>'+
		'</div>';
	$('.chated-txt').html($('.chated-txt').html()+message);
	/*$('.chat-entry').html(null);*/
}


Chat.appendChatContainerWithHistoryMsg = function(message, side){
	var chatContDom = $('..chated-txt');
	var myMsg =
		"<div class='chat-message-container'>"+
		"<div class='chat-message "+side+"'>"+message+"</div>"+
		"</div>";
	chatContDom.html( myMsg + chatContDom.html() );
}


Chat.appendChatBubbleWithMsg = function(message, side){
	var chatContDom = $('.chat-bubble-cont');
	var myMsg =
		"<div class='chat-bubble-message-container'>"+
		"<div class='chat-bubble-message "+side+"'>"+message+"</div>"+
		"</div>";
	chatContDom.html( myMsg + chatContDom.html() );
}


Chat.appendChatBubbleWithReceiveMsg = function(message, side){
	var chatContDom = $('.chat-bubble-cont');
	var myMsg =
		"<div class='chat-bubble-message-container'>"+
		"<div class='chat-bubble-message "+side+"'>"+message+"</div>"+
		"</div>";
	chatContDom.html(chatContDom.html() + myMsg);
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
	Chat.appendChatContainerWithChatMsg(inputCont, Chat.myUsername);
	Chat.contentToBottom($('.chated-txt'));
	socket.emit('chat/new_chat_message',Chat.myUsername, Chat.nowTargUser, inputCont);
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
		/*opener.location = '/vender/myCollection/designers';*/
		opener.location = '/vender/myCollection/works';
	});

	$('.user-tool-help').click(function(){
		/*opener.location = '/vender/myCollection/designers';*/
	});
}
