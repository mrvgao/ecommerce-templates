$(function(){
	$("#submit").click(function(){
		//get personnal info and post to server
		setDisabled();
	});

	$(".edit").click(function(){
		$("input").removeAttr("disabled");
		$("select").removeAttr("disabled");
		$("textarea").removeAttr("disabled");
		$(".label-li").bind("click",f_label);
		$("button").show();

	});
	function setDisabled(){
		$("input").attr("disabled",true);
		$("select").attr("disabled",true);
		$("textarea").attr("disabled",true);
		$(".label-li").unbind("click");
		$("button").hide();
	}
	
	function f_label(){
		
			if($($(this)).hasClass("label-li-select")){
			if($("#my_tag")[0].value.indexOf($(this).id+",")>0){
				$("#my_tag")[0].value.replace($(this).id+",","");
			}
			}else{
				$("#my_tag")[0].value=$("#my_tag")[0].value+$(this).id+",";
			}
			}
			$(this).toggleClass("label-li-select");
		};
		
		
		
	}
	
});
