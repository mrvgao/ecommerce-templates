var Commom = {};
$(function(){
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

	Commom.initPageBtn();
	
	$('.pages-btn').click(function(){
		var btnVal = $(this).attr('value');
		if(btnVal === '-1' || btnVal === '+1'){
			var nowPageNo;
			$('.pages-btn').each(function(index){
				if($(this).hasClass('choosed')){
					nowPageNo = $(this).attr('value');
					var pageSum = $(".goods-container ul").find('li').length/2;
					if((btnVal === '-1' && nowPageNo > 1)||(btnVal === '+1' && nowPageNo < pageSum)){
						var targPageNo = parseInt(nowPageNo)+parseInt(btnVal);
						$('.pages-btn').eq(targPageNo).click();
					}
					return false;
				}
			});
		}else{
			var containerHeight = $(".goods-container ul").height();
			$(this).addClass('choosed').siblings().removeClass('choosed');
			$(".goods-container ul").animate({
				scrollTop: containerHeight*(btnVal-1)+'px'  //让body的scrollTop等于pos的top，就实现了滚动
			},0);
		}
	});

	$('.pages-btn').eq(1).click();

	$("[name|='good-deny']").click(function(){
		var workId = $(this).parents('.good-container').find('#good-id').html();					 
		workId = parseInt(workId);
		var denyReasonId = $("[name|='deny-reason']:checked").val()
		$.post('/adminer/pass_failed', {'id': workId, 'state': denyReasonId}, function(e){
			l('deny succeed');	  
		})
	});

	$("[name|='good-pass']").click(function(){
		var workId = $(this).parents('.good-container').find('#good-id').html();					 
		workId = parseInt(workId);
		var goodType = $('#good-type').val();
		var goodStyle = $('#good-style').val();
		$.post('/adminer/work_passing', {'id': workId, 'type_state': goodType, 'style_state': goodStyle}, function(e){
			l('pass succeed');	  
		})
	});

	$("[name|='good-deny']").hover(function(){
		var domOffset = $(this).offset();
		var infoWinTop = domOffset.top -$('#good-deny-infos').height() - parseInt($(this).css('padding-top'))+1;
		var infoWinLeft = domOffset.left - $('#good-deny-infos').width()/2 + $(this).width()/2; 
		$('#good-deny-infos').css('top', infoWinTop);
		$('#good-deny-infos').css('left', infoWinLeft);
		$('#good-deny-infos').show();
	},function(){
		$('#good-deny-infos').hide();
	});

	$('#good-deny-infos').hover(function(){
		$(this).show();					   
	},function(){
		$(this).hide();					   
	});

	$("[name|='good-pass']").hover(function(){
		var domOffset = $(this).offset();
		var infoWinTop = domOffset.top -$('#good-pass-infos').height() - parseInt($(this).css('padding-top'))+1;
		var infoWinLeft = domOffset.left - $('#good-pass-infos').width()/2 + $(this).width()/2; 
		$('#good-pass-infos').css('top', infoWinTop);
		$('#good-pass-infos').css('left', infoWinLeft);
		$('#good-pass-infos').show();
	},function(){
		$('#good-pass-infos').hide();
	});

	$('#good-pass-infos').hover(function(){
		$(this).show();					   
	},function(){
		$(this).hide();					   
	});

	Commom.bindToolBarEvent();

});


Commom.bindToolBarEvent = function(){
	$('.tool-bar-select').click(function(){
		$(this).find('div').show();					   
		$('.tool-bar-select').unbind('click');
		Commom.bindToolBarBtnEvent();
		l('unbind');
	});
}


Commom.bindToolBarBtnEvent = function(){
	$('.tool-bar-select').find('div').click(function(){
		$(this).show().siblings().hide();
		$('.tool-bar-select').find('div').unbind('click');
		var timer = setTimeout(function(){
			Commom.bindToolBarEvent();
			clearTimeout(timer);
			l('a');
		},1000);

		var btnVal = $(this).attr('value');
		if(btnVal === '0'){
			$.post('/adminer/word_list', {}, function(e){
				l('0');			  
			})

		}else if(btnVal === '1'){
			$.post('/adminer/has_failed', {}, function(e){
				l('1');			  
			})

		}else if(btnVal === '2'){
			$.post('/adminer/has_passed', {}, function(e){
				l('2');			  
			})
		}
	});
}

Commom.initPageBtn = function(){
	var pageSum = $(".goods-container ul").find('li').length/2;	
	for(var i=1; i<=pageSum; i++){
		var pageDom = '<div class="pages-btn" value="'+i+'">'+i+'</div>';
		$('.pages-btn').last().before(pageDom);
	}
}
