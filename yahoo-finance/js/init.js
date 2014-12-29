//Init.js
//Initialization functions, separated from app.js to help with unit testing.
'use strict';

var portal = angular.module('mdl', [
  'ngRoute', 
  'ngResource', 
  'ngTouch', 
  'ngCookies', 
  'ngSanitize',
  'nvd3ChartDirectives'
]);


portal
  .config(function ($routeProvider, $locationProvider, $httpProvider) { 
    $routeProvider
      .when('/', {
        templateUrl: '/yahoo-finance/views/home.html',
        controller: 'HomeCtrl',
        resolve: {
            history: function(InitialData){
                return InitialData();
            }
        }
      })
      .otherwise({
        redirectTo: '/'
      });

  })
  .run(function($rootScope, $route, $location, $document, $sce, $window,  $filter) {


    $rootScope.goTo = function(path) {
      $location.path(path);
    }

    
    $rootScope.globals = {
      year: (new Date()).getFullYear()
    };
   
});
