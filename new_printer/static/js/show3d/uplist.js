(function(){

	var toyLists = $('.designer-works-list-box'),
		toyListsBigPic = $('.designer-works-list-bigpic');

})()

function showpic(index,src,url,name,describe){	//点击图片查看详情以及切换图片

}

function showStlFileInRemoteServer(stlId, unpassed, canvasW, canvasH, containerId){
	$.post('/designer/show_3d',{'pic_id': stlId, unpassed: unpassed},function (e){
		var url_path = JSON.parse(e).url_path ;
		console.log('path':url_path);
		initializeObj(url_path, canvasW, canvasH, containerId);
		$('#show-3d-cont').show();
		// added by white
		$('#show-3d-tool-fullscreen').unbind("click");
		$('#show-3d-tool-fullscreen').on('click', function(){
			var win_height = $(window).height();
			var win_width = $(window).width();
			$('#show-3d-fullscreen').empty();
			initializeObj(url_path, win_width, win_height, 'show-3d-fullscreen');

		}); 
	});
}
