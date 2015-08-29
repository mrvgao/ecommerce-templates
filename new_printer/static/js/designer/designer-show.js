$(function (){

	var filter_bynum = $('.filter-bynum a'),
		goods_tomark = $('.goods-tomark'),
		list_box = $('.ds-list-box ul'),
		mark_btn = $('.show-mark-btn');
	var ds_list_box = $('.list-box');
	var goods_tomark = $('.goods-tomark')

	filter_bynum.on('click',function (){
		var _this = $(this),
			_tag = _this.attr('data-tag');

		clickFocus(_this);
		ds_list_box.empty();
		var sucStr = '';
		var click_count = 0
		switch(_tag){
			case 'filter_all': $.post('/designer/my_personal',{ 'work_kind': _tag },function (e){
				// do something

			});
				break;

			case 'filter_download_num': $.post('/designer/downed_list',{ 'work_kind': _tag },function (e){
				// do something
				console.log(_tag)
				var sucList = JSON.parse(e).all_list;
				for(var i=0,len=sucList.length;i<len;i++){
					sucStr += '<li><div class="list-box pr"><div class="list-img mb10"><a target="_blank" href="/shop/goods-detail?goods_id="'+sucList[i].id+'"><img class="goods_img" src="'+sucList[i].pic[0]+'" alt="" /></a></div><div class="num-box tc mb10"><p class="mr15 inl-b"><em class="download-num-ico"></em><span class="goods_downloadNum">'+sucList[i].download_count+'</span></p><p class="inl-b"><em class="mark-num-ico"></em><span class="goods_markNum">'+sucList[i].download_count+'</span></p></div><div class="list-title tc mb10"><a class="goods_name" target="_blank" href="/shop/goods-detail?goods_id="'+sucList[i].id+'">'+sucList[i].name+'</a></div><p class="goods_price f12 tc">￥'+sucList[i].good_price+'</p><a class="pa goods-tomark" href="javascript:void(0)"><em class="list-mark-btn-ico mark-num-ico"></em>收藏</a></div></li>';
					

				}
				ds_list_box.append(sucStr);

			});
				break;

			case 'filter_mark_num': $.post('',{ 'work_kind': _tag },function (e){
				// do something

			});
				break;

			case 'filter_time': $.post('',{ 'work_kind': _tag },function (e){
				// do something

			});
				break;
		}

	});

	// 关注 or 取消关注
	mark_btn.on('click',function (){
		var _this = $(this);
		if(_this.hasClass('active')){
			_this.removeClass('active');
			var d_id = 1;
			var v_id = 2;
			$.post('/designer/cancel_focus',{ 'd_id': d_id, 'v_id': v_id },function (e){
				alert("取消关注成功！")

			});

		}else {
			_this.addClass('active');
			var d_id = 1;
			var v_id = 2;
			$.post('/designer/add_focus',{ 'd_id': d_id, 'v_id': v_id},function (e){
				alert("添加关注成功！")
				
			});

		}
	});
	// 收藏 or 取消收藏
	goods_tomark.on('click',function (){
		var _this = $(this);
		if(_this.hasClass('active')){
			_this.removeClass('active');
			var g_id = 1;
			var v_id = 2;
			$.post('/designer/cancel_collect',{ 'g_id': g_id, 'v_id': v_id },function (e){
				alert("取消收藏成功！");

			});

		}else {
			_this.addClass('active');
			var g_id = 8;
			var v_id = 2;
			$.post('/designer/add_collect',{ 'g_id': g_id, 'v_id': v_id},function (e){
				alert("添加收藏成功！");
				
			});

		}
	});


	// 点击切换效果
	function clickFocus(obj){
		obj.siblings().removeClass('active');
		obj.addClass('active');
	}

})