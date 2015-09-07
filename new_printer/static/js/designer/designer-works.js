var ShowStl = {};
ShowStl.screenShotData = null;

$(function(){
	var works_wait_btn = $('#works_wait_btn'),	//待定价
		works_on_btn = $('#works_on_btn'),	//审核中
		works_not_btn = $('#works_not_btn'),	//未通过
		works_Suc_btn = $('#works_Suc_btn');	//已发布
	
	designer_works_lists = $('.designer-works-lists');
	designer_works_container = $('.designer-works-container');

	workd_unexecute(1);

	$('#checkall').on('click',function(){	//全选按钮点击事件
		isCheckAll();
	});

	works_wait_btn.on('click',function(){	//待定价按钮点击
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


	// added by white

	/*$('#show-3d-tool-cancel-fullscreen').click(function(){*/
	/*$('#show-3d-fullscreen').empty();									  */
	/*$('#show-3d-cont').hide();*/
	/*});*/

	$('#show-3d-tool-screenshot').click(function(){
		var myCanvas = document.getElementById("show-3d").getElementsByTagName('canvas')[0],
			imgSrc = myCanvas.toDataURL();
		/*for(var i=1; i<=3; i++){*/
		/*var t = document.getElementsByName(i)[0].files[0];*/
		/*if(t === undefined){*/
		/*console.log(t);*/
		/*break;*/
		/*}*/
		/*}*/
		$('.modify-imgs-box').eq(2).find('img').attr('src',imgSrc);	
		ShowStl.screenShotData = imgSrc;
		/*var newImg = new Image();*/
		/*newImg.src = imgSrc;*/
		/*newImg.name = 'screenShot'*/
		/*document.getElementsByName(i+'')[0].files[0] = newImg;*/
		/*var f = document.getElementsByName(i+'')[0].files[0];*/
		/*console.log('sss'+i+':'+f.name);*/

		/*$('.modify-imgs-box').eq((0)).find('img').attr('src',imgSrc);	*/
		/*var newImg = new Image();*/
		/*newImg.src = imgSrc;*/
		/*newImg.name = 'screenShot'*/
		/*document.getElementsByName('1')[0].files[0] = newImg;*/
		/*var f = document.getElementsByName('1')[0].files[0];*/
		/*console.log('sss'+'1'+':'+f.name);*/

		/*setInterval(function(){*/
		/*var f = document.getElementsByName('1')[0].files[0];*/
		/*console.log('sss'+'1'+':'+f.name);*/
		/*},500);*/
	});
	// added by white over
});

ShowStl.screenShotByElement = function(elementId){

	html2canvas($('.designer-sidebar-pic'), {

		allowTaint: true,

		taintTest: false,

		onrendered: function(canvas) {

			canvas.id = "mycanvas";

			document.body.appendChild(canvas); 

			//生成base64图片数据 

			var dataUrl = canvas.toDataURL();

			var newImg = document.createElement("img");

			newImg.src = dataUrl;

			$('.modify-imgs-box').eq(0).find('img').attr('src',dataUrl);

		}

	});
}

// 搜索模块
function toSearch(){
	// 敲回车搜索
	$('.search-box').on('keyup',function (e){
		var _val = $('.search-box').val(),
			_txt = $('.designer-works-nav-current').text(),
			_title = $('.works-current').val();

		if(e.keyCode == 13){
			if(_val != '' || _val != null){
				$.post('/designer/unpublished_good_search',{
					'search_val': _val,
					'search_txt': _txt,
					'search_type': _title
				},function (e){
					var waitList = JSON.parse(e).all_list,
						totalPage = JSON.parse(e).total_pages;

					setData(waitList,totalPage);
				});
			}
		}
	});

	// 点击搜索
	$('.designer-works-search-icon').on('click',function (){
		var _val = $('.search-box').val(),
			_txt = $('.designer-works-nav-current').text(),
			_title = $('.works-current').val();

		if(_val != '' || _val != null){
			$.post('/designer/unpublished_good_search',{
				'search_val': _val,
				'search_txt': _txt,
				'search_type': _title
			},function (e){
				var waitList = JSON.parse(e).all_list,
					totalPage = JSON.parse(e).total_pages;

				setData(waitList,totalPage);
			});
		}
	});

	function setData(data,totalPage){
		var _head = $('.designer-works-btn button').val();


		switch(_head){
			case '0': toPrice();
			break;
			case '1': return 1;
			break;
			case '2': return 2;
			break;
			case '3': return 3;
			break;
		}

		// ajax 获得待定价数据
		function toPrice(){
			var _tbody = $('.designer-works-wait tbody'),
				_trNode = _tbody.find('tr').html(),
				_node = '<tr class="designer-works-list-box clearfix" data-state="1" data-img="http://192.168.1.101:8888/static/photo.png" data-uptime="2015-09-02" data-size="0.434" data-type="stl" data-id="180">' + _trNode + '</tr>';

			_tbody.html('');
			for(var i=0;i<data.length;i++){

				_tbody.append(_node);
				$('.designer-works-list-box').attr('data-img',data[i].img);
				$('.designer-works-list-box').attr('data-size',data[i].file_size);
				$('.designer-works-list-box').attr('data-uptime',data[i].upload_time);
				$('.designer-works-list-box').attr('data-type',data[i].type);
				$('.designer-works-list-box').attr('data-id',data[i].id);
			}

		}

		// $('.designer-works-wait tbody').html('');

		// var waitStr = '<table class="designer-works-wait" cellpadding="0" cellspacing="0"><thead><tr><th><span>作品名称</span></th><th><span>文件类型｜文件大小</span></th><th><span>上传时间</span></th><th colspan="2">操作</th></tr></thead>';	
		// for(var i=0,len=data.length;i<len;i++){
		// 	waitStr += '<tr data-id="'+data[i].id+'"><td><span>'+data[i].name+'</span></td><td><span>'+data[i].type+'文件 ｜'+data[i].file_size+'M </span></td><td><span>'+data[i].upload_time+'</span></td><td><span><button class="w-modify-btn ">去定价</button></span></td><td></span><a href="javascript:void(0)" class="wait-delete-single">删除</a><input type="checkbox" class="works-wait-delete-check"></span></td></tr>';
		// }
		// getPage(totalPage,1);
		// designer_works_lists.append(waitStr);
		// deleteSigle();
	}

	$('.designer-works-nav li').on('click',function (){
		var _txt = $(this).text(),
			_title = $('.works-current').val();

		$(this).siblings().removeClass('designer-works-nav-current');
		$(this).addClass('designer-works-nav-current');
		$.post('/designer/unpublished_good_search',{
			'search_txt': _txt,
			'search_type': _title
		},function (e){
			var waitList = JSON.parse(e).all_list,
				totalPage = JSON.parse(e).total_pages;

			setData(waitList,totalPage);
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

function workd_unexecute(page){		//加载待定价的数据
	var designer_works_lists = $('.designer-works-lists');
	var designer_works_page =$('.designer-works-page');
	designer_works_page.remove();
	designer_works_lists.empty();
	var waitStr = '<table class="designer-works-wait" cellpadding="0" cellspacing="0"><thead><tr><th><span>作品名称</span></th><th><span>文件类型｜文件大小</span></th><th><span>上传时间</span></th><th colspan="2">操作</th></tr></thead>';
	$.post('/designer/workd_unexecute',{"page":page}, function(e) {
		if(e){
			var waitList = JSON.parse(e).all_list;
			var totalPage = JSON.parse(e).total_pages;
			if(waitList.length == 0){
				designer_works_lists.html('<p class="f16 pl20 pt20">您暂时还没有待定价的商品</p>');
			}else {
				for(var i=0,len=waitList.length;i<len;i++){

					waitStr+='<tr class="designer-works-list-box clearfix" data-state=1 data-img="'+ waitList[i].preview_1 +'" data-uptime="'+ waitList[i].upload_time +'" data-size="'+ waitList[i].file_size +'" data-type="'+ waitList[i].type +'" data-id="'+waitList[i].id+'"><td><span class="designer-works-list-title">'+waitList[i].name+'</span></td><td><span>'+waitList[i].type+'文件 ｜'+waitList[i].file_size+'M </span></td><td><span>'+waitList[i].upload_time+'</span></td><td><span><button class="w-modify-btn ">去定价</button></span></td><td></span><a href="javascript:void(0)" class="wait-delete-single">删除</a><input type="checkbox" class="works-wait-delete-check"></span></td></tr>';
				}

				waitStr +='<div class="designer-works-deleteAll"><button class="works-deleteAll-btn" onclick="deleteAll()">批量删除</button><label for="checkall">全选</label><input type="checkbox" class="works-delete-allcheck" id="checkall" onclick="isCheckAll(this)"/></div></table>';
				getPage(totalPage,page);
			}
		}else{
			waitStr ='数据加载失败...';
		}

		designer_works_lists.append(waitStr);
		edit();
		deleteSigle();

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
			if(onList.length == 0){
				designer_works_lists.html('<p class="f16 pl20 pt20">您暂时还没有审核中的商品</p>');
			}else {
				for(var i=0,len=onList.length;i<len;i++){
					onStr += '<div class="designer-works-list-box clearfix" data-id="'+onList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+onList[i].pic[0]+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">'+onList[i].name+'</p><p class="designer-works-list-describe">'+onList[i].description+'</p><div class="designer-works-list-pics clearfix">';
					for(var j=0,jlen=onList[i].pic.length;j<jlen;j++){
						onStr += '<img src="'+onList[i].pic[j]+'"/>';
					}
					onStr += '</div></div><div class="designer-works-list-status fl"><strong>审核中···</strong><p>您的作品预计在'+onList[i].restdate+'天内被审核完毕并发布。</p></div></div>';
				}
				getPage(totalPage,page);
			}

		}else{
			onStr = '信息加载失败..';
		}
		designer_works_lists.append(onStr);

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
			if(sucList.length == 0){
				designer_works_lists.html('<p class="f16 pl20 pt20">您暂时还没有已发布的商品</p>');
			}else {
				for(var i=0,len=sucList.length;i<len;i++){
					sucStr += '<div class="designer-works-list-box clearfix" data-state=4 data-uptime="'+ sucList[i].approval_time +'" data-size="'+ sucList[i].file_size +'" data-type="'+ sucList[i].type +'" data-id="'+sucList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+sucList[i].pic[0]+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">'+sucList[i].name+'</p><p class="designer-works-list-describe">'+sucList[i].description+'</p><div class="designer-works-list-pics clearfix">';
					for(var j=0,jlen=sucList[i].pic.length;j<jlen;j++){
						sucStr += '<img src="'+sucList[i].pic[j]+'"/>';
					}

					sucStr += '</div></div><div class="designer-works-list-data fl"><div class="list-data-container clearfix"><div class="list-data-box fl"><span class="list-data-num list-download-num">'+sucList[i].download_count+'</span>次下载</div><div class="list-data-box fl"><span class="list-data-num list-collection-num">'+sucList[i].collected_count+'</span>次收藏</div></div><div class="list-data-price">售价：<span class="list-data-price-num">'+sucList[i].good_price+'</span>RMB</div><div class="list-data-update">发布时间：<span class="list-data-update-num">'+sucList[i].approval_time+'</span></div></div><div class="designer-works-modify fl"><button class="works-modify-btn ">编辑</button><button class="works-cancel-btn">取消发布</button><input type="checkbox" class="works-cancel-check"/></div></div>'
				}
				sucStr += '<div class="works-canelbox"><button class="works-canelAll-btn">批量取消发布</button><label for="checkall">全选</label><input type="checkbox" class="works-cancel-allcheck" id="checkall"/></div>';
				getPage(totalPage,page);
			}
		}else{
			sucStr = '信息加载失败..';
		}
		designer_works_lists.append(sucStr);
		cancelAll();
		cancelSigle();

		publish_edit();	


		$('.works-cancel-allcheck').on('click',function (){
			if(this.checked){
				$('.works-cancel-check').each(function(){ this.checked = true; });
			}else {
				$('.works-cancel-check').each(function(){ this.checked = false; });
			}
		});
		$('.works-canelAll-btn').on('click',function (){
			var _cancelbool = false,
				_this = $(this);

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

			if(notList.length == 0){
				designer_works_lists.html('<p class="f16 pl20 pt20">您暂时还没有未通过的商品</p>');
			}else {
				for(var i=0,len=notList.length;i<len;i++){
					notStr+='</div><div class="designer-works-list-box clearfix" data-state=3 data-id="'+notList[i].id+'" data-type="'+notList[i].type+'" data-size="'+notList[i].file_size+'" data-price="'+notList[i].good_price+'" data-uptime="'+notList[i].upload_time+'"><div class="designer-works-list-bigpic fl"><img src="'+notList[i].pic[0]+'" class="works-list-bigpic" /></div><div class="designer-works-list-smdetail fl"><p class="designer-works-list-title">'+notList[i].name+'</p><p class="designer-works-list-describe">'+notList[i].description+'</p><div class="designer-works-list-pics clearfix">';
					var picList=notList[i].pic;
					for(var j=0,jlen=picList.length;j<jlen;j++){
						notStr +='<img src="'+picList[j]+'" class="designer-works-list-img" data-pid="'+j+'"/>';
					}

					notStr+='</div></div><div class="works-data-box fl"><div class="works-not-container clearfix"><p class="works-not-explain"><span>未通过说明:</span>'+notList[i].not_passed+'</p><p class="works-not-time fr">'+notList[i].modify_time+'</p></div></div><div class="designer-works-modify fl"><button class="works-modify-btn ">编辑</button><button class="works-cancel-btn">取消发布</button><input type="checkbox" class="works-cancel-check"/></div></div>';
				}
				notStr += '<div class="designer-works-cancelAll"><button class="works-cancelAll-btn" onclick="cancelAll()">批量取消发布</button><label for="checkall">全选</label><input type="checkbox" class="works-cancel-allcheck" id="checkall" onclick="isCheckAll(this)"/></div></table>';
				getPage(totalPage,page);
			}

		}else{
			notStr='信息加载失败';
		}
		designer_works_lists.append(notStr);

		cancelSigle();
		edit();
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

	deleteTag.each(function(index, el) {
		var _this = $(this),
			_id = _this.parents('tr').attr('data-id');
		var _this = $(this),
			deleteObj = _this.parents('tr'),
			state = deleteObj.attr('data-state');
		$.post('/designer/unexecute_delete', {"id":_id, 'state':state}, function(e){

			if(e){
			}
		});
		_this.parents('tr').remove();
	});
	$('#checkall').attr('checked',false);
}

function deleteSigle(){		//单个删除

	$('.wait-delete-single').on('click',function(){
		var _this =$(this),
			deleteObj = _this.parents('tr'),
			_id = deleteObj.attr('data-id');
		var _this = $(this),
			deleteObj = _this.parents('tr'),
			state = deleteObj.attr('data-state');
		$.post('/designer/unexecute_delete', {"id":_id , 'state':state}, function(e){

			if(e){
				$.msgBox.mini("删除成功！");
				window.location.reload();
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
		var _this = $(this),
			deleteObj = _this.parents('.designer-works-list-box'),
			state = deleteObj.attr('data-state');
		$.post('/designer/unexecute_delete', { "id": _id ,'state':state }, function(e){

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
		var _this = $(this),
			deleteObj = _this.parents('.designer-works-list-box'),
			state = deleteObj.attr('data-state');
		$.post('/designer/unexecute_delete', {"id":_id , 'state':state}, function(e){
			if(e){
				$.msgBox.mini("取消发布成功！");
				window.location.reload();	
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
			cur = parseInt(cur);
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
			if(thisType=="待定价"){
				workd_unexecute(toPage);
			}else if(thisType=="审核中"){
				auditing(toPage);
			}else if(thisType=="未通过"){
				not_passed(toPage);
			}else if(thisType=="已发布"){
				published(toPage);
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
				$.msgBox.mini("没有下一页啦!");
				return false;
			}
		}else if(toPage == "上一页"){
			if(curPage != 1){
				return curPage-1;
			}else{
				$.msgBox.mini("没有上一页啦!");
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
			_kind = 'pushed';
		p_editInfo(_this,_kind);

	});

	$('.w-modify-btn').on('click',function(){
		var _this = $(this),
			_kind = 'unexecute';

		p_editInfo(_this,_kind);
		$('.modify-imgs').attr('src','/static/images/common/up_default.jpg');

	});

	function p_editInfo (_this,_kind){
		var _parent = _this.parents('.designer-works-list-box'),
			id = _parent.attr('data-id'),
			pic = _parent.find('.designer-works-list-bigpic img').attr('src'),
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
		$('.modify-price').val(price);
		$('.modify-name').val(name);
		$('.modify-describe').text(describe);
		$('.modify-id').val(id);

		if(_kind == 'unexecute'){
			var _imgsrc = _parent.attr('data-img');
			$('.modify-stl-preview').attr('src',_imgsrc );
		}

		var imgsrc = imgs.eq(0).attr('src');
		imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+0+'"><img src="'+imgsrc+'" class="modify-imgs"/><div class="modify-imgs-modify"><div class="modify-imgs-modify-hidden"><input type="file" name="1" /></div><a href="javascript:void(0)" class="modify-imgs-modify-btn pr5">修改</a><a href="javascript:void(0)" class="modify-imgs-delete-btn ml5">删除</a></div></div>';
		var imgsrc = imgs.eq(1).attr('src');
		imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+1+'"><img src="'+imgsrc+'" class="modify-imgs"/><div class="modify-imgs-modify"><div class="modify-imgs-modify-hidden"><input type="file" name="2" /></div><a href="javascript:void(0)" class="modify-imgs-modify-btn pr5">修改</a><a href="javascript:void(0)" class="modify-imgs-delete-btn ml5">删除</a></div></div>';
		var imgsrc = imgs.eq(2).attr('src');
		imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+2+'"><img src="'+imgsrc+'" class="modify-imgs"/><div class="modify-imgs-modify"><div class="modify-imgs-modify-hidden"><input type="file" name="3" /></div><a href="javascript:void(0)" class="modify-imgs-modify-btn pr5">修改</a><a href="javascript:void(0)" class="modify-imgs-delete-btn ml5">删除</a></div></div>';

		$('.modify-imgs-container').append(imgStr);
		$('.modify-imgs-delete-btn').on('click',function(){		//删除图片
			var imgBox = $('.modify-imgs-box');
			if(imgBox.length==1){
				$.msgBox.mini("至少要有一张预览图");
			}else{
				var _index = $(this).parents('.modify-imgs-box').index(),
					picId = _parent.find('.designer-works-list-pics img').eq(_index).attr('data-pid');	//pic分别是0，1，2

				$.post('/designer/deletePic', { "picId": picId, "id": id },function (e){
					if('success'==JSON.parse(e).status){
						$.msgBox.mini('删除成功');
					}
				});$(this).parents('.modify-imgs-box').find('img').attr('src','');
			}
		});

		// 修改图片
		$('.modify-imgs-modify-btn').on('click',function(){

			$(this).prev().find('input').click();
		});

		// added by white	
		$('#show-3d-cont').hide();
		$('#show-3d').html(null);
		$('.modify-stl-preview').unbind("click");
		$('.modify-stl-preview').click(function(){
			var stlTypeVal = $('.works-current').attr('value');
			if(stlTypeVal === '0'){
				showStlFileInRemoteServer(id , 'unpassed',  260, 260, 'show-3d');
			}else if(stlTypeVal === '2'){
				showStlFileInRemoteServer(id , 'unpassed',  260, 260, 'show-3d');
			}else if(stlTypeVal === '3'){
				showStlFileInRemoteServer(id , '',  260, 260, 'show-3d');
			}
		});
	}

	closeEdit();

	$('.modify-btn-submit').on('click',function (){
		$('.changeInfo').submit();

		// added by white
		var workId = $('.designer-works-list-box').attr('data-id');		

		$.post('/designer/screenshot', {'id': workId, 'screenshot': ShowStl.screenShotData}, function(e){
			;
		});

	});
}

// 关闭弹窗
function closeEdit(){
	$('.modify-container-close').on('click',function(){
		$('.designer-zoom').css('display','none');
		$('.modify-content').css('display','none');
		$('#show-3d').html(null);
		$('#show-3d-cont').hide();
	});
}


function publish_edit(){	//编辑弹窗函数
	$('.works-modify-btn').on('click',function(){
		var _this = $(this),
			_parent = _this.parents('.designer-works-list-box'),
			id = _parent.attr('data-id'),
			pic = _parent.find('.designer-works-list-bigpic img').attr('src'),
			type = _parent.attr('data-type'),
			size = _parent.attr('data-size'),
			price = _parent.find('.list-data-price-num').text(),
			name = _parent.find('.designer-works-list-title').text(),
			describe = _parent.find('.designer-works-list-describe').text(),
			imgs = _parent.find('.designer-works-list-pics img'),
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
		$('.modify-price').val(price);
		$('.modify-name').val(name);
		$('.modify-describe').text(describe);

		var imgsrc = imgs.eq(0).attr('src');
		imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+0+'"><img src="'+imgsrc+'" class="modify-imgs"/></div>';
		var imgsrc = imgs.eq(1).attr('src');
		if (imgsrc) {
			imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+1+'"><img src="'+imgsrc+'" class="modify-imgs"/></div>';
		}
		var imgsrc = imgs.eq(2).attr('src');
		if (imgsrc) {
			imgStr += '<div class="modify-imgs-box fl" id="imageDiv'+2+'"><img src="'+imgsrc+'" class="modify-imgs"/></div>';
		}
		$('.modify-imgs-container').append(imgStr);

		// added by white	
		$('#show-3d-cont').hide();
		$('#show-3d').html(null);
		$('.modify-stl-preview').unbind("click");
		$('.modify-stl-preview').click(function(){
			var stlTypeVal = $('.works-current').attr('value');
			if(stlTypeVal === '2'){
				showStlFileInRemoteServer(id , 'unpassed',  260, 260, 'show-3d');
			}else if(stlTypeVal === '3'){
				showStlFileInRemoteServer(id , '',  260, 260, 'show-3d');
			}
		});

	});

	closeEdit();

	$('.modify-btn-submit').on('click',function (){
		$('.changeInfo').submit();

		// added by white
		var workId = $('.designer-works-list-box').attr('data-id');
		$.post('/designer/edit/screenshot', {id: workId, screenshot: ShowStl.screenShotData}, function(e){});
	});
}

// 关闭弹窗
function closeEdit(){
	$('.modify-container-close').on('click',function(){
		$('.designer-zoom').css('display','none');
		$('.modify-content').css('display','none');
		$('#show-3d').html(null);
		$('#show-3d-cont').hide();
	});
}


