/* 基于jquery的分页插件 paging.js 
*	Author: Well
*	输入: 总页数: paging_total , paging_url --> 外部定义的 ajax 提交地址 , paging_cb(e) --> ajax 中的回调函数（分页后的数据操作）
*	还存在的问题: html、css、js 代码还处于分离状态，且由于 paging 被定义为一个模板，很多数据定义、调用都受到了限制
*/

(function (){

	var page_num_box = $('.paging-num'),
		page_box = $('.paging-wrap'),
		paging_btn = $('.paging-btn'),
		ellipsis = '<span class="paging-more">....</span>',
		total = $('#paging').attr('paging-total'),
		_node = '';
	
	setPage(total,1);

	function setPage(total,_now){

		// node init
		_node = '';
		page_num_box.html('');

		if(total <= 5){
			for(var i=0;i<total;i++){
				setNode(i,_now);
			}
		}else if(total > 5){
			if(_now > 4){
				_node += ellipsis;
				_now = parseInt(_now);
				if(_now >= total-1){
					for(var i=total-5;i<total;i++){
						if((i+1) == _now){
							_node += '<a class="page-btn active" href="javascript:void(0)">'+ _now +'</a>';
						}else {
							_node += '<a class="page-btn" href="javascript:void(0)">'+ (i+1) +'</a>';
						}
					}
				}else {
					for(var i=_now-3;i<_now+2;i++){
						setNode(i,_now);
					}
				}
			}else {
				for(i=0;i<5;i++){
					setNode(i,_now);
				}
			}

			if((total-_now) > 2){
				_node += ellipsis;
			}
		}else {
			return false;
		}


		function setNode(i,_now){
			if((i+1) == _now){
				_node += '<a class="page-btn active" href="javascript:void(0)">'+ _now +'</a>';
			}else {
				_node += '<a class="page-btn" href="javascript:void(0)">'+ (i+1) +'</a>';
			}
		}

		page_num_box.append(_node);

		$('.page-btn').on('click',function (){
			var _this = $(this),
				_num = _this.text();

			post(_num);
			setPage(total,_num);
		});

	}

	function post(num){

		// paging_url 为外部定义的 ajax 提交地址
		$.post(paging_url,{
			'num_now': num
		},function (e){
			// do something
			paging_cb(e);
		});
	}

	paging_btn.on('click',function (){

		_index = parseInt($('.page-btn').filter('.active').text());

		var _this = $(this),
			_txt = _this.text();

		switch(_txt){
			case '首页': if(_index<=1){return false;}post(1);setPage(total,1);
				break;
			case '上一页': (function (){
				if(_index <= 1){
					_index = 2;
					return false;
				}
				post(_index-1);
				setPage(total,_index-1);
			}());
				break;
			case '下一页': (function (){
				if(_index >= total){
					_index = total-1;
					return false;
				}
				post(_index+1);
				setPage(total,_index+1);
			}());
				break;
			case '末页': if(_index>=total){return false;}post(total);setPage(total,total);
				break;
		}

	});

}())