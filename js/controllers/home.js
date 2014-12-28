'use strict';

portal
  .controller('HomeCtrl', function($scope, $rootScope, $location, $routeParams, $filter, YahooService, history) {
    $scope.ys = YahooService;

    //_log("YahooService.indeces", YahooService.indeces)

    var chartData = YahooService.indeces.map(function(val) {
      return val.data[0];
    });
    drawLineChart(chartData)

    $scope.filter = function(o) {
      $(event.currentTarget).parent('li').addClass("active").siblings("li").removeClass("active");
      var filteredData = $.extend(true, [], chartData);

      filteredData.forEach(function(el, i) {
        el.values = el.values.filter(function(ind) {
          var interval = 0;
          switch (o.interval) {
            case "month":
              interval = 2592000000;
              break;
            case "week":
              interval = 604800000;
              break;
            case "day":
              interval = 86400000;
              break;
            case "year":
              interval = 31560000000;
          }
          var now = new Date().getTime();
          var indTime = new Date(ind[0]).getTime();
          return (indTime >= now - interval);
        })

        var endVal = el.values[0][1];
        var startVal = el.values[el.values.length - 1][1];
        var delta = (((endVal - startVal) / startVal) * 100).toFixed(2);
        YahooService.indeces[i].delta = delta;
      })

      drawLineChart(filteredData)
    }


    function drawLineChart(data) {
      $scope.barchart = false;
      $scope.linechart = true;
      nv.addGraph(function() {
        var chart = nv.models.lineChart()
          .x(function(d) {
            return d[0]
          })
          .y(function(d) {
            return d[1]
          })
          .color(d3.scale.category10().range())
          //.useInteractiveGuideline(true)
        ;

        chart.xAxis
          .tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d))
          });
        d3.select('#chart svg')
          .datum(data)
          .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
      });
    }


    function drawBarChart(data) {
      $scope.barchart = true;
      $scope.linechart = false;

      nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
          .x(function(d) {
            return d.label
          }) //Specify the data accessors.
          .y(function(d) {
            return d.value
          })
          .staggerLabels(true) //Too many bars and not enough room? Try staggering labels.
          .tooltips(false) //Don't show tooltips
          .showValues(true) //...instead, show the bar value right on top of each bar.
          .transitionDuration(350);


        d3.select('#barchart svg')
          .datum(data)
          .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });
    }

    $scope.showStream = function() {
      _log("TODO")
    }


    $scope.getQuotes = function(e) {
      $(event.currentTarget).parent('li').addClass("active").siblings("li").removeClass("active");

      var symbols = YahooService.indeces.map(function(i) {
        return i.symbol;
      })
      var options = {
        "symbol": symbols.join(",")
      }


      YahooService.getQuotes(options).then(function(res) {
        var arr = res.data.query.results.quote;
        YahooService.today = [{
          "key": "barchart",
          "values": []
        }]
        arr.map(function(i, idx) {
          YahooService.indeces[idx].delta = parseFloat(i.Change.replace(/[-+]/, '')).toFixed(2);
          YahooService.today[0].values.push({
            "label": i.Name,
            "value": i.LastTradePriceOnly
          });
        })
        drawBarChart(YahooService.today);
      })
    }
    $scope.getQuote = function(symbol, e) {
      var options = {
        "symbol": symbol
      }
      YahooService.getQuotes(options).then(function(res) {
        $scope.quote = res.data.query.results.quote;
        var panel = $(e.currentTarget);
        panel.addClass('flip open');
        panel.on('mouseleave', function() {
          $('.open').each(function() {
            $(this).removeClass('open flip');
          });
        });
        $('.back').on('click', function(e) {
          e.stopPropagation();
        });
      })
    }

  });