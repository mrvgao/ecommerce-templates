$(function(){

	var chart_btn = $('.chart-btn'),
		comment_list = $('.comment-title ul li'),
		labels;

	comment_list.on('click',function (){
		comment_list.removeClass('active');
		$(this).addClass('active');
	});

	// 点击选择图表显示日期类型
	chart_btn.on('click',function (){
		var _this = $(this),
			_index = _this.index(),
			isHome = _this.parent().hasClass('isHome');

		labels=arrLabels[_index];
		_this.parent().find('a').removeClass('active');
		_this.addClass('active');
		if(isHome){
			setHomeVisitChart();
		}else {
			setGoodsVisitChart();
		}
	});
    
	var arrLabels = [
		["MON","TUE","WED","THUR","FRI","SAT","SUN"],
		["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]	
	];

	labels = arrLabels[0];
	
	// 作品访问量函数
	function setHomeVisitChart(){
		var weekNum=[],monthNum=[];
		$.post('/designer/works_visit',{}, function(e) {
			if(e){
				var weekNum = JSON.parse(e).weekNum;
				var monthNum = JSON.parse(e).monthNum;
				console.log(weekNum)
				console.log(monthNum)
			}
		});

		var data = [
			{
				value:weekNum,
				color:'#aad0db',
				line_width:2
			},
			{
				value:monthNum,
				color:'#7ecbed',
				ine_width:2
			}
		];
		var homeVisit_chart = new iChart.Area2D({
			render : 'homeVisit',
			data: data,
			title : '',
			width : 800,
			height : 200,
			tip:{
				enable : true,
				listeners:{
					 //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
					parseText:function(tip,name,value){
						return value;
					}
				}
			},
			sub_option:{
				label:false,
				point_size:10
			},
			background_color:'#fff',
			coordinate:{
				axis : {
					width : [0, 0, 2, 0]
				},
				background_color:'#ffffff',
				height:'90%',
				scale:[{
					position:'left',	
					scale_space:500,
					scale_enable:false //禁用小横线
				},{
					position:'bottom',	
					start_scale:1,
					end_scale:12,
					parseText:function(t,x,y){
						return {textY:y+10}
					},
					scale_enable:false,
					labels:labels
				}]
			}
		});
		homeVisit_chart.draw();
	}
	setHomeVisitChart();
	// 个人中心访问量函数
	function setGoodsVisitChart(){
		var weekNum=[],monthNum=[];
		$.post('/designer/center_visit',{}, function(e) {
			if(e){
				weekNum = JSON.parse(e).weekNum;
				monthNum = JSON.parse(e).monthNum;
			}
		});

		var data = [
			{
				value:weekNum,
				color:'#aad0db',
				line_width:2
			},
			{
				value:monthNum,
				color:'#7ecbed',
				ine_width:2
			}
		];
		var goodsVisit_chart = new iChart.Area2D({
			render : 'goodsVisit',
			data: data,
			title : '',
			width : 800,
			height : 200,
			tip:{
				enable : true,
				listeners:{
					 //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
					parseText:function(tip,name,value){
						return value;
					}
				}
			},
			sub_option:{
				label:false,
				point_size:10
			},
			background_color:'#fff',
			coordinate:{
				axis : {
					width : [0, 0, 2, 0]
				},
				background_color:'#ffffff',
				height:'90%',
				scale:[{
					position:'left',	
					scale_space:500,
					scale_enable:false //禁用小横线
				},{
					position:'bottom',	
					start_scale:1,
					end_scale:12,
					parseText:function(t,x,y){
						return {textY:y+10}
					},
					scale_enable:false,
					labels:labels
				}]
			}
		});
		goodsVisit_chart.draw();
	}
	setGoodsVisitChart();
});