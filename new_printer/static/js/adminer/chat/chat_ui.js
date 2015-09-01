var ChatUI = {};

/*ChatUI.setLayout = function(){*/
/*var winWidth = parseInt($('body').css('width'));*/
/*var winHeight = parseInt($('body').css('height'));*/
/*var userListWidth = parseInt($('#user-list').css('width'));*/
/*var chatInputHeight = parseInt($('#chat-input').css('height'));*/
/*$('.chat-main').width(winWidth-userListWidth);*/
/*$('.chat-cont').css('height',winHeight-chatInputHeight+'px');*/
/*}*/

$(function(){
	l('ui');
	/*$(window).load(function(){*/
	/*ChatUI.setLayout();*/
	/*});*/


	/*$(window).resize(function(){*/
	/*ChatUI.setLayout();*/
	/*});*/


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
		/*$(this).removeClass('user-'+sex+'-dark');*/
	},function(){
		$(this).removeClass('hovered');
	});
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
	l('remidnuser:'+username);
	;
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