(function(){
	/*var up_main_btn = $('.up-main-btn'),*/
	/*zoom = $('.zoom'),*/
	/*show_close = $('.show-close'),*/
	/*upform_close = $('.upform-close'),*/
	/*show = $('.show'),*/
	/*upform = $('.upform'),*/
	/*up_form_btn = $('.up-form-btn'),*/
	/*up_main_tag = $('.up-main-labels label'),*/
	/*up_list_box = $('.up-list-box'),*/
	/*up_list_morebtn = $('.up-list-morebtn'),*/
	/*toylists = $('.up-main-list ul li'),*/
	/*show_download = $('.show-download'),*/
	/*show_prev = $('.show-prev'),*/
	/*show_next = $('.show-next'),*/
	/*show_img = $('.show-img img'),*/
	/*show_describe = $('#show_describe'),*/
	/*show_name = $('#show_name');*/

	/*up_main_btn.on('click',function(){		//上传文件窗口打开*/
	/*zoom.show();*/
	/*upform.show(300);*/
	/*});*/
	/*upform_close.on('click',function(){		//上传文件窗口关闭*/
	/*upform.hide(300,function(){*/
	/*zoom.hide();*/
	/*});*/
	/*});*/
	/*show_close.on('click',function(){	//展示模型窗口打开*/
	/*show.hide(300,function(){*/
	/*zoom.hide();*/
	/*});ƒ*/
	/*});*/
	/*show_download.hover(function() {	//下载按钮交互效果*/
	/*show_download.addClass('show-download-hover');*/
	/*show_download.text('下载');*/
	/*}, function() {*/
	/*show_download.text('');*/
	/*show_download.removeClass('show-download-hover');*/
	/*});*/
	console.log('ready');
	var toyLists = $('.designer-works-list-box'),
		toyListsBigPic = $('.designer-works-list-bigpic');

	function showpic(index,src,url,name,describe){	//点击图片查看详情以及切换图片
		show_prev.show();
		show_next.show();
		if(index === 0){
			show_prev.hide();
		}else if(index == toylists.length-1){
			show_next.hide();
		}
		show_img.attr('src',src);
		show_name.text(name);
		show_describe.text(describe);
		Describe3d(url);
	}



	console.log('ccc');
	toyLists.each(function(index, el){
		console.log(';');	
	});
	/*toylists.each(function(index, el) {*/
	/*var _this = $(this);*/
	/*var thisIndex = index;*/
	/*_this.on('click',function(){*/
	/*zoom.show();*/
	/*show.show();*/
	/*var thisSrc = _this.find('img').attr('src'),*/
	/*this3dUrl = _this.find('#show_3durl').val(),*/
	/*thisName = _this.find('#show_3dname').val(),*/
	/*thisDescribe = _this.find('#show_3ddescribe').val();*/
	/*showpic(index,thisSrc,this3dUrl,thisName,thisDescribe);*/

	/*show_prev.on('click',function(){*/
	/*thisIndex--;*/
	/*var prevSrc = toylists.eq(thisIndex).find('img').attr('src');*/
	/*prev3dUrl = toylists.eq(thisIndex).find('.show_3durl').val(),*/
	/*prevName = toylists.eq(thisIndex).find('.show_3dname').val(),*/
	/*prevDescribe = toylists.eq(thisIndex).find('.show_3ddescribe').val();*/
	/*showpic(thisIndex,prevSrc,prev3dUrl,prevName,prevDescribe);*/
	/*});*/
	/*show_next.on('click',function(){*/
	/*thisIndex++;*/
	/*var nextSrc = toylists.eq(thisIndex).find('img').attr('src');*/
	/*next3dUrl = toylists.eq(thisIndex).find('.show_3durl').val(),*/
	/*nextName = toylists.eq(thisIndex).find('.show_3dname').val(),*/
	/*nextDescribe = toylists.eq(thisIndex).find('.show_3ddescribe').val();*/
	/*showpic(thisIndex,prevSrc,next3dUrl,nextName,nextDescribe);*/
	/*});*/
	/*});*/
	/*});*/

	/*// logout*/
	/*$('.up-head-quit').on('click',function (){*/
	/*$.post('/logout', {}, function (e){*/

	/*// your code*/

	/*location.reload();*/
	/*});*/
	/*});*/

	/*// tag's click*/
	/*up_main_tag.on('click',function (){*/
	/*var state = $(this).attr('state')*/
	/*console.log(state)*/
	/*$.post('/toy_photo/filter_photo', {"state":state}, function (e){*/
	/*var photo = JSON.parse(e).photo_list;*/
	/*var seller_order_cont = $('.up-main-list');*/
	/*seller_order_cont.html("");*/
	/*var div1 ="<ul class='up-list-box clearfix'>";*/
	/*var div2 = "</ul>";*/
	/*var div = "";*/
	/*//"<div class='seller-order-wrap'><div class='seller-order-list-hide'><ul class='simple-seller-order-nav clearfix'><li class='t-el'>"+"</li><li>订单名称："+info[i].goods_name+" <a class='f12' href='"+info[i].stl_path+""+info[i].goods_stl_file_url+"'>( 下载模型 )</a></li><li>商品状态：<span class='o-state'>"+info[i].curren_states+"</span></li><li>联系客户</li><span class='up-details f12'>展开详情<i class='triandre_ico'></i></span></ul></div><div class='seller-order-list'><div class='seller-order-box-head clearfix'><div class='s-order-num fl'><span class='mr50'>订单号："+info[i].bill_id+"</span><a href='javascript:;'><span><i class='contact-account'></i>联系客户</span></a></div><div class='s-order-time fr'><span class='mr50'>"+info[i].add_time+"</span><span class='put-btn'>收起</span></div></div><div class='s-order-list-content cl clearfix'><div class='s-order-list-img fl'><div class='list-img clearfix'><div class='list-img-box fl'><img src='"+info[i].img_path+""+info[i].goods_preview_1+"'alt=''></div><div class='list-img-txt fl'><div class='product-txt-info'><p class='product-name t-el tc f16 fb'>"+info[i].goods_name+"</p><p>设计师："+info[i].designer_nickname+"</p><p>材质："+info[i].goods_material+"</p><p>尺寸："+info[i].goods_size+"M</p><p>宝石："+info[i].goods_handle+"</p></div><p class='download'><a href='"+info[i].stl_path+""+info[i].goods_stl_file_url+"'>下载</a></p></div></div></div><div class='s-order-list-process fl'><div class='product-process'><div class='p-process-box bc'><div class='p-process-list bc clearfix'><div class='node-process "+info[i].active[0]+"'><span class='round-node'></span><span class='node-txt'>去出模</span></div><div class='node-process "+info[i].active[1]+"'><span class='round-node'></span><span class='node-txt'>出模成功</span></div><div class='node-process "+info[i].active[2]+"'><span class='round-node'></span><span class='node-txt'>去铸造</span></div><div class='node-process "+info[i].active[3]+"'><span class='round-node'></span><span class='node-txt'>铸造完成</span></div><div class='node-process "+info[i].active[4]+"'><span class='round-node'></span><span class='node-txt'>交易完成</span></div><i class='process-line'></i></div><div class='doit-btn'><a class='fb f20 show fr tc' href='javascript:;'>进入下一步</a><input type = 'hidden' class = 'order_id' value = '"+info[i].id+"'></input></div></div></div></div></div></div></div>")*/
	/*//src='"+info[i].img_path+""+info[i].goods_preview_1+"'alt=*/
	/*for(var i = 0 ; i < photo.length; i++){*/
	/*div = "<li><img src='"+photo[i].thumbnail_1+"'><span><b>"+photo[i].name+"</b</span></li>"+div;*/
	/*}*/
	/*seller_order_cont.html(seller_order_cont.html()+div1+div+div2);*/
	/*// your code*/
	/*});*/
	/*});*/

	/*// upload button's click*/
	/*up_form_btn.on('click',function (){*/
	/*$.post('', {}, function (e){*/

	/*// your code*/

	/*});*/
	/*});*/

	/*// 点击加载更多*/
	/*up_list_morebtn.on('click',function (){*/
	/*$.post('/toy_photo/photo_more', {}, function (e){*/
	/*var photo = JSON.parse(e).photo_list;*/
	/*var up_list_box = $('.up-list-box'),*/
	/*liStr = "<li><img src={{ toy_server_path }}{{ photo.thumbnail_1 }}.jpg' title = '{{ photo.name }}'><span><b>{{ photo.name }}</b></span><input id='show_3durl' type='hidden' value='{{ toy_server_path }}{{ photo.stl_file_url }}' /><input id='show_3dname' type='hidden' value='{{ photo.name }}' /><input id='show_3ddescribe' type='hidden' value='{{ photo.describe }}' /></li>";*/
	/*for(var i=0;i<photo.length;i++){*/
	/*up_list_box.append(liStr);*/
	/*}*/

	/*// your code*/

	/*});*/
	/*});*/

})()



function deisgnerWorkPicEvent(){
	$('.designer-works-list-bigpic').click(function(){
		/*console.log($(this).html());*/
		/*var picId = $(this).parent*/
		var picId = $(this).parent('.designer-works-list-box').attr('data-id');
		$.post('/designer/show_3d',{'pic_id': picId},function (e){
			var url_path = JSON.parse(e).url_path ;
			console.log(url_path);
		});
		console.log('id:'+picId);
	});
}
