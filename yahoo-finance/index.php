<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" ng-app="mdl"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"  ng-app="mdl"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <link rel="stylesheet" href="/yahoo-finance/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/yahoo-finance/css/main.css">
    <link rel="stylesheet" href="/yahoo-finance/css/card-flip-flex.css">
    <link rel="stylesheet" href="/yahoo-finance/bower_components/nvd3/nv.d3.min.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    
    <script>DEBUGMODE = true;</script>

</head>
  <body>
    <!--[if lt IE 8]>
      <p class="chromeframe">You are using an outdated browser.  Please upgrade to a newer version of IE or install Chrome, Safari, or Firefox.</p>
    <![endif]-->

    <!--[if lt IE 9]>
      <script src="bower_components/es5-shim/es5-shim.js"></script>
      <script src="bower_components/json3/lib/json3.min.js"></script>
      <script>
            document.createElement('ng-include');
            document.createElement('ng-pluralize');
            document.createElement('ng-view');

            // Optionally these for CSS
            document.createElement('ng:include');
            document.createElement('ng:pluralize');
            document.createElement('ng:view');
        </script>
        <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Add your site or application content here -->
    <div ng-include src="'/yahoo-finance/views/header.html'"></div>
    <div class="wrapper max-width">
        
        <div ng-view=""></div>
        <div class="push"></div>
    </div>
    <footer ng-include src="'/yahoo-finance/views/footer.html'" class="max-width"></footer>

    <script src="/yahoo-finance/js/utils/log-stacktrace.js"></script>
    <script src="/yahoo-finance/bower_components/angular/angular.js"></script>
    <script src="/yahoo-finance/bower_components/angular-route/angular-route.js"></script>
    <script src="/yahoo-finance/bower_components/angular-resource/angular-resource.js"></script>
    <script src="/yahoo-finance/bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="/yahoo-finance/bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="/yahoo-finance/bower_components/angular-touch/angular-touch.js"></script>
    <script src="/yahoo-finance/bower_components/d3/d3.min.js"></script>
    <script src="/yahoo-finance/bower_components/nvd3/nv.d3.min.js"></script>
    <script src="/yahoo-finance/bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.min.js"></script>
    <script src="/yahoo-finance/js/init.js"></script>
    <script src="/yahoo-finance/js/controllers/home.js"></script>
    <script src="/yahoo-finance/js/services/initData.js"></script>
    <script src="/yahoo-finance/js/services/yahoo.js"></script>
    <script src="/yahoo-finance/js/main.js"></script>
  </body>
</html>
