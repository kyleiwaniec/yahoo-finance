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
      {symbol:"^NDX",name:"NASDAQ-100"}, 
      //{symbol:"^OEX",name:"S&P 100 "},
      {symbol:"^MID",name:"S&P MID CAP 400"},
      {symbol:"^IXIC",name:"NASDAQ Composite"},
      {symbol:"^XAX",name:"NYSE AMEX COMPOSITE"},
      //{symbol:"^DJT",name:"Dow Jones Transportation Average"},
      //{symbol:"^DJA",name:"Dow Jones Composite Average"},
      {symbol:"^RUT",name:"Russell 2000"}
      //{symbol:"^RUI",name:"Russell 1000"},
      //{symbol:"^NYA",name:"NYSE COMPOSITE (DJ)"}
    ];

    yql.getData = function (options) {
      var symbol = options.symbol;
      var startDate = options.endDate;
      var endDate = options.startDate;
      var table = options.table;
      var query = "select * from yahoo.finance."+table+" where symbol = '"+symbol+"' and startDate = '"+startDate+"' and endDate = '"+endDate+"'";
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


