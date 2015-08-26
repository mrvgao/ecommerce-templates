$(function (){
	var _btn = $('.up-btn'),
		fileBox = $('.designer-upfile-show'),
		fileValue = $('.file-value'),
		designer_next_btn = $('#designer-next-btn'),
		fileValueNode = fileValue.html();

	// 上传文件
	_btn.on('click', function (){
		var _len = $('.upfile-hide').length;
		$('.upfile-hide').eq(_len-1).click();

		$('.upfile-hide').on('change', function (){
			var _val = $(this).val(),
				name = getFileName(_val),
				_cont;
			addCode(name);
		});
	});

	designer_next_btn.on('click',function (){
		$('.uploadFile').submit();
	});

	function addCode(name){
		_cont = '<p class="file-name"><em class="upfile-success"></em><span>' + name + '</span><a class="delete-file c888 ml20" href="javascript:void(0)">删除</a></p>';
		fileBox.append(_cont);
		fileValue.append(fileValueNode);

		for(var i=0;i<$('.file-name').length;i++){

			// 为了防止每次循环都绑定事件，每次循环前都 unbind
			$('.delete-file').eq(i).unbind('click');
			$('.delete-file').eq(i).on('click',function (){
				var _this = $(this),
					index = _this.parents('.file-name').index();
				$('.upfile-hide').eq(index).remove();
				_this.parents('.file-name').remove();
			});
		}
	}

	// 获取上传文件的文件名
	function getFileName(obj){
	    var pos = obj.lastIndexOf("\\");
	    return obj.substring(pos+1);
	}

})