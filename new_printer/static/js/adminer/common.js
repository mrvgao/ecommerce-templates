var Commom = {};
$(function(){
	/*$.post('/adminer/word_list',*/
		   /*{},*/
		   /*function(e){*/
		   /*l('r');*/
		   /*l(e);*/
		   /*});*/

		   /*$.post({*/
		   /*type: "GET",*/
		   /*url: "/adminer/word_list",*/
		   /*data: {},*/
		   /*dataType: "json",*/
		   /*success: function(data){*/
		   /**//*$('#resText').empty();   //清空resText里面的所有内容*/
		   /**//*var html = ''; */
		   /**//*$.each(data, function(commentIndex, comment){*/
		   /**//*html += '<div class="comment"><h6>' + comment['username']*/
		   /**//*+ ':</h6><p class="para"' + comment['content']*/
		   /**//*+ '</p></div>';*/
		   /**//*});*/
		   /**//*$('#resText').html(html);*/
		   /*l('yes');*/
		   /*}*/
		   /*});*/

	$('.tool-bar').children('div').eq(0).click(function(){
		$('.goods-container').show();
		$('.chat-container').hide();
		$(this).addClass('tool-bar-choosed').removeClass('tool-bar-not-choosed').siblings().removeClass('tool-bar-choosed');
	});

	$('.tool-bar').children('div').eq(1).click(function(){
		$('.goods-container').hide();
		$('.chat-container').show();
		$(this).addClass('tool-bar-choosed').removeClass('tool-bar-not-choosed').siblings().removeClass('tool-bar-choosed');
	});
});
