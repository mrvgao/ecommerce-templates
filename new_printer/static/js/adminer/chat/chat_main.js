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

$(function(){

	Main.getUserInfoInLocalStorage();

	// emit connect message to nodejs
	socket.emit('chat/customer_service/connect');

	Chat.registerUserElement();


	socket.on('callback/chat/customer_service/connect', function(ipAddress){
		;
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


	socket.on('chat/a_new_message', function(message, fromUser){

		if(Chat.nowTargUser === fromUser){
			if(Chat.chatWithBubble){
				Chat.appendChatBubbleWithReceiveMsg(message, Chat.messageSide.otherSide);
				var	chatContainerDom = $('.chat-bubble-cont');
				Chat.contentToBottom(chatContainerDom);
			}else{
				Chat.appendChatContainerWithReceiveMsg(message, Chat.messageSide.otherSide);
				var	chatContainerDom = $('.chat-cont');
				Chat.contentToBottom(chatContainerDom);
			}
		}else{

			// 消息气泡提示
			var fromUserDom = $('.user-info-nickname:contains("'+fromUser+'")').parents('.user-inlist');
			fromUserDom.addClass('chat-bubble remind');

			Chat.bubbleListWithNickname.unshift(fromUser);
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
			Chat.contentToBottom($('#chat-cont'));
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


	Chat.chatTextareaReturnKeyEvent($('.chat-input-area'));
	Chat.chatTextareaReturnKeyEvent($('.chat-bubble-input-area'));


	$('.chatting-btn').click(function(){
		Chat.sendMsg();
	});


	$('.chat-problem-cont a').click(function(){
		var chatProblem = $(this).html();
		Chat.appendChatContainerWithChatMsg(chatProblem, 'test sender')
		Chat.contentToBottom($('.chated-txt'));
	});
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
					Chat.saveChatDataInLocal( cont, Main.userInfo.nickname, Chat.nowTargUser);
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


Chat.appendChatContainerWithReceiveMsg = function(message, side){
	var chatContDom = $('#chat-cont');
	var myMsg =
		"<div class='chat-message-container'>"+
		"<div class='chat-message "+side+"'>"+message+"</div>"+
		"</div>";
	chatContDom.html(chatContDom.html()+myMsg);
}


Chat.appendChatContainerWithHistoryMsg = function(message, side){
	var chatContDom = $('#chat-cont');
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

		$('#chat-cont').html('');

		if(Chat.localChatData[Chat.nowTargUser] === undefined){
			var selectFrom = 0;
			var selectSum = 10; 
			socket.emit('chat/get_chat_data', Main.userInfo.nickname, Chat.nowTargUser, selectFrom, selectSum);
		}else{
			Chat.loadChatHistory(Chat.localChatData[Chat.nowTargUser]);
			Chat.contentToBottom($('#chat-cont'));
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
		Chat.appendChatContainerWithChatMsg(inputCont, 'test sender');
		Chat.contentToBottom($('.chated-txt'));
}


Chat.appendChatContainerWithChatMsg = function(newChatMsg, sender){
		var newChatMsg = 
			'<div class="chat-word-us">'+
			'<p style="color:#6393d6" class="chat-word-title mb5">'+sender+'</p>'+
			'<div class="chat-word-cont">'+newChatMsg+'</div>'+
			'</div>';
		$('.chated-txt').html($('.chated-txt').html()+newChatMsg);
		$('.chat-entry').html(null);
}
