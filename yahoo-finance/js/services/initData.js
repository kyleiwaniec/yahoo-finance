portal
  .factory("InitialData", function(YahooService, $q) {
    return function() {
      var requests = [];

      // because doing one request exceeds yahoo's limit
      for (var i = 0; i < YahooService.indeces.length; i++) {
        requests[i] = YahooService.getAllData(YahooService.indeces[i].symbol)
      }

      function parseResults(history) {
        //_log("history", history)
        for (var i = 0; i < history.length; i++) {
          if(history[i].data.query.results != null){
            var arr = history[i].data.query.results.quote;
            var index = YahooService.indeces[i];
            index.endVal = arr[0].Close;
            index.startVal = arr[arr.length - 1].Close;
            index.delta = (((index.endVal - index.startVal) / index.startVal) * 100).toFixed(2)

            var values = arr.map(function(item) {
              return [new Date(item.Date), item.Close];
            })

            YahooService.indeces[i].delta = index.delta;

            YahooService.indeces[i].data.push({
              "key": index.name,
              "values": values
            });
          }
          

        }
        return history;
      }

      return $q.all(requests).then(function(results) {
        return {
          requests: parseResults(results)
        };
      });
    }
  });