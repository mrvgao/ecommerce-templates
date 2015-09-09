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
})


ChatUI.appendUserList = function(userInfo){
	var userList = $('#user-list');
	var newUserElement = 
		"<div value='"+userInfo.sex+"' class='user-inlist user-"+userInfo.sex+"-dark'>"+
		"<div class='user-logo'>"+
		"<img src='"+''+"'>"+
		"</div>"+
		"<div class='user-info'>"+
		"<p class='user-info-nickname'>"+userInfo.nickname+"</p>"+
		"<p class='user-info-task-cont'>"+userInfo.task+"</p>"+
		"</div>"+
		"</div>";
	userList.html(userList.html() + newUserElement);	
}


ChatUI.userInListHoverEffect = function(){
	$('.user-inlist').hover(function(){
		var sex = $(this).attr('value');
		$(this).addClass('user-'+sex+'-light');
		$(this).removeClass('user-'+sex+'-dark');
	},function(){
		var sex = $(this).attr('value');
		$(this).removeClass('user-'+sex+'-light');
		$(this).addClass('user-'+sex+'-dark');
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
