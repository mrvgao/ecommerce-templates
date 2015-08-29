(function (){

	var page_num_box = $('.paging-num'),
		page_box = $('.paging-num'),
		paging_btn = $('.paging-btn'),
		ellipsis = '<span class="paging-more">....</span>',
		_node = '';
	
	setPage(16,14);

	function setPage(total,_now){

		// init
		_node = '';
		page_box.html('');


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

			setPage(16,_num);
		});

		paging_btn.on('click',function (e){
			e.stopPropagation();
			var _index = $('.page-btn').filter('.active').text();
			_index = parseInt(_index);

			console.log(_index);

			var _this = $(this),
				_txt = _this.text();

			switch(_txt){
				case '首页': setPage(16,1);
					break;
				case '上一页': setPage(16,_index-1);
					break;
				case '下一页': setPage(16,_index+1);
					break;
				case '末页': setPage(16,16);
					break;
			}
		});

	}

	

}())