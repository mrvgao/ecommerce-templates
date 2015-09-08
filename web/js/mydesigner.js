$(function(){
	$(".img-block").mouseenter(function(){
		$(this).parent().find(".img-des-block").show();
	});
	$(".img-block").mouseleave(function(){
		$(this).parent().find(".img-des-block").hide();
	});
});