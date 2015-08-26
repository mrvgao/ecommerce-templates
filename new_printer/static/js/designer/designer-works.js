
$(function(){
	var works_wait_btn = $('#works_wait_btn'),	//未审核
		works_on_btn = $('#works_on_btn'),	//审核中
		works_not_btn = $('#works_not_btn'),	//未通过
		works_Suc_btn = $('#works_Suc_btn');	//已发布
		designer_works_lists = $('.designer-works-lists'),
		designer_works_container = $('.designer-works-container');

	workd_unexecute(1);

	$('#checkall').on('click',function(){	//全选按钮点击事件
		isCheckAll();
	});

	works_wait_btn.on('click',function(){	//未审核按钮点击
		workd_unexecute(1);
		addWorkBtnCurrent($(this));
	});
	works_on_btn.on('click',function(){		//审核中按钮点击
		auditing(1);
		addWorkBtnCurrent($(this));
	});

	works_Suc_btn.on('click',function(){	//已发布按钮点击
		published(1);
		addWorkBtnCurrent($(this));
	});

	works_not_btn.on('click',function(){	//未通过按钮点击
		not_passed(1);
		addWorkBtnCurrent($(this));
	});

	toSearch();
});

// 搜索模块
function toSearch(){
	// 敲回车搜索
	$('.search-box').on('keyup',function (e){
		var _val = $('.search-box').val(),
			_txt = $('.designer-works-nav-current').text(),
			_title = $('.works-current').text().substr(0,3);
		if(e.keyCode == 13){
			if(_val != '' || _val != null){
				$.post('',{
					'search_val': _val,
					'search_txt': _txt,
					'search_type': _title
				},function (e){
					setData(e);
				});
			}
		}
	});

	// 点击搜索
	$('.designer-works-search-icon').on('click',function (){
		var _val = $('.search-box').val(),
			_txt = $('.designer-works-nav-current').text(),
			_title = $('.works-current').text().substr(0,3);
		if(_val != '' || _val != null){
			$.post('',{
				'search_val': _val,
				'search_txt': _txt,
				'search_type': _title
			},function (e){
				setData(e);
			});
		}
	});

	function setData(e){
		$('.designer-works-wait tbody').html('');
		var waitList = JSON.parse(e).all_list;
		var totalPage = JSON.parse(e).total_pages;
		for(var i=0,len=waitList.length;i<len;i++){
			waitStr+='<tr data-id="'+waitList[i].id+'"><td><span>'+waitList[i].name+'</span></td><td><span>'+waitList[i].type+'文件 ｜'+waitList[i].file_size+'M </span></td><td><span>'+waitList[i].upload_time+'</span></td><td><span><button class="works-modify-btn ">去定价</button></span></td><td></span><a href="javascript:void(0)" class="wait-delete-single">删除</a><input type="checkbox" class="works-wait-delete-check"></span></td></tr>';
		}
		getPage(totalPage,page);
		designer_works_lists.append(waitStr);
		deleteSigle();
	}

	$('.designer-works-nav li').on('click',function (){
		var _txt = $(this).text(),
			_title = $('.works-current').text().substr(0,3);

		$(this).siblings().removeClass('designer-works-nav-current');
		$(this).addClass('designer-works-nav-current');
		$.post('',{
			'search_txt': _txt,
			'search_type': _title
		},function (e){
			setData(e);
		});
	});
}


function addWorkBtnCurrent(_this){
	var designer_works_btn = $('.designer-works-btn').find('button');
	if(_this.hasClass('works-current')){
		return false;
	}else{
		designer_works_btn.removeClass('works-current');
		_this.addClass('works-current');
	}
}

function workd_unexecute(page){		//加载未审核的数据
	var designer_works_lists = $('.designer-works-lists');
	var designer_works_page =$('.designer-works-page');
	designer_works_page.remove();
	designer_works_lists.empty();
	var waitStr = '<table class="designer-works-wait" cellpadding="0" cellspacing="0"><thead><tr><th><span>作品名称</span></th><th><span>文件类型｜文件大小</span></th><th><span>上传时间</span></th><th colspan="2">操作</th></tr></thead>';
	$.post('/designer/workd_unexecute',{"page":page}, function(e) {
		if(e){
			var waitList = JSON.parse(e).all_list;
			var totalPage = JSON.parse(e).total_pages;
			for(var i=0,len=waitList.length;i<len;i++){
				waitStr+='<tr data-id="'+waitList[i].id+'"><td><span>'+waitList[i].name+'</span></td><td><span>'+waitList[i].type+'文件 ｜'+waitList[i].file_size+'M </span></td><td><span>'+waitList[i].upload_time+'</span></td><td><span><button class="works-modify-btn ">去定价</button></span></td><td></span><a href="javascript:void(0)" class="wait-delete-single">删除</a><input type="checkbox" class="works-wait-delete-check"></span></td></tr>';
			}
			// waitStr = '<tbody>' + waitStr +'</tbody>';
			waitStr +='<div class="designer-works-deleteAll"><button class="works-deleteAll-btn" onclick="deleteAll()">批量删除</button><label for="checkall">全选</label><input type="checkbox" class="works-delete-allcheck" id="checkall" onclick="isCheckAll(this)"/></div></table>';
			getPage(totalPage,page);

		}else{
			waitStr ='数据加载失败...';
		}

		designer_works_lists.append(waitStr);
		edit();
		deleteSigle();

		// 未审核弹窗,用于编辑
		// var _btn = $('.works-modify-btn ');
		// _btn.on('click',function (){
		// 	$('.modify-content').show();
		// 	closeEdit();

		// 	$.post('',{},function (e){
		// 		// do something

		// 	});

		// 	$('.modify-btn-submit').on('click',function (){
		// 		$.post('',{},function (){
		// 			// do something

		// 		});
		// 	});
		// });

		// added by white
		deisgnerWorkPicEvent();

	});
}


function auditing(page){	//加载审核中的数据
	var designer_works_page = $('.designer-works-page');
	designer_works_page.remove();
	designer_works_lists.empty();
	var onStr = '';
	$.post('/designer/auditing',{"page":page}, function(e) {
		if(e){
			var onList = JSON.parse(e).all_list;
			var totalPage = JSON.parse(e).total_pages;
			for(var i=0,len=onList.length;i<len;i++){
				onStr += '<div class="designer-works-list-box clearfix" data-id="'+onList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+onList[i].pic[0]+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">'+onList[i].name+'</p><p class="designer-works-list-describe">'+onList[i].description+'</p><div class="designer-works-list-pics clearfix">';
				for(var j=0,jlen=onList[i].pic.length;j<jlen;j++){
					onStr += '<img src="'+onList[i].pic[j]+'"/>';
				}
				onStr += '</div></div><div class="designer-works-list-status fl"><strong>审核中···</strong><p>您的作品预计在'+onList[i].restdate+'天内被审核完毕并发布。</p></div></div>';
			}
			getPage(totalPage,page);
		}else{
			onStr = '信息加载失败..';
		}
		designer_works_lists.append(onStr);

		// added by white
		deisgnerWorkPicEvent();
	});
}

function published(page){	//获取已发布数据
	var designer_works_page = $('.designer-works-page');
	designer_works_page.remove();
	designer_works_lists.empty();
	var sucStr = '';
	$.post('/designer/has_published',{"page":page}, function(e) {
		if(e){
			var sucList = JSON.parse(e).all_list;
			var totalPage = JSON.parse(e).total_pages;
			for(var i=0,len=sucList.length;i<len;i++){
				sucStr += '<div class="designer-works-list-box clearfix" data-id="'+sucList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+sucList[i].pic[0]+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">'+sucList[i].name+'</p><p class="designer-works-list-describe">'+sucList[i].description+'</p><div class="designer-works-list-pics clearfix">';
				for(var j=0,jlen=sucList[i].pic.length;j<jlen;j++){
					sucStr += '<img src="'+sucList[i].pic[j]+'"/>';
				}

				sucStr += '</div></div><div class="designer-works-list-data fl"><div class="list-data-container clearfix"><div class="list-data-box fl"><span class="list-data-num list-download-num">'+sucList[i].download_count+'</span>次下载</div><div class="list-data-box fl"><span class="list-data-num list-collection-num">'+sucList[i].collected_count+'</span>次收藏</div></div><div class="list-data-price">售价：<span class="list-data-price-num">'+sucList[i].good_price+'</span>RMB</div><div class="list-data-update">发布时间：<span class="list-data-update-num">'+sucList[i].approval_time+'</span></div></div><div class="designer-works-modify fl"><button class="works-modify-btn ">编辑</button><button class="works-cancel-btn">取消发布</button><input type="checkbox" class="works-cancel-check"/></div></div>'
			}
			sucStr += '<div class="works-canelbox"><button class="works-canelAll-btn">批量取消发布</button><label for="checkall">全选</label><input type="checkbox" class="works-cancel-allcheck" id="checkall"/></div>';
			getPage(totalPage,page);
		}else{
			sucStr = '信息加载失败..';
		}
		designer_works_lists.append(sucStr);
		cancelAll();
		cancelSigle();

		// 用于编辑
		var _btn = $('.works-modify-btn');
		_btn.on('click',function (){
			$('.modify-content').show();
			closeEdit();
			$('.modify-imgs-modify').remove();
			$.post('',{},function (e){
				// do something

			});

			$('.modify-btn-submit').on('click',function (){
				$.post('',{},function (){
					// do something

				});
			});
		});

		$('.works-cancel-allcheck').on('click',function (){
			if(this.checked){
				$('.works-cancel-check').each(function(){ this.checked = true; });
			}else {
				$('.works-cancel-check').each(function(){ this.checked = false; });
			}
		});
		$('.works-canelAll-btn').on('click',function (){
			var _cancelbool = false;
			$('.works-cancel-check').each(function (){
				if(this.checked){
					_cancelbool = true;
				}
			})
			if(_cancelbool){
				var _parent = $('.works-cancel-check:checked').parents('.designer-works-list-box'),
					_id = _parent.attr('data-id');
				$.post('/designer/unexecute_delete',{'id': _id},function (e){

					// 如果数据库没有数据了，就执行else，否则执行if
					if(e){
						_parent.remove();
					}else {
						_parent.parent().remove();
					}

				});
			}
		});

		// added by white
		deisgnerWorkPicEvent();
	});
}

function not_passed(page){		//获取未通过数据
	var designer_works_page = $('.designer-works-page');
	designer_works_page.remove();
	designer_works_lists.empty();
	var notStr = '';
	$.post('/designer/not_passed', {"page":page}, function(e){
		if(e){
			var data = JSON.parse(e);
			var notList = JSON.parse(e).all_list;
			var totalPage = JSON.parse(e).total_pages;
			for(var i=0,len=notList.length;i<len;i++){
				notStr+='</div><div class="designer-works-list-box clearfix" data-id="'+notList[i].id+'" data-type="'+notList[i].type+'" data-size="'+notList[i].file_size+'" data-price="'+notList[i].good_price+'" data-uptime="'+notList[i].upload_time+'"><div class="designer-works-list-bigpic fl"><img src="'+notList[i].pic[0]+'" class="works-list-bigpic" /></div><div class="designer-works-list-smdetail fl"><p class="designer-works-list-title">'+notList[i].name+'</p><p class="designer-works-list-describe">'+notList[i].description+'</p><div class="designer-works-list-pics clearfix">';
				var picList=notList[i].pic;

				for(var j=0,jlen=picList.length;j<jlen;j++){
					notStr +='<img src="'+picList[j]+'" class="designer-works-list-img" data-pid="'+j+'"/>';
				}

				notStr+='</div></div><div class="works-data-box fl"><div class="works-not-container clearfix"><p class="works-not-explain"><span>未通过说明:</span>'+notList[i].not_passed+'</p><p class="works-not-time fr">'+notList[i].modify_time+'</p></div></div><div class="designer-works-modify fl"><button class="works-modify-btn ">编辑</button><button class="works-cancel-btn">取消发布</button><input type="checkbox" class="works-cancel-check"/></div></div>';
			}
			notStr +='<div class="designer-works-cancelAll"><button class="works-cancelAll-btn" onclick="cancelAll()">批量取消发布</button><label for="checkall">全选</label><input type="checkbox" class="works-cancel-allcheck" id="checkall" onclick="isCheckAll(this)"/></div></table>';
			getPage(totalPage,page);
		}else{
			notStr='信息加载失败';
		}
		designer_works_lists.append(notStr);
		edit();
		cancelSigle();

		// added by white
		deisgnerWorkPicEvent();
	});
}

function isCheckAll(obj){	//全选函数

	var allList = document.getElementsByTagName("input");
	if(obj.checked){
		for(var i=0,len=allList.length;i<len;i++){
			allList[i].checked=true;
		}
	}else{
		for(var i=0,len=allList.length;i<len;i++){
			allList[i].checked=false;
		}
	}
}

function deleteAll(){	//批量删除函数
	var deleteTag = $('.works-wait-delete-check:checked'),
		worksList = $('tr'),
		worksContainer = $('.designer-works-wait').find('tbody');
	var str ='<tr><td colspan="4">没有数据啦⊙.⊙</td></tr>',
		rest = worksList.length - deleteTag.length;
	deleteTag.each(function(index, el) {
		var _this = $(this),
			_id = _this.parents('tr').attr('data-id');
		$.post('/designer/unexecute_delete', {"id":_id}, function(e){

			if(e){
			}
		});
		_this.parents('tr').remove();
	});
	$('#checkall').attr('checked',false);
	if(rest==1){
		worksContainer.append(str);
	}
}

function deleteSigle(){		//单个删除

	$('.wait-delete-single').on('click',function(){
		var _this =$(this),
			deleteObj = _this.parents('tr');
		_id = deleteObj.attr('data-id');
		$.post('/designer/unexecute_delete', {"id":_id}, function(e){
			if(e){
				alert(e);
				deleteObj.remove();
			}
		});
	});
}


function cancelAll(){	//批量取消发布

	var cancelTag = $('.works-cancel-check:checked'),
		worksList = $('.designer-works-list-box'),
		worksContainer = designer_works_lists,
		str ='没有数据啦⊙.⊙',
		rest = worksList.length - cancelTag.length;

	cancelTag.each(function(index, el) {
		var _this = $(this),
			_id = _this.parents('.designer-works-list-box').attr('data-id');

		$.post('/designer/unexecute_delete', { "id": _id }, function(e){
			if(e){

			}
		});
		_this.parents('.designer-works-list-box').remove();
	});
	$('#checkall').attr('checked',false);
	if(rest==0){
		worksContainer.append(str);
	}
}

function cancelSigle(){		//单个取消发布
	$('.works-cancel-btn').on('click',function(){
		var _this = $(this),
			deleteObj = _this.parents('.designer-works-list-box'),
			_id = deleteObj.attr('data-id');

		$.post('/designer/unexecute_delete', {"id":_id}, function(e){
			if(e){
				alert(e);
				deleteObj.remove();
			}
		});
	});
}

function getPage(total,cur){	//生成页码
	var pageStr ='<ul class="designer-works-page" data-total="'+ total+'"><li class="designer-works-page-first">首页</li><li class="designer-works-page-prev">上一页</li>';
	if(total<=6&&total!=1){		//当总页码小于6
		for(var p=0;p<total;p++){
			if((p+1) == cur){
				pageStr +='<li class="page-current">'+cur+'</li>';
			}else{
				pageStr +='<li>'+(p+1)+'</li>';
			}
		}
	}else if(total>6){		//总页码大于6

		if(cur>5){		//当前页大于5，前面出现小点
			pageStr += '<li class="designer-works-page-dots">...</li>';
			for(var p=cur-4;p<cur+2;p++){
				if((p+1) == cur){
					pageStr +='<li class="page-current">'+cur+'</li>';
				}else{
					pageStr +='<li>'+(p+1)+'</li>';
				}
			}
		}else{
			for(var p=0; p<6; p++){
				if((p+1) == cur){
					pageStr += '<li class="page-current">' + cur + '</li>';
				}else{
					pageStr += '<li>' + (p+1) + '</li>';
				}
			}
		}
		if((total-cur)>2){	//当前页在倒数第二页之前，最后出现小点点
			pageStr +='<li class="designer-works-page-dots">...</li>';
		}
	}else{
		return false;
	}
	pageStr +='<li class="designer-works-page-next">下一页</li><li class="designer-works-page-last">末页</li></ul>';

	designer_works_container.append(pageStr);
	creatPages();
}

function creatPages(){		//生成页码
	$('.designer-works-page li').on('click',function(){
		var _this = $(this);
		var toPage = _this.text(),
			thisType = $('.works-current').text().substr(0,3),
			curPage = $('.page-current').text();
		totalPage = $('.designer-works-page').attr('data-total');

		toPage = judgePage(toPage, curPage, totalPage);
		if(toPage){
			if(thisType=="未审核"){
				workd_unexecute(toPage);
			}else if(thisType=="审核中"){
				auditing(toPage);
			}else if(thisType=="未通过"){
				published(toPage);
			}else if(thisType=="已发布"){
				not_passed(toPage);
			}
		}
	});
}

function judgePage(toPage, curPage, totalPage){		//判断点击的页码
	var curPage = parseInt(curPage);
	if(isNaN(parseInt(toPage))){
		switch(toPage){
			case "首页": return 1;
			case "末页": return totalPage;
			case "...": return false;
		}
		if(toPage == "下一页"){
			if(curPage < totalPage){
				return (curPage+1);
			}else{
				alert("没有下一页啦!");
				return false;
			}
		}else if(toPage == "上一页"){
			if(curPage != 1){
				return curPage-1;
			}else{
				alert("没有上一页啦!");
				return false;
			}
		}
	}else{
		return toPage;
	}

}

function edit(){	//编辑弹窗函数
	$('.works-modify-btn').on('click',function(){
		var _this = $(this),
			_parent = _this.parents('.designer-works-list-box'),
			id = _parent.attr('data-id'),
			pic = _parent.find('.works-list-bigpic').attr('src'),
			type = _parent.attr('data-type'),
			size = _parent.attr('data-size'),
			price = _parent.attr('data-price'),
			name = _parent.find('.designer-works-list-title').text(),
			describe = _parent.find('.designer-works-list-describe').text(),
			imgs = _parent.find('.designer-works-list-img'),
			modify_imgs_container = $('.modify-imgs-container'),
			imgStr = '',
			up_time = _parent.attr('data-uptime');

		modify_imgs_container.empty();
		$('.designer-zoom').css('display','block');
		$('.modify-content').css('display','block');
		$('.modify-stl-preview').attr('src',pic );
		$('.modify-type').text(type);
		$('.modify-size').text(size);
		$('.modify-update').text(up_time);
		$('.modify-price').val("￥"+price);
		$('.modify-name').val(name);
		$('.modify-describe').text(describe);
		//for(var i=0;i<imgs.length;i++){
		//	var imgsrc = imgs.eq(i).attr('src');
		//	imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+i+'"><img src="'+imgsrc+'" class="modify-imgs"/><div class="modify-imgs-modify"><div class="modify-imgs-modify-hidden"><input type="file" name="photo_file" /></div><a href="javascript:void(0)" class="modify-imgs-modify-btn">修改</a><a href="javascript:void(0)" class="modify-imgs-delete-btn">删除</a></div></div>';
		//}
		var imgsrc = imgs.eq(0).attr('src');
		imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+0+'"><img src="'+imgsrc+'" class="modify-imgs"/><div class="modify-imgs-modify"><div class="modify-imgs-modify-hidden"><input type="file" name="1" /></div><a href="javascript:void(0)" class="modify-imgs-modify-btn">修改</a><a href="javascript:void(0)" class="modify-imgs-delete-btn">删除</a></div></div>';
		var imgsrc = imgs.eq(1).attr('src');
		imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+1+'"><img src="'+imgsrc+'" class="modify-imgs"/><div class="modify-imgs-modify"><div class="modify-imgs-modify-hidden"><input type="file" name="2" /></div><a href="javascript:void(0)" class="modify-imgs-modify-btn">修改</a><a href="javascript:void(0)" class="modify-imgs-delete-btn">删除</a></div></div>';
		var imgsrc = imgs.eq(2).attr('src');
		imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+2+'"><img src="'+imgsrc+'" class="modify-imgs"/><div class="modify-imgs-modify"><div class="modify-imgs-modify-hidden"><input type="file" name="3" /></div><a href="javascript:void(0)" class="modify-imgs-modify-btn">修改</a><a href="javascript:void(0)" class="modify-imgs-delete-btn">删除</a></div></div>';

		$('.modify-imgs-container').append(imgStr);
		$('.modify-imgs-delete-btn').on('click',function(){		//删除图片
			var imgBox = $('.modify-imgs-box');
			if(imgBox.length==1){
				alert("至少要有一张预览图");
			}else{
				var _index = $(this).index(),
					picId = _parent.find('.designer-works-list-pics img').eq(_index).attr('data-pid');	//pic分别是0，1，2
				$.post('/designer/deletePic', { "picId": picId, "id": id },function (e){
					if('success'==JSON.parse(e).status){
						alert('delete success!')
						//$(this).parents('.modify-imgs-box').find('img').attr('src','');
					}
				});$(this).parents('.modify-imgs-box').find('img').attr('src','');
			}
		});

		// 修改图片
		$('.modify-imgs-modify-btn').on('click',function(){

			$(this).prev().find('input').click();
		});

	});

	closeEdit();

	$('.modify-btn-submit').on('click',function (){
		$('.changeInfo').submit();
	});
}

// 关闭弹窗
function closeEdit(){
	$('.modify-container-close').on('click',function(){
		$('.designer-zoom').css('display','none');
		$('.modify-content').css('display','none');
	});
}
