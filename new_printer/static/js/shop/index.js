$(function() {//导航切换效果
	var navlist = $('.mainbody-nav-ul');

		navlist.each(function(index, el) {
			var navlist = $(this).find('li');
			navlist.each(function(index, el) {
				$(this).on('click',function(e){
					var _this = $(this),
						thisParent = _this.parent('ul'),
						thisShowlist = _this.parent().parent().siblings('.mainbody-list'),
						thisType = thisParent.siblings('h2').text(),
						thisStyle = _this.text();
						console.log(thisType+'  '+thisStyle);
					thisParent.children('li').removeClass('mainbody-nav-current');
					var thisleft = 105*(index%5);
					thisParent.find('span').animate({'left':thisleft}, 400);
					_this.addClass('mainbody-nav-current');
					thisShowlist.empty();

					$.ajax({
						url: '/shop/filterType',
						type: 'GET',
						data: { 'type': thisType,
								'style': thisStyle
							},
					})
					.done(function(res) {
						var list = JSON.parse(data).type.goods_list;
						var listStr;
						for(var i = 0,len=list.length;i<len;i++){
							listStr += '<div class="list-goodsbox fl"><div class="list-picbox"><a href="'+goods[i].goods.src +'"><img src="'+goods[i].goods.preview_1 +'"alt="商品图片"/></a><div class="list-goods-name f14"><span class="fl">'+goods[i].goods.goods_name+'</span><em class="fr"></em></div></div><p class="list-goods-describe f12">'+goods[i].goods.discription +'</p><div class="list-goods-show clearfix"><img src="'+goods[i].goods.preview_1+'" alt="商品图片" class="fl"/><img src="'+goods[i].goods.preview_2+'" alt="商品图片" class="fl"/><img src="'+goods[i].goods.preview_3+' " alt="商品图片" class="fl"/></div><div class=" list-goods-info f16 clearfix"><span class="list-goods-price fl">￥'+goods[i].goods.goods_price+'</span><span class="list-goods-author fr">'+goods[i].designer+'</span></div></div>'
						}
						thisShowlist.append(listStr);
					})
					.fail(function() {
						console.log("加载失败");
					})
					.always(function() {
						console.log("请求完成");
					});
					
				});				
		});
	});
});