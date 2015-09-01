/* 图片轮播
*  Author:Well
*  参数:
*	第一个是ul、
*	第二个是ul里面的li、
*	第三个是指示标的li、
*	第四个参数是轮播速度。
*	暂时只能用于有.active这个类使用的代码。
*/

function imgSlider(s_ul,s_uli,s_oli,sSpeed,prev,next){
	var oul=$(s_ul),
		ali=$(s_uli),
		numli=$(s_oli),
		prev=$(prev),
		next=$(next),
		oliWidth=$(s_uli).width(),
		_now=0,
		_now2=0,
		timer=null;
	$(s_ul).css('width',$(s_uli).width()*$(s_uli).length);
	numli.click(function (){
		var index=$(this).index();
		_now=index;
		_now2=index;
		$(this).addClass('active').siblings().removeClass('active');
		oul.animate({'left':-oliWidth*index},500);
		clearInterval(timer);
		timer=setInterval(aSlider,sSpeed);
	});
	if(next){
		function stopT(both){
			both.mouseover(function (){
				clearInterval(timer);
			}).mouseout(function (){
				timer=setInterval(aSlider,sSpeed);
			});
		}
		stopT(next);
		stopT(prev);
		next.click(function (){
			aSlider();
		});
		prev.click(function (){
			if(_now==0){
				ali.eq(numli.size()-1).css({
					'position':'relative',
					'left':-oul.width()
				});
				_now=numli.size()-1;
			}else {
				_now--;
			}
			_now2--;
			numli.eq(_now).addClass('active').siblings().removeClass('active');
			oul.animate({'left':-oliWidth*_now2},500,function (){
				if(_now==numli.size()-1){
					ali.eq(numli.size()-1).css('position','static');
					oul.css('left',-oliWidth*(numli.size()-1));
					_now2=numli.size()-1;
				}
			});
		});
	}
	timer=setInterval(aSlider,sSpeed);
	function aSlider(){
		if(_now==numli.size()-1){
			ali.eq(0).css({
				'position':'relative',
				'left':oul.width()
			});
			_now=0;
		}else {
			_now++;
		}
		_now2++;
		numli.eq(_now).addClass('active').siblings().removeClass('active');
		oul.animate({'left':-oliWidth*_now2},500,function (){
			if(_now==0){
				ali.eq(0).css('position','static');
				oul.css('left',0);
				_now2=0;
			}
		});
	}
	$(s_ul).mouseover(function (){
		clearInterval(timer);
	}).mouseout(function (){
		timer=setInterval(aSlider,sSpeed);
	});
}