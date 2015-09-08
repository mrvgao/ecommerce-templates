$(function(){
	$(".change-text").click(function() {
		$(".info2").show();	
	});

	$(".cancel").click(function() {
		$(".info2").hide();
	});
	$(".info").mousemove(function() {
		$(".info").css('border-style','dashed');
		$(".change-text").show();
	});
	$(".info").mouseout(function() {
		$(".info").css('border-style','');
		$(".change-text").hide();
	});
	$(".info2").mousemove(function() {
		$(".info").css('border-style','dashed');
		$(".change-text").show();
	});
	$(".info2").mouseout(function() {
		$(".info").css('border-style','');
		$(".change-text").hide();
	});

	$(".color-li").click(function() {
		$(".color-li").removeClass("color-li-selected");
		$(this).addClass("color-li-selected");
	});
	$(".size-li").click(function() {
		$(".size-li").removeClass("size-li-selected");
		$(this).addClass("size-li-selected");
	});

	$("#checkall").click(function() {
		if(this.checked){
			$("input[name='checkbox']").each(function(){
				this.checked=true;
			});
		}else{
			$("input[name='checkbox']").each(function(){
				this.checked=false;
			});
		}
	});

	$(".minus").click(function(){
		var count = $(this).parent().find("input").val();
		if(count>0){
			count--;
			$(this).parent().find("input").val(count);
		}

	});
	$(".plus").click(function(){
		var count = $(this).parent().find("input").val();
		count++;
		$(this).parent().find("input").val(count);
	});
	$("#bt_info2").click(function(){
		var select_color = $(this).parent().find(".color-li-selected")[0].innerText;
		var select_size = $(this).parent().find(".size-li-selected")[0].innerText;
		if(select_color!=undefined){
			$(this).parent().parent().find(".info").find("#color")[0].innerText = select_color;
		}
		if(select_size!=undefined){
			$(this).parent().parent().find(".info").find("#size")[0].innerText = select_size;
		}
		$(".info2").hide();
	});


});
