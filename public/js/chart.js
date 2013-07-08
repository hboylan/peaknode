$(function () {
	// Get the last week
	var start = new Date(), today = dateId(start);
	var then = new Date(start.setDate(start.getDate() - 7));
	for(i=1; i<8; i++){
		var day = new Date(new Date(start).setDate(then.getDate() + i)), date = dateId(day);
		$('#last-week-btns').append('<button class="btn btn-large" id="'+date+'" date="'+dateFormat(day)+'">'+date+'</button>');
	}
	//Set today to active
	activate('#today');
	activate('#'+today);
	
	// Initialize chart
	refresh({span:1, day:dateFormat(new Date())});
	
	// Initialize click handlers
	$('#today').click(function(e){
		var now = new Date();
		e.preventDefault();
		refresh({span:1, day:dateFormat(now)});
		clearActivate('#today');
		activate('#'+dateId(now))
	});
	
	$('#last-week').click(function(e){
		e.preventDefault();
		refresh({span:7});
		clearActivate('#last-week');
	});
	
	$('#last-month').click(function(e){
		e.preventDefault();
		refresh({span:30});
		clearActivate('#last-month');
	});
	
	$('#last-week-btns > button').click(function(e){
		e.preventDefault();
		var self = e.target, date = $(self).attr('date');
		refresh({span:1, day:date});
		clearActivate('#'+self.id);
		if(date == dateFormat(new Date()))
			activate('#today');
	});
});

function clearActivate(btn){
	$('#chart').find('button').removeClass('active');
	$(btn).addClass('active');
}

function activate(btn){
	$(btn).addClass('active');
}

function dateFormat(date){
	return date == undefined? date:date.getUTCFullYear()+'-'+(date.getUTCMonth()+1)+'-'+date.getDate();
}

function dateId(date) {
	return (date.getMonth()+1)+'-'+date.getDate();
}

function refresh(data) {
	var subtitle, axis, data;
	
	$.ajax({
		url:'../api/chart',
		data:data,
		dataType:'json',
		async:false,
		success:function(r){
			console.log(r);
			subtitle = r.title, axis = r.axis, data = r.data;
		},
		fail:function(r){ console.log(r); }
	});
	renderChart(subtitle, axis, data);
}

function old_refresh(data) {
	var subtitle, axis, data, ajax_data;
		
	if(data.day)
		ajax_data = { day:dateFormat(data.day) };
	else if(data.span)
		ajax_data = { span:JSON.stringify(data.span) };
	
	$.ajax({
		url:'../api/chart',
		data:ajax_data,
		dataType:'json',
		async:false,
		success:function(r){
			console.log(r);
			subtitle = r.title, axis = r.axis, data = r.data;
		},
		fail:function(r){ console.log(r); }
	});
	renderChart(subtitle, axis, data);
}



function renderChart(subtitle, axis, data) {
	$('#container').highcharts({
	    chart: {
	        type: 'line',
	        marginRight: 130,
	        marginBottom: 25
	    },
	    title: {
	        text: 'Average Room Temperature',
	        x: -20 //center
	    },
	    subtitle: {
	        text: subtitle,
	        x: -20,
	    },
	    xAxis: {
	        categories: axis
	    },
	    yAxis: {
	        title: {
	            text: 'Temperature (°F)'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    tooltip: {
	        valueSuffix: '°C'
	    },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'top',
	        x: -10,
	        y: 100,
	        borderWidth: 0
	    },
	    series: data
	});
}