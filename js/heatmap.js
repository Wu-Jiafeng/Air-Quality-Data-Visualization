      var margin = { top: 50, right: 0, bottom: 100, left: 30 },
          width = 600 - margin.left - margin.right,
          height = 375 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 31),
          legendElementWidth = gridSize*2,
          //buckets = 9,
		  buckets = 7,
          //colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
		  colors = ["#ffffd9","#c7e9b4","#7fcdbb","#1d91c0","#225ea8","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"],
          times = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24","25","26","27","28","29","30","31"],
		  xingqi = ["01", "02", "03", "04", "05", "06", "07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"],
		  yuefen = [31,28,31,30,31,30,31,31,30,31,30,31],
          hours = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

	  var tooltip = d3.select("body")//.select("#svgpic")
        .append("div")
        .attr("class","tooltip")
        .style("opacity",0.0);
		
      var svg0 = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
		  .attr("id", "dayheatmap")
		  
	  var svg2 = d3.select("#chart1").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height+300 + margin.top + margin.bottom)
		  .attr("id", "hourheatmap")
		  	  
	  //var svg1=svg0.append("g")
	  //	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	  //	  .style("opacity",0.0);

      var heatmapChart = function(jsonfile,citynum) {
		document.querySelector('#dayheatmap').innerHTML = '';
		document.querySelector('#hourheatmap').innerHTML = '';
		var svg=svg0.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  .style("opacity",1.0);
	    var dayLabels = svg.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 11) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

        var timeLabels = svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 0 && i <= 30) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
			
		d3.json(jsonfile,
        function(d) {
		  var data0=d;
		  var dataarray=[];
		  for(var i=0;i<365;i++){
			dataarray.push({"day":parseInt((d[i].date).substring(4,6)),"hour":parseInt((d[i].date).substring(6)),"value":d[i].citys[citynum].avg});
		  }
          //return dataarray;
		  //return {
          //  day: +parseInt((d.date).substring(0,5)),
          //  hour: +parseInt((d.date).substring(6)),
          //  value: +d.citys[0].avg
          //};
        //},
        //function(error, dataarray) {
        //  var colorScale = d3.scale.quantile()
        //      .domain([0, buckets - 1, d3.max(dataarray, function (d) { return d.value; })])
        //      .range(colors);
			  
		  var colorScale = d3.scale.threshold()
              .domain([50,100,150,200,300])// d3.max(dataarray, function (d) { return d.value; })])
              .range(colors);

          var cards = svg.selectAll(".hour")
              .data(dataarray, function(d) {
			  return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0])
			  .on("mouseover", function(d){
                              tooltip.html("Date:"+(d.day).toString()+"月"+(d.hour).toString()+"日"+" PM2.5:"+(d.value).toString())
                                    .style("left", (d3.event.pageX) + "px") 
                                    .style("top", (d3.event.pageY + 20) + "px")
                                    .style("opacity",1.0);
                          })
              .on("mousemove",function(d){  
                              tooltip.style("left", (d3.event.pageX) + "px")      
                                      .style("top", (d3.event.pageY + 20) + "px");
                              })
              .on("mouseout",function(){
                              tooltip.style("opacity",0);
                          })
			  .on("click",function(d){
				var dataarray1=[];
				for(var i=0;i<365;i++){
					if(parseInt((data0[i].date).substring(4,6))==d.day){
						for(var j=0;j<24;++j){
							dataarray1.push({"day":parseInt((data0[i].date).substring(6)),"hour":j.toString(),"value":data0[i].citys[citynum].hours[j]});
						}
					}
				}
				var svg1=hourheatmap(dataarray1,svg2,xingqi.slice(0,yuefen[d.day-1]),hours);
				svg1.transition().duration(250).style("opacity",1.0);
			  });

          cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = svg.selectAll(".legend")
				.data([0].concat([50,100,150,200,300]), function(d) { return d; });
              //.data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return   Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize+5);

          legend.exit().remove();
		  
        });  
      };

      heatmapChart("./data/daydata.json",0);
      function hourheatmap(dataarray,svg0,xingqi,hours){
		  document.querySelector('#hourheatmap').innerHTML = '';
	  var svg1=svg0.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  .style("opacity",0.0);

      var dayLabels = svg1.selectAll(".dayLabel")
          .data(xingqi)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 7) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = svg1.selectAll(".timeLabel")
          .data(hours)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 0 && i <= 24) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
  
		  var colorScale = d3.scale.threshold()
              .domain([50,100,150,200,300])// d3.max(dataarray, function (d) { return d.value; })])
              .range(colors);

          var cards = svg1.selectAll(".hour")
              .data(dataarray, function(d) {
			  return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize+20; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0])
			  .on("mouseover", function(d){
                              tooltip.html("Date:"+(d.day).toString()+"日"+(d.hour).toString()+"时"+" PM2.5:"+(d.value).toString())
                                    .style("left", (d3.event.pageX) + "px") 
                                    .style("top", (d3.event.pageY + 20) + "px")
                                    .style("opacity",1.0);
                          })
              .on("mousemove",function(d){  
                              tooltip.style("left", (d3.event.pageX) + "px")      
                                      .style("top", (d3.event.pageY + 20) + "px");
                              })
              .on("mouseout",function(){
                              tooltip.style("opacity",0);
                          })
			  .on("click",function(d){
				svg1.transition().duration(250).style("opacity",0.5);
				
			  });

          cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = svg1.selectAll(".legend")
				.data([0].concat([50,100,150,200,300]), function(d) { return d; });
              //.data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height+350)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height +350+ gridSize+5);

          legend.exit().remove();
		  return svg1;
		} 