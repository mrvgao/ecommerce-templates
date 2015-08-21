$(document).ready(function() {
	var works_wait_btn = $('#works_wait_btn'),//未审核
		works_on_btn = $('#works_on_btn'),//审核中
		works_not_btn = $('#works_not_btn'),//未通过
		works_Suc_btn = $('#works_Suc_btn');//已发布
		designer_works_lists = $('.designer-works-lists');


	works_wait_btn.on('click',function(){
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
			}
		});
	});
});