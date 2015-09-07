$(function (){

	var filter_bynum = $('.filter-btn'),
		list_box = $('.ds-list-box ul'),
		mark_btn = $('.show-mark-btn'),
		ds_list_box = $('.ds-list-box ul'),
		type_filter = $('.type-filter-btn');

	filter_bynum.on('click',function (){
		var _this = $(this),
			data_tag = _this.attr('data-tag'),
			_vid = mark_btn.attr('data-vid'),
			_did = mark_btn.attr('data-did'),
			type_tag = type_filter.filter('.active').attr('type-tag');
		clickFocus(_this);
		ds_list_box.empty();
		var sucStr = '',
			click_count = 0;
		$.post('/designer/sort_list',{ 'data_kind': data_tag, 'type_kind': type_tag, 'v_id': _vid, 'd_id': _did },function (e){

				var sucList = JSON.parse(e).all_list;
				for(var i=0,len=sucList.length;i<len;i++){
					sucStr += '<li><div class="list-box pr"><div class="list-img mb10"><a target="_blank" href="/shop/goods-detail?goods_id='+ sucList[i].id +'"><img class="goods_img" src="'+ sucList[i].preview_1 +'" alt="" /></a></div><div class="num-box tc mb10"><p class="mr15 inl-b"><em class="download-num-ico"></em><span class="goods_downloadNum">'+ sucList[i].download_count +'</span></p><p class="inl-b"><em class="mark-num-ico"></em><span class="goods_markNum">'+ sucList[i].collect_count +'</span></p></div><div class="list-title tc mb10"><a class="goods_name" target="_blank" href="/shop/goods-detail?goods_id='+ sucList[i].id +'">'+ sucList[i].goods_name +'</a></div><p class="goods_price f12 tc">￥'+ sucList[i].goods_price +'</p>';
					if (sucList[i].now_user == 'V'){

						if(sucList[i].is_collect){
							sucStr += '<a class="pa goods-tomark active" data-num=' + sucList[i].id + ' href="javascript:void(0)"><em class="list-mark-btn-ico mark-num-ico"></em>收藏</a></div></li>';
						}else {
							sucStr += '<a class="pa goods-tomark " data-num=' + sucList[i].id + ' href="javascript:void(0)"><em class="list-mark-btn-ico mark-num-ico"></em>收藏</a></div></li>';
						}
					} else {
						continue;
					}

				}
				ds_list_box.append(sucStr);
				toMark();
			});

	});

	type_filter.on('click',function (){
		var _this = $(this),
			data_tag = filter_bynum.filter('.active').attr('data-tag'),
			_vid = mark_btn.attr('data-vid'),
			_did = mark_btn.attr('data-did'),
			type_tag = _this.attr('type-tag');

		type_filter.removeClass('active');
		_this.addClass('active');
		data_tag = '1';
		clickFocus(_this);
		ds_list_box.empty();
		var sucStr = '';
		var click_count = 0;
		$.post('/designer/sort_list',{ 'data_kind': data_tag, 'type_kind': type_tag, 'v_id': _vid, 'd_id': _did },function (e){

				var sucList = JSON.parse(e).all_list;
				for(var i=0,len=sucList.length;i<len;i++){
					sucStr += '<li><div class="list-box pr"><div class="list-img mb10"><a target="_blank" href="/shop/goods-detail?goods_id='+ sucList[i].id +'"><img class="goods_img" src="'+ sucList[i].preview_1 +'" alt="" /></a></div><div class="num-box tc mb10"><p class="mr15 inl-b"><em class="download-num-ico"></em><span class="goods_downloadNum">'+ sucList[i].download_count +'</span></p><p class="inl-b"><em class="mark-num-ico"></em><span class="goods_markNum">'+ sucList[i].collect_count +'</span></p></div><div class="list-title tc mb10"><a class="goods_name" target="_blank" href="/shop/goods-detail?goods_id='+ sucList[i].id +'">'+ sucList[i].goods_name +'</a></div><p class="goods_price f12 tc">￥'+ sucList[i].goods_price +'</p>';
					if (sucList[i].now_user == 'V'){

						if(sucList[i].is_collect){
							sucStr += '<a class="pa goods-tomark active" data-num=' + sucList[i].id + ' href="javascript:void(0)"><em class="list-mark-btn-ico mark-num-ico"></em>收藏</a></div></li>';
						}else {
							sucStr += '<a class="pa goods-tomark " data-num=' + sucList[i].id + ' href="javascript:void(0)"><em class="list-mark-btn-ico mark-num-ico"></em>收藏</a></div></li>';
						}
					} else {
						continue;
					}

				}
				ds_list_box.append(sucStr);
				toMark();
			});

	});


	// 关注 or 取消关注
	mark_btn.on('click',function (){
		var _this = $(this),
			_did = _this.attr('data-did'),
			_vid = _this.attr('data-vid');

		if(_this.hasClass('active')){
			_this.removeClass('active');
			$.post('/designer/cancel_focus',{ 'd_id': _did, 'v_id': _vid },function (e){});

		}else {
			_this.addClass('active');
			$.post('/designer/add_focus',{ 'd_id': _did, 'v_id': _vid},function (e){});

		}
	});


	// 收藏 or 取消收藏
	function toMark(){
		$('.goods-tomark').on('click',function (){
			var _this = $(this),
				_vid = mark_btn.attr('data-vid'),
				_gid = _this.attr('data-num');

			if(_this.hasClass('active')){
				_this.removeClass('active');
				$.post('/designer/cancel_collect',{ 'g_id': _gid, 'v_id': _vid },function (e){});

			}else {
				_this.addClass('active');
				$.post('/designer/add_collect',{ 'g_id': _gid, 'v_id': _vid},function (e){});

			}
		});
	}
	toMark();

	// 点击切换效果
	function clickFocus(obj){
		obj.siblings().removeClass('active');
		obj.addClass('active');
	}

})