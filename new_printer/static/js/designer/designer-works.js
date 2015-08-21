$(document).ready(function(){
	var works_wait_btn = $('#works_wait_btn'),//未审核
		works_on_btn = $('#works_on_btn'),//审核中
		works_not_btn = $('#works_not_btn'),//未通过
		works_Suc_btn = $('#works_Suc_btn');//已发布
		designer_works_lists = $('.designer-works-lists');
		designer_sidebar_menulist = $('.designer-sidebar-menulist');

	workd_unexecute();
	works_wait_btn.on('click',function(){
		workd_unexecute();
		addWorkBtnCurrent($(this));
	});
	$('#checkall').on('click',function(){
		isCheckAll();
	});

	works_on_btn.on('click',function(){//审核中页面
		designer_works_lists.empty();
		var onStr='';
		$.post('/designer/auditing',{"page":1}, function(e) {
			if(e){
				var onList = JSON.parse(e).all_list;
				for(var i=0,len=onList.length;i<len;i++){
					onStr+='<div class="designer-works-list-box clearfix" data-id="'+onList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+onList[i].bigPic+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">"'+onList[i].name+'"</p><p class="designer-works-list-describe">'+onList[i].describe+'</p><div class="designer-works-list-pics clearfix">';
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
			addWorkBtnCurrent($(this));
	});

	works_Suc_btn.on('click',function(){//已发布页面
		designer_works_lists.empty();


		var sucStr ='';
		$.post('/designer/has_published',{"page":1}, function(e) {

			if(e){
				var sucList = JSON.parse(e).all_list;
				for(var i=0,len=sucList.length;i<len;i++){
					sucList+='<div class="designer-works-list-box clearfix" data-id="'+sucList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+sucList[i].bigPic+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">"'+sucList[i].name+'"</p><p class="designer-works-list-describe">'+sucList[i].describe+'</p><div class="designer-works-list-pics clearfix">';
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
		addWorkBtnCurrent($(this));

	});

	works_not_btn.on('click',function(){//未通过页面
		designer_works_lists.empty();
		var notStr ='';

		$.post('/designer/not_passed', {"page":1}, function(e){

			if(e){
				var notList = JSON.parse(e).all_list;
				for(var i=0,len=notList.length;i<len;i++){
				notStr+='</div><div class="designer-works-list-box clearfix" data-id="'+notList[i].id+'"><div class="designer-works-list-bigpic fl"><img src="'+notList[i].bigPic+'" /></div><div class="designer-works-list-smdetail fl"><p class="designer-works-list-title">'+notList[i].name+'</p><p class="designer-works-list-describe">'+notList[i].describe+'</p><div class="designer-works-list-pics clearfix">';

					for(var j=0,jlen=notList[i].pic.length;j<jlen;j++){
						notList +='<img src="'+notList[i].pic[j]+'"/>';
					}

					notList+='</div></div><div class="designer-works-list-data fl"><div class="works-not-container clearfix"><p class="works-not-explain"><span>未通过说明:</span>'+notList[i].explain+'</p><p class="works-not-time fr">'+notList[i].notTime+'</p></div></div><div class="designer-works-modify fl"><button class="works-modify-btn ">编辑</button><button class="works-cancel-btn">取消发布</button><input type="checkbox" class="works-cancel-check"/></div></div>';
				}
			}else{
				notStr='信息加载失败';
			}
			designer_works_lists.append(notStr);
		});
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
function workd_unexecute(){
	var designer_works_lists = $('.designer-works-lists');
	designer_works_lists.empty();
	var waitStr = '<table class="designer-works-wait" cellpadding="0" cellspacing="0"><tr><th><span>作品名称</span></th><th><span>文件类型｜文件大小</span></th><th><span>上传时间</span></th><th colspan="2">操作</th></tr>';
	$.post('/designer/workd_unexecute', {"page":'1'}, function(e) {
		if(e){
			var waitList = JSON.parse(e).all_list;
			for(var i=0,len=waitList.length;i<len;i++){
				waitStr+='<tr data-id="'+waitList[i].id+'"><td><span>'+waitList[i].name+'</span></td><td><span>'+waitList[i].type+'文件 ｜'+waitList[i].file_size+'M </span></td><td><span>'+waitList[i].upload_time+'</span></td><td><span><button class="go-setprice">去定价</button></span></td><td></span>删除<input type="checkbox" class="works-wait-delete-check"></span></td></tr>';
			}
			waitStr +='<div class="designer-works-deleteAll"><button class="works-deleteAll-btn" onclick="deleteAll()">批量删除</button><label for="checkall">全选</label><input type="checkbox" class="works-delete-allcheck" id="checkall" onclick="isCheckAll(this)"/></div></table>';
		}else{
			waitStr ='数据加载失败...';
		}
		designer_works_lists.append(waitStr);
	});
}

function isCheckAll(obj){
	var _this = $(obj);
	if(!_this.attr('checked')){
		_this.attr('checked',true);
	$('input[type="checkbox"]').attr("checked",true);
		console.log(_this.attr("checked"));
	}else{
		_this.attr('checked',false);
		$('input[type="checkbox"]').attr('checked',false);
		console.log(_this.attr('checked'));
	}
}
function deleteAll(){
	var deleteTag = $('.works-wait-delete-check:checked');
	deleteTag.each(function(index, el) {
		var _this = $(this),
			_id = _this.parents('tr').attr('data-id');
		$.post('designer/remove_unexecute', {"id":_id}, function(e) {
			if(e){
				alert(e);
			}
		});
		$(this).parents('tr').remove();
	});
}