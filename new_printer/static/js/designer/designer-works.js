$(document).ready(function(){
	var works_wait_btn = $('#works_wait_btn'),//未审核
		works_on_btn = $('#works_on_btn'),//审核中
		works_not_btn = $('#works_not_btn'),//未通过
		works_Suc_btn = $('#works_Suc_btn');//已发布
		designer_works_lists = $('.designer-works-lists'),
		designer_works_container = $('.designer-works-container');

	workd_unexecute(1);
	

	$('#checkall').on('click',function(){
		isCheckAll();
	});

	$('.designer-works-page li').each(function(index, el) {
		var _this = $(this),
			_total = _this.parent('ul').attr('data-total');
		_this.on('click',function(){
			var toPage = _this.text(),
				thisType = $('.works-current').text();
			if(toPage=="首页"){
				toPage=1;
			}else if(toPage=="末页"){
				toPage=_total;
			}else if(toPage=="..."){
				return false;
			}
			
			if(thisType=="未审核"){
				workd_unexecute(toPage);
			}else if(thisType=="审核中"){
				auditing(toPage);
			}else if(thisType=="未通过"){
				published(toPage);
			}else if(thisType=="已发布"){
				not_passed(toPage);
			}
		});
	});

	works_wait_btn.on('click',function(){//未审核按钮点击
		workd_unexecute(1);
		addWorkBtnCurrent($(this));
	});
	works_on_btn.on('click',function(){//审核中按钮点击
		auditing(1);
		addWorkBtnCurrent($(this));
	});

	works_Suc_btn.on('click',function(){//已发布按钮点击
		published(1);
		addWorkBtnCurrent($(this));

	});

	works_not_btn.on('click',function(){//未通过按钮点击
		not_passed(1);
		addWorkBtnCurrent($(this));
	});

});


function addWorkBtnCurrent(_this){
	var designer_works_btn = $('.designer-works-btn').find('button');
	if(_this.hasClass('works-current')){
		return false;
	}else{
		designer_works_btn.removeClass('works-current');
		_this.addClass('works-current');
	}
}

function workd_unexecute(page){//加载未审核的数据
	var designer_works_lists = $('.designer-works-lists');
	designer_works_lists.empty();
	var waitStr = '<table class="designer-works-wait" cellpadding="0" cellspacing="0"><tr><th><span>作品名称</span></th><th><span>文件类型｜文件大小</span></th><th><span>上传时间</span></th><th colspan="2">操作</th></tr>';
	$.post('/designer/workd_unexecute',{"page":page}, function(e) {
		if(e){
			var waitList = JSON.parse(e).all_list;
			var totalPage = JSON.parse(e).total_pages;
			for(var i=0,len=waitList.length;i<len;i++){
				waitStr+='<tr data-id="'+waitList[i].id+'"><td><span>'+waitList[i].name+'</span></td><td><span>'+waitList[i].type+'文件 ｜'+waitList[i].file_size+'M </span></td><td><span>'+waitList[i].upload_time+'</span></td><td><span><button class="go-setprice">去定价</button></span></td><td></span>删除<input type="checkbox" class="works-wait-delete-check"></span></td></tr>';
			}
			waitStr +='<div class="designer-works-deleteAll"><button class="works-deleteAll-btn" onclick="deleteAll()">批量删除</button><label for="checkall">全选</label><input type="checkbox" class="works-delete-allcheck" id="checkall" onclick="isCheckAll(this)"/></div></table>';
		designer_works_container.append(getPage(totalPage,page));
		}else{
			waitStr ='数据加载失败...';
		}

		designer_works_lists.append(waitStr);
	});
}

function auditing(page){//加载审核中的数据
	designer_works_lists.empty();
	var onStr='';
	$.post('/designer/auditing',{"page":page}, function(e) {
		if(e){
			var onList = JSON.parse(e).all_list;
			for(var i=0,len=onList.length;i<len;i++){
				onStr+='<div class="designer-works-list-box clearfix" data-id="'+onList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+onList[i].pic[0]+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">"'+onList[i].name+'"</p><p class="designer-works-list-describe">'+onList[i].describe+'</p><div class="designer-works-list-pics clearfix">';
				for(var j=0,jlen=onList[i].pic.length;j<jlen;j++){
					waitStr +='<img src="'+onList[i].pic[j]+'"/>';
				}
				onStr +='</div></div><div class="designer-works-list-status fl"><strong>审核中···</strong><p>您的作品预计在'+onList[i].restdate+'天内被审核完毕并发布。</p></div></div>';

			}
		}else{
			onStr='信息加载失败..';
		}
		designer_works_lists.append(onStr);
	});
}

function published(page){//获取已发布数据
	designer_works_lists.empty();
	var sucStr ='';
	$.post('/designer/has_published',{"page":page}, function(e) {
		if(e){
			var sucList = JSON.parse(e).all_list;
			for(var i=0,len=sucList.length;i<len;i++){
				sucList+='<div class="designer-works-list-box clearfix" data-id="'+sucList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+sucList[i].pic[0]+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">"'+sucList[i].name+'"</p><p class="designer-works-list-describe">'+sucList[i].describe+'</p><div class="designer-works-list-pics clearfix">';
				for(var j=0,jlen=sucList[i].pic.length;j<jlen;j++){
					sucList +='<img src="'+sucList[i].pic[j]+'"/>';
				}
				sucStr +='</div></div><div class="designer-works-list-data fl"><div class="list-data-container clearfix"><div class="list-data-box fl"><span class="list-data-num list-download-num">'+sucList[i].downloadNum+'</span>次下载</div><div class="list-data-box fl"><span class="list-data-num list-collection-num">'+sucList[i].collectionNum+'</span>次收藏</div></div><div class="list-data-price">售价：<span class="list-data-price-num">'+sucList[i].price+'</span>RMB</div><div class="list-data-update">发布时间：<span class="list-data-update-num">'+sucList[i].update+'</span></div></div><div class="designer-works-modify fl"><button class="works-modify-btn ">编辑</button><button class="works-cancel-btn">取消发布</button><input type="checkbox" class="works-cancel-check"/></div></div>'
			}
			sucStr+='<div class="designer-works-canelAll"><button class="works-canelAll-btn">批量取消发布</button><label for="checkall">全选</label><input type="checkbox" class="works-cancel-allcheck" id="checkall"/></div>';
		}else{
			sucStr='信息加载失败..';
		}
			designer_works_lists.append(sucStr);
	});
}

function not_passed(page){//获取未通过数据
	designer_works_lists.empty();
	var notStr ='';
	$.post('/designer/not_passed', {"page":page}, function(e){
		if(e){
			var notList = JSON.parse(e).all_list;
			console.log(notList.length);
			for(var i=0,len=notList.length;i<len;i++){
			notStr+='</div><div class="designer-works-list-box clearfix" data-id="'+notList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+notList[i].pic[0]+'" /></div><div class="designer-works-list-smdetail fl"><p class="designer-works-list-title">'+notList[i].name+'</p><p class="designer-works-list-describe">'+notList[i].description+'</p><div class="designer-works-list-pics clearfix">';
				var picList=notList[i].pic;
				console.log(picList.length)
				for(var j=0,jlen=picList.length;j<jlen;j++){
					notStr +='<img src="'+picList[j]+'"/>';
				}

				notStr+='</div></div><div class="designer-works-list-data fl"><div class="works-not-container clearfix"><p class="works-not-explain"><span>未通过说明:</span>'+notList[i].not_passed+'</p><p class="works-not-time fr">'+notList[i].modify_time+'</p></div></div><div class="designer-works-modify fl"><button class="works-modify-btn ">编辑</button><button class="works-cancel-btn">取消发布</button><input type="checkbox" class="works-cancel-check"/></div></div>';
			}
		}else{
			notStr='信息加载失败';
		}
		designer_works_lists.append(notStr);
	});
}

function isCheckAll(obj){//全选函数

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

function deleteAll(){//批量删除函数
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

function getPage(total,cur){//生成页码
	var pageStr ='<ul class="designer-works-page" data-total="'+ total+'"><li class="designer-works-page-first">首页</li><li class="designer-works-page-prev">上一页</li>';
	console.log(total);
	if(total<=6){//当总页码小于6
		for(var p=0;p<total;p++){
			if((p+1) == cur){
				pageStr +='<li class="page-current">'+cur+'</li>';
			}else{
				pageStr +='<li>'+(p+1)+'</li>';
			}
		}
	}else if(total>6){//总页码大于6
		if(cur>5){//当前页大于5，前面出现小点
			pageStr+='<li class="designer-works-page-dots">...</li>';
			for(var p=cur-4;p<cur+2;p++){
				if((p+1) == cur){
					pageStr +='<li class="page-current">'+cur+'</li>';
				}else{
					pageStr +='<li>'+(p+1)+'</li>';
				}
			}
		}
		else{
			for(var p=0;p<6;p++){
				if((p+1) == cur){
					pageStr +='<li class="page-current">'+cur+'</li>';
				}else{
					pageStr +='<li>'+(p+1)+'</li>';
				}
			}
		}
		if((total-cur)>2){//当前页在倒数第二页之前，最后出现小点点
			pageStr +='<li class="designer-works-page-dots">...</li>';
		}
	}
	pageStr +='<li class="designer-works-page-next">下一页</li><li class="designer-works-page-last">末页</li></ul>';

	return pageStr;
}
