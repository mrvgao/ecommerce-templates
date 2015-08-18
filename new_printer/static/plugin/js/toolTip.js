/* toolTip
*  
*  使用方法：给对象添加 tooltip 属性，其值就是它的 tip 文本值
*          toolbg 是 tip 的背景色
*		   toolcolor 是 tip 文本的颜色
*  限制：父级必须能接受 display: inline-block 属性
*/

(function(){
		// 默认样式
		var ele = $('body *').filter('[tooltip]');
		ele.each(function(index){
			// 实现代码
			var _this = $(this);
			_this.css('display','inline-block').hover(function (){
				var tipText = _this.attr('tooltip'),
					_left = _this.offset().left,
					_top = _this.offset().top,
					tipCont = "<div style='display:inline-block' id='hint'>" + tipText + "</div>";
				$('body').append(tipCont);
				var hint = $('#hint'),
					_offset = (hint.width()-_this.width())/2;
				hint.css({
					position: 'absolute',
					left: _left-_offset-10,
					top: _top-30,
					background: '#fff',
					padding: '4px 10px',
					borderRadius: '3px',
					border: '1px solid #ddd'
				});

				if(_this.attr('tipbg')){
					hint.css('background', _this.attr('tipbg'));
				}
				if(_this.attr('tipcolor')){
					hint.css('color', _this.attr('tipcolor'));
				}
			},function (){
				$('#hint').remove();
			});
		});
})();