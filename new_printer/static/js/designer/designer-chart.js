$(function(){

	var chart_btn = $('.chart-btn'),
		comment_list = $('.comment-title ul li'),
		work_data_w = [],
		work_data_m = [],
		labels;
	
	getDataWork();
	function getDataWork(){
		$.post('/designer/works_visit',{}, function(e) {
			if(e){
				var weekNumwork = JSON.parse(e).weekNumwork,
					monthNumwork = JSON.parse(e).monthNumwork,
					weekNumcenter = JSON.parse(e).weekNumcenter,
					monthNumcenter = JSON.parse(e).monthNumcenter;

				work_data_w = [
			    	{
			    		value: weekNumwork,
			    		color: '#7ecbed',
			    		line_width: 2
			    	}
			    ];

			    work_data_m = [
			    	{
			    		value: monthNumwork,
			    		color: '#7ecbed',
			    		line_width: 2
			    	}
			    ];

			    center_data_w = [
			    	{
			    		value: weekNumcenter,
			    		color: '#7ecbed',
			    		line_width: 2
			    	}
			    ];

			    center_data_m = [
			    	{
			    		value: monthNumcenter,
			    		color: '#7ecbed',
			    		line_width: 2
			    	}
			    ];

			    setHomeVisitChart(work_data_w);
			    setGoodsVisitChart(center_data_w);

			    // 点击选择图表显示日期类型
				chart_btn.on('click',function (){
					var _this = $(this),
						_txt = _this.text(),
						_index = _this.index(),
						isHome = _this.parent().hasClass('isHome');

					labels = arrLabels[_index];
					$(this).siblings().removeClass('active');
					$(this).addClass('active');

					if(isHome){
						if(_txt == 'week'){
							setHomeVisitChart(work_data_w);
						}else if(_txt == 'month') {
							setHomeVisitChart(work_data_m);
						}
					}else {
						if(_txt == 'week'){
							setGoodsVisitChart(center_data_w);
						}else if(_txt == 'month') {
							setGoodsVisitChart(center_data_m);
						}
					}

				});
			}
		});
	}
    
	var arrLabels = [
		["MON","TUE","WED","THUR","FRI","SAT","SUN"],
		["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
	];
	labels = arrLabels[0];
	
	// 主页访问量函数
	function setHomeVisitChart(data){
		var homeVisit_chart = new iChart.Area2D({
			render : 'homeVisit',
			data: data,
			title : '',
			width : 780,
			height : 300,
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
	
	// 商品访问量函数
	function setGoodsVisitChart(data){
		var goodsVisit_chart = new iChart.Area2D({
			render : 'goodsVisit',
			data: data,
			title : '',
			width : 780,
			height : 300,
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