$(function(){
	$(".designer-img").mouseenter(function(){
		$(this).parent().find(".designer-img-des").show();
		$(this).parent().parent().find(".designer-imgs-down").show();
	});
	$(".designer-img").mouseleave(function(){
		$(this).parent().find(".designer-img-des").hide();
		$(this).parent().parent().find(".designer-imgs-down").hide();
	});
})