$(function() {
	var navlist = $('.mainbody-nav-ul');

		navlist.each(function(index, el) {
			var navlist = $(this).find('li');
			navlist.each(function(index, el) {
				$(this).on('click',function(e){
					var _this = $(this),
						thisParent = _this.parent('ul');
					thisParent.children('li').removeClass('mainbody-nav-current');
					var thisleft = 105*(index%4);
					thisParent.find('span').animate({'left':thisleft}, 400);
					_this.addClass('mainbody-nav-current');
					
				});
		});
	});
});