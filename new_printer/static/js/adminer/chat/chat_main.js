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



Chat.getTime = function(){
	var date = new Date();
	var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	return time;
}

$(function(){

	Main.getUserInfoInLocalStorage();

	// emit connect message to nodejs
	socket.emit('chat/customer_service/connect');

	Chat.registerUserElement();


	socket.on('callback/chat/customer_service/connect', function(ipAddress){
		Chat.myUsername = 'Service1';
	});


	socket.on('chat/a_user_connect', function(userInfo){
		/*ChatUI.appendUserList(userInfo);*/
		/*Chat.registerUserElement();*/
		;
	});


	socket.on('chat/a_user_disconnect', function(userInfo){
		var nickname = userInfo.nickname;
		$('.user-info-nickname:contains('+nickname+')').parents('.user-inlist').remove();
	});


	/*socket.on('chat/a_new_message', function(message, fromUser){*/
	socket.on('chat/new_chat_message', function(message, fromUser){
		l('chat/new_chat_message:'+message+'/'+fromUser);

		if(Chat.userInList(fromUser)){

			if(Chat.nowTargUser === fromUser){
				Chat.appendChatContainerWithReceiveMsg(message, fromUser);
				var	chatContainerDom = $('.chated-txt');
				Chat.contentToBottom(chatContainerDom);
			}else{
			l('3:'+Chat.nowTargUser+'/'+fromUser);
				ChatUI.remindUser(fromUser);
			}
		}else{
			var nickname = '匿名用户:'+fromUser;
			var userlogo = 'someImg';
			ChatUI.appendUserList(fromUser,nickname,userlogo);	
			ChatUI.showChatUserSum();
			ChatUI.remindUser(fromUser);
		}
		Chat.saveChatDataInLocal( message, fromUser, fromUser);
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


	Chat.loadChatHistory = function(chatWith){

		// 逐条把聊天记录放到聊天面板里
		Chat.localChatData[chatWith].forEach(function(item, index){
			l('t');
			l('tt:'+item.content);

			if(item.from_user === Chat.myUsername){
				Chat.appendChatContainerWithChatMsg(item.content, item.from_user);
			}else{
				Chat.appendChatContainerWithReceiveMsg(item.content, item.from_user);
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


	Chat.chatTextareaReturnKeyEvent($('.chat-input-area'));
	Chat.chatTextareaReturnKeyEvent($('.chat-bubble-input-area'));


	$('.chatting-btn').click(function(){
		Chat.sendMsg();
	});


	$('.chat-problem-cont a').click(function(){
		var chatProblem = $(this).html();
		Chat.appendChatContainerWithChatMsg(chatProblem, Chat.myUsername)
		Chat.contentToBottom($('.chated-txt'));
	});

	ChatUI.showChatUserSum();
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


/*Chat.tabForBubble = function(e, keycode){*/
/*var chatBubble = $('.chat-bubble-main');*/
/*var bubbleMessageContDom = $('.chat-bubble-cont');*/
/*var lastBubbleUser = Chat.bubbleListWithNickname[0];*/
/*var bubbleUserDom = $('.user-info-nickname:contains("'+lastBubbleUser+'")').parents('.user-inlist');*/

/*if( !Chat.chatWithBubble && Chat.bubbleListWithNickname.length > 0){*/
/*bubbleUserDom.addClass('user-bubble-choosed').removeClass('remind');*/
/*chatBubble.show();*/
/*Chat.mainTargUser = Chat.nowTargUser;*/
/*Chat.nowTargUser = lastBubbleUser;*/
/**//*l('now user:'+Chat.nowTargUser);*/
/**//*l('last user:'+Chat.mainTargUser);*/
/*bubbleMessageContDom.html('');*/
/*Chat.localChatData[lastBubbleUser].forEach(function(item, index){*/

/*if(item.from_user !== Main.userInfo.nickname){	*/
/*Chat.appendChatBubbleWithMsg( item.content, 'right');*/
/*}else{*/
/*Chat.appendChatBubbleWithMsg( item.content, 'left');*/
/*}*/
/*});*/
/*Chat.contentToBottom(bubbleMessageContDom);*/
/*$('.chat-bubble-input-area').focus();*/
/*Chat.chatWithBubble = true;*/
/*}else{*/
/*;*/
/*}*/
/*}*/


Chat.chatTextareaReturnKeyEvent = function(textareaDom){
	textareaDom.focus(function (){ 
		window.onkeydown = function (e) {
			e = e || window.event;
			var keycode = parseInt(e.keyCode);

			if (keycode === 13) {// 回车键

				if(textareaDom.html() !== null && textareaDom.html() !== ''){
					var cont = Chat.sendMsg(textareaDom);
					var chatContDomStr = '.'+textareaDom.attr('class').replace('input-area', 'cont');
					l(chatContDomStr);
					var chatContDom = $(chatContDomStr);
					Chat.contentToBottom( chatContDom );	
					Chat.saveChatDataInLocal( cont, Chat.myUsername, Chat.nowTargUser);
					l('save:'+cont+'/'+Chat.myUsername+'/'+Chat.nowTargUser);
					/*Chat.saveChatDataInLocal( message, fromUser, fromUser);*/
				}

				// 如果在用聊天气泡 还需添加更多的特殊功能
				if(Chat.chatWithBubble){

					// 在气泡消息列表里删除已读过气泡消息的用户记录
					Chat.bubbleListWithNickname.forEach(function(item, index){
						if(item === Chat.nowTargUser){
							Chat.bubbleListWithNickname.splice(index, 1);
						}
					});

					if( Chat.timerForHiddingBubble === null ){
						Chat.timerForHiddingBubble = setTimeout( function(){
							var targBubbleUser = $('.user-bubble-choosed').find('.user-info-nickname').html();
							Chat.jumpBackToMainChatWin( targBubbleUser );
							clearTimeout(Chat.timerForHiddingBubble);
							Chat.timerForHiddingBubble = null;
						}, 1000);	
					}
				}

				e.returnValue = false;
				return false;
			}   

			if (keycode === 9) {// tab键
				Chat.tabForBubble(e, keycode); // tab

				e.returnValue = false;
				return false;
			}

			if (keycode === 27) {// esc键

				if(Chat.chatWithBubble){
					Chat.bubbleListWithNickname.forEach(function(item, index){

						// 在气泡消息列表里删除已读过气泡消息的用户记录
						if(item === Chat.nowTargUser){
							Chat.bubbleListWithNickname.splice(index, 1);
						}
					});

					// jump back to main chat window
					var targBubbleUser = $('.user-bubble-choosed').find('.user-info-nickname').html();
					Chat.jumpBackToMainChatWin( targBubbleUser );
				}
			}

		};  
		window.onkeyup = function (e) {
			e = e || window.event;
			var keycode = parseInt(e.keyCode);

			if (keycode === 13) {// 回车键

				if(Chat.timerForHiddingBubble !== null ){
					clearTimeout(Chat.timerForHiddingBubble);
					Chat.timerForHiddingBubble = null;
				}
			}
		};
	}); 
}


Chat.appendChatContainerWithReceiveMsg = function(message, sender){
	var chatContDom = $('.chated-txt');
	var myMsg =
		'<div class="chat-message">'+
		'<div class="chat-message-info">'+
		'<span>'+sender+'</span>'+
		'<span style="padding-left: 8px;">'+Chat.getTime()+'</span>'+
		'</div>'+
		'<div class="chat-message-cont">'+message+'</div>'+
		'</div>';
	chatContDom.html(chatContDom.html()+myMsg);
}


Chat.appendChatContainerWithHistoryMsg = function(message, side){
	var chatContDom = $('.chated-txt');
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


/*Chat.appendChatBubbleWithReceiveMsg = function(message, side){*/
/*var chatContDom = $('.chat-bubble-cont');*/
/*var myMsg =*/
/*"<div class='chat-bubble-message-container'>"+*/
/*"<div class='chat-bubble-message "+side+"'>"+message+"</div>"+*/
/*"</div>";*/
/*chatContDom.html(chatContDom.html() + myMsg);*/
/*}*/


Chat.contentToBottom = function(chatContainerDom){
	chatContainerDom.scrollTop( chatContainerDom[0].scrollHeight);
}


Chat.registerUserElement = function(){
	ChatUI.userInListHoverEffect();

	$('.chat-user').click(function(){
		var thisUser = $(this).attr('username');

		if(thisUser !== Chat.nowTargUser){
			$(this).addClass('choosed').siblings().removeClass('choosed');
			Chat.nowTargUser = thisUser;
			l('thisuser:'+thisUser);
			$('.chat-entry').focus();
			$('.chated-txt').html('');

			if(Chat.localChatData[Chat.nowTargUser] === undefined){
				/*var selectFrom = 0;*/
				/*var selectSum = 10; */
				/*socket.emit('chat/get_chat_data', Main.userInfo.nickname, Chat.nowTargUser, selectFrom, selectSum);*/
				/*}else{*/
				/*Chat.loadChatHistory(Chat.localChatData[Chat.nowTargUser]);*/
				/*Chat.contentToBottom($('#chat-cont'));*/
			}else{
				Chat.loadChatHistory(thisUser);
				/*Chat.appendChatContainerWithHistoryMsg();*/
			}
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
	Chat.localChatData[chatWith].push(oneChatData);		
}

Chat.sendMsg = function(){
	var inputCont = $('.chat-entry').html();						
	Chat.appendChatContainerWithChatMsg(inputCont, Chat.myUsername);
	Chat.contentToBottom($('.chated-txt'));
	socket.emit('chat/new_chat_message',Chat.myUsername, Chat.nowTargUser, inputCont);
	Chat.saveChatDataInLocal( inputCont, Chat.myUsername, Chat.nowTargUser);
	$('.chat-entry').html(null);
}


Chat.appendChatContainerWithChatMsg = function(newChatMsg, sender){
	var chatContDom = $('.chated-txt');
	var myMsg =
		'<div class="chat-message">'+
		'<div class="chat-message-info" style="color:#30B1BD;">'+
		'<span>'+sender+'</span>'+
		'<span style="padding-left: 8px;">'+Chat.getTime()+'</span>'+
		'</div>'+
		'<div class="chat-message-cont">'+newChatMsg+'</div>'+
		'</div>';
	chatContDom.html(chatContDom.html()+myMsg);
}


Chat.userInList = function(username){
	l('check userlist:'+username);
	var userlist = $('.user-list');
	/*l('userlist:'+userlist.html());*/
	var thisUser = $('div[username|='+username+']');
	var inList = false;
	if(thisUser.html() !== undefined){
		l(thisUser.html());
		inList = true;
		l('b:'+inList);
	}
	/*userlist.find('.chat-user').forEach(function(item, index){*/
	/*l('a:'+item.attr('name'));									   */
	/*});*/

	return inList;
}
