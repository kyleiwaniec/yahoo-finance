<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" ng-app="mdl"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"  ng-app="mdl"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title ng-bind="pageTitle"></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <link rel="stylesheet" href="/css/main.css">
    <script src="/js/main.js"></script>
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

    <div class="wrapper">
        <div ng-include src="'/views/partials/header.html'"></div>
        <div ng-view=""></div>
        <div class="push"></div>
    </div>
    <div ng-include src="'/views/partials/footer.html'"></div>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js"></script>
  </body>
</html>
