'use strict';

portal
  .service('YahooService', ['$http', function YahooService($http) {
    var yql = this;

    yql.periodData = {
      year:{
        graphData : [],
        deltas : {}
      }
    };


    yql.indeces = [
      {symbol:"^NDX",name:"NASDAQ-100",data:[],delta:0}, 
      //{symbol:"^OEX",name:"S&P 100 ",data:[]},
      {symbol:"^MID",name:"S&P MID CAP 400",data:[],delta:0},
      {symbol:"^IXIC",name:"NASDAQ Composite",data:[],delta:0},
      {symbol:"^XAX",name:"NYSE AMEX COMPOSITE",data:[],delta:0},
      //{symbol:"^DJT",name:"Dow Jones Transportation Average",data:[]},
      //{symbol:"^DJA",name:"Dow Jones Composite Average",data:[]},
      {symbol:"^RUT",name:"Russell 2000",data:[],delta:0}
      //{symbol:"^RUI",name:"Russell 1000",data:[]},
      //{symbol:"^NYA",name:"NYSE COMPOSITE (DJ)",data:[]}
    ];





    yql.getAllData = function(symbol){
        var now = new Date();
        var yearAgo = now.setFullYear(now.getFullYear() - 1);
        var format = d3.time.format("%Y-%m-%d");

        var startDate = format(new Date(yearAgo));
        var endDate = format(new Date());
        var query = "select * from yahoo.finance.historicaldata where symbol = '"+symbol+"' and startDate = '"+startDate+"' and endDate = '"+endDate+"'";
        var params = {
          q : query,
          format : "json",
          diagnostics : true,
          env : "http://datatables.org/alltables.env"
        }
        return $http.get('http://query.yahooapis.com/v1/public/yql', {params: params})
    }




    yql.getQuotes = function(options){
      var symbol = options.symbol;
      var query = 'select * from yahoo.finance.quote where symbol in ("'+symbol+'")';
      var params = {
        q : query,
        format : "json",
        diagnostics : true,
        env : "http://datatables.org/alltables.env"
      }
      return $http.get('http://query.yahooapis.com/v1/public/yql', {params: params})
    }




  }]);


