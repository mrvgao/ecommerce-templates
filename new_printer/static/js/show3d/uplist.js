(function(){

	var toyLists = $('.designer-works-list-box'),
		toyListsBigPic = $('.designer-works-list-bigpic');

})()

function showpic(index,src,url,name,describe){	//点击图片查看详情以及切换图片

}

function showStlFileInRemoteServer(stlId, unpassed, canvasW, canvasH, containerId){
	$.post('/designer/show_3d',{'pic_id': stlId, 'unpassed': unpassed},function (e){
		var url_path = JSON.parse(e).url_path ;
		//url_path = 'http://www.3dilove.com/stl_static/'+ url_path
		$('#'+containerId).html(null);
		initializeObj(url_path, canvasW, canvasH, containerId);
		$('#'+containerId+'-cont').show();

		// added by white
		$('#'+containerId+'-tool-fullscreen').unbind("click");
		$('#'+containerId+'-tool-fullscreen').on('click', function(){
			var win_height = $(window).height();
			var win_width = $(window).width();
			$('#'+containerId+'-fullscreen').empty();
			initializeObj(url_path, win_width, win_height, ''+containerId+'-fullscreen');
		});

		$('#'+containerId+'-tool-cancel-fullscreen').unbind('click');
		$('#'+containerId+'-tool-cancel-fullscreen').click(function(){
			$('#'+containerId+'-fullscreen').empty();
			/*$('#'+containerId+'-cont').hide();*/
			$('#'+containerId).html(null);
			initializeObj(url_path, canvasW, canvasH, containerId);
			$('#'+containerId+'-cont').show();
		});
	});
}
