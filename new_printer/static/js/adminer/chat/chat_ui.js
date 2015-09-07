var ChatUI = {};


$(function(){
	ChatUI.initFaceBox($('#face-box ul'), 'emo_', 60);


	$('#face').hover(function(){
		$('#face-box').show();
	},function(){
		$('#face-box').hide();
	});


	$('#face-box').hover(function(){
		$(this).show();						
	},function(){
		$(this).hide();						
	});


	ChatUI.useFace();

	ChatUI.msgRemindMark = '<div id="msg-remind-mark" style="float: right;margin-right: 28px;">NM</div>';
})


ChatUI.appendUserList = function(username,nickname,userLogo){
	l('append');
	var userList = $('.user-list');
	var newUserElement = 
		'<div class="chat-user" username="'+username+'">'+
		'<img src="'+userLogo+'">'+
		'<div>'+nickname+'</div>'+
		'</div>';
	userList.html(userList.html() + newUserElement);	
	Chat.registerUserElement();
}


ChatUI.userInListHoverEffect = function(){
	$('.chat-user').hover(function(){
		$(this).addClass('hovered');
	},function(){
		$(this).removeClass('hovered');
	});
}


ChatUI.showChatUserSum = function(){
	var chatUserSum = $('.chat-user').length;
	$('#chat-user-sum').html(chatUserSum);
}


ChatUI.initFaceBox = function( faceBoxDom, faceName, faceSum ){
	for (var i = 1; i <= faceSum; i++){
		var faceDom = 
			'<li><a href="javascript:;">'+
			'<img src="../static/images/chat/'+faceName+i+'.gif"></a></li>';
		faceBoxDom.append(faceDom); 
	}   
}


ChatUI.useFace = function(){
	$('#face-box img').click(function(){
		var thisFaceDom = $(this).prop("outerHTML");
		$('.chat-entry').html($('.chat-entry').html() + thisFaceDom);
	});	
}

ChatUI.remindUser = function(username){
	var thisUser = $('div[username|='+username+']');
	var timer = setInterval(function(){
		if(thisUser.hasClass('hovered')){
			thisUser.removeClass('hovered');
		}else{
			thisUser.addClass('hovered');
		}
	},500)
	thisUser.click(function(){
		clearInterval(timer);			  
	});
};
