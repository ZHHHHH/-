	 var myChart;
	function echartStr(title,names,brower,echartId){
		// 基于准备好的dom，初始化echarts实例
		if (myChart != null && myChart != "" && myChart != undefined) {  
	        myChart.dispose();  
	    } 
	    myChart = echarts.init(document.getElementById(echartId));
	    // 指定图表的配置项和数据
	    var option = {
		    title : {
		        text: title,
		        subtext: '单位：平方米',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a}{b} : {c} ({d}%)"
		    },
		    legend: {
				type: 'scroll',
				orient: 'vertical',
				right: 10,
				top: 20,
				bottom: 20,
				data: names
		    },
		    series : [
		        {
		            name: '',
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
					data: brower,
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            },
		            label: {
	                normal: {
	                    show: false,
	                }
	            },
		        }
		    ]
		};
	
	    // 使用刚指定的配置项和数据显示图表。
	    myChart.setOption(option);
	};
	

