$(document).ready(function() {
	var works_wait_btn = $('#works_wait_btn'),//未审核
		works_on_btn = $('#works_on_btn'),//审核中
		works_not_btn = $('#works_not_btn'),//未通过
		works_Suc_btn = $('#works_Suc_btn');//已发布
		designer_works_lists = $('.designer-works-lists');


	works_wait_btn.on('click',function(){//未审核页面
		designer_works_lists.empty();
		var waitStr='';
		$.post('designer/workd_unexecute',{}, function(e) {
			if(e){
				var waitlist = JSON.parse(e).list;
				console.log(waitlist.length);
				for(var i=0,len=waitlist.length;i<len;i++){
					waitStr+='<div class="designer-works-list-box clearfix"><div class="designer-works-list-bigpic fl"><img src="'+waitlist.bigPic+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">"'+waitlist.name+'"</p><p class="designer-works-list-describe">'+waitlist.describe+'</p><div class="designer-works-list-pics clearfix">';
					for(var j=0,jlen=waitlist.pic.length;j<jlen;j++){
						waitStr +='<img src="'+waitlist.pic[j]+'"/>';
					}
					waitStr +='</div></div><div class="designer-works-list-status fl"><strong>审核中···</strong><p>您的作品预计在'+waitlist.restdate+'天内被审核完毕并发布。</p></div></div>';
				}
				designer_works_lists.append(waitStr);
			}
		});
	});
	works_on_btn.on('click',function(){//审核中页面
		designer_works_lists.empty();
		var onStr ='';
		$.post('designer/photo_on_review',{}, function(e) {
			if(e){
				var onList = JSON.parse(e).list;
				for(var i=0,len=onList.length;i<len;i++){
					onList+='<div class="designer-works-list-box clearfix"><div class="designer-works-list-bigpic fl"><img src="'+onList.bigPic+'"/></div><div class="designer-works-list-detail fl"><p class="designer-works-list-title">"'+onList.name+'"</p><p class="designer-works-list-describe">'+onList.describe+'</p><div class="designer-works-list-pics clearfix">';
					for(var j=0,jlen=waitlist.pic.length;j<jlen;j++){
						onList +='<img src="'+onList.pic[j]+'"/>';
					}
					waitStr +='</div></div><div class="designer-works-list-data fl"><div class="list-data-container clearfix"><div class="list-data-box fl"><span class="list-data-num list-download-num">'+onList.downloadNum+'</span>次下载</div><div class="list-data-box fl"><span class="list-data-num list-collection-num">'+onList.collectionNum+'</span>次收藏</div></div><div class="list-data-price">售价：<span class="list-data-price-num">'+onList.price+'</span>RMB</div><div class="list-data-update">发布时间：<span class="list-data-update-num">'+onList.update+'</span></div></div><div class="designer-works-modify fl"><button class="works-modify-btn ">编辑</button><button class="works-cancel-btn">取消发布</button><input type="checkbox" class="works-cancel-check"/></div></div>'
				}
				onStr+='<div class="designer-works-canelAll"><button class="works-canelAll-btn">批量取消发布</button><label for="checkall">全选</label><input type="checkbox" class="works-cancel-allcheck" id="checkall"/></div>';
				designer_works_lists.append(onStr);
			}
		});

	});

});