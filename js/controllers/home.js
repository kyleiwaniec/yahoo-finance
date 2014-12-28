'use strict';

portal
  .controller('HomeCtrl', function ($scope, $rootScope, $location, $routeParams, $filter, YahooService) {
   	$scope.ys = YahooService;
   	var _graphData = [];

    function fetchHistoricalData(index, vars) {
    	vars = vars || {period:"year"};
    	var now = new Date();
    	var yearAgo = now.setFullYear(now.getFullYear() - 1);
    	var format = d3.time.format("%Y-%m-%d");

    	if(vars.period == "month"){
    		var now = new Date();
    		var monthAgo = now.setMonth(now.getMonth() - 1);
    		vars.startDate = format(new Date());
    		vars.endDate = format(new Date(monthAgo));
    	}
    	if(vars.period == "week"){
    		var now = new Date();
    		var weekAgo = now.setDate(now.getDate()-7);
    		vars.startDate = format(new Date());
    		vars.endDate = format(new Date(weekAgo));
    	}
    	if(vars.period == "day"){
    		var now = new Date();
    		var dayAgo = now.setDate(now.getDate()-1);
    		vars.startDate = format(new Date());
    		vars.endDate = format(new Date(dayAgo));
    	}
    	var options = {
    		symbol : index.symbol,
      		startDate : vars.startDate || format(new Date()),
      		endDate : vars.endDate || format(new Date(yearAgo)),
      		table : "historicaldata"
    	}
      return YahooService.getData(options)
        .then(function (response){
  			if(response.data.query.results != null){
  				var arr = response.data.query.results.quote;
  				index.endVal = arr[0].Close;
  				index.startVal = arr[arr.length-1].Close;
  				index.delta = (((index.endVal - index.startVal)/index.startVal)*100).toFixed(2)
	  			var values = arr.map(function(i){
	  				return [new Date(i.Date), i.Close];
	  			})
	  			YahooService.periodData[vars.period].deltas[index.symbol] = index.delta;
			  	YahooService.periodData[vars.period].graphData.push({
			 		"key": index.name,
			        "values": values
			    });
			    console.log(YahooService.periodData[vars.period].graphData);
	     	  	drawLineChart(YahooService.periodData[vars.period].graphData);
  			}

        });
    }


    function drawLineChart(data){
    	nv.addGraph(function() {
		    var chart = nv.models.lineChart()
		                  .x(function(d) { return d[0] })
		                  .y(function(d) { return d[1]})
		                  //.color(d3.scale.category10().range())
		                  //.useInteractiveGuideline(true)
		                  ;

		     chart.xAxis
		        .tickFormat(function(d) {
		            return d3.time.format('%x')(new Date(d))
		          });
		    $('#chart svg').remove();
		    $('#chart').append('<svg style="height:500px">');
		    d3.select('#chart svg')
		        .datum(data)
		        .call(chart);

		    nv.utils.windowResize(chart.update);
		    return chart;
	  	});
    }
    function drawBarChart(data){
    	nv.addGraph(function() {
		    var chart = nv.models.discreteBarChart()
		      .x(function(d) { return d.label })    //Specify the data accessors.
		      .y(function(d) { return d.value })
		      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
		      .tooltips(true)        //Don't show tooltips
		      .showValues(true)       //...instead, show the bar value right on top of each bar.
		      .transitionDuration(350)
		      ;

		    $('#chart svg').remove();
		    $('#chart').append('<svg style="height:500px">');
		    d3.select('#chart svg')
		        .datum(data)
		        .call(chart);

		    nv.utils.windowResize(chart.update);

		    return chart;
		});

    }
    $scope.getHistoricalData = function(o){
    	if(o){
    		$(event.currentTarget).parent('li').addClass("active").siblings("li").removeClass("active");
    		//use cached data if exists
    		$scope.period = o.period;
    		if(YahooService.periodData[o.period] && YahooService.periodData[o.period].graphData){
    			drawLineChart(YahooService.periodData[o.period].graphData);

    		}else{
    			YahooService.periodData[o.period] = {
    				graphData : [],
    				deltas : {}
    			};	
	    		for(var i = 0; i < YahooService.indeces.length; i++){
			    	fetchHistoricalData(YahooService.indeces[i], o);
			    }
    		}
    	}else{
    		$scope.period = "year";
    		YahooService.periodData["year"].graphData = [];
    		for(var i = 0; i < YahooService.indeces.length; i++){
		    	fetchHistoricalData(YahooService.indeces[i], o);
		    }
    	}

    	
    }

    $scope.getHistoricalData();

    $scope.getQuotes = function(e){
    	$(event.currentTarget).parent('li').addClass("active").siblings("li").removeClass("active");

    	var symbols = YahooService.indeces.map(function(i){
    		return i.symbol;
    	})
    	var options = {"symbol":symbols.join(",")}

    	
    	YahooService.getQuotes(options).then(function(res){
    		console.log(res.data.query.results.quote)

    		var arr = res.data.query.results.quote;

  			YahooService.periodData["today"] = {deltas:{}, graphData:[]};
  			YahooService.periodData["today"].graphData = [{"key": "barchart", "values": []}]
  			arr.map(function(i){
  				YahooService.periodData["today"].deltas[i.symbol] = i.Change;
  				YahooService.periodData["today"].graphData[0].values.push({
			 		"label":i.Name, "value":i.LastTradePriceOnly
			    });
  			})
  			console.log(YahooService.periodData["today"].graphData)
  			drawBarChart(YahooService.periodData["today"].graphData);

    	})
    }
    $scope.getQuote = function(symbol, e){
    	var options = {"symbol":symbol}
    	YahooService.getQuotes(options).then(function(res){
    		$scope.quote = res.data.query.results.quote;
    		var panel = $(e.currentTarget);
		        panel.addClass('flip open');
		        panel.on('mouseleave', function(){
		            $('.open').each(function(){
		                $(this).removeClass('open flip');
		            });
	        	});
	        $('.back').on('click', function(e){
	            e.stopPropagation();
	        });
    	})
    }

});
