'use strict';

portal
  .controller('HomeCtrl', function ($scope, $rootScope, $location, $routeParams, $filter, YahooService, history) {
   	$scope.ys = YahooService;
   	var _graphData = [];
   
   
    _log("YahooService.indeces", YahooService.indeces)



    // for(var i = 0; i < YahooService.indeces.length; i++){
    //   var idx = YahooService.indeces[i].data;
    //   drawLineChart(idx);
    // }

    var chartData = YahooService.indeces.reduce(function(a, b) {
      _log("a,b", a,b)
      return a.concat(b);
    });

    drawLineChart(chartData)

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
		    // $('#chart svg').remove();
		    // $('#chart').append('<svg style="height:500px">');
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
