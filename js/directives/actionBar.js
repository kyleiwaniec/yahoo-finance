'use strict';

angular.module('SnapPlayPortalApp')
  .directive('actionbar', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'A',
      templateUrl : '/views/play/partials/actionBar.html',
      controller: function ($scope, $location, PlaylistService) {
        $scope.location = $location;
        $scope.ps = PlaylistService;
      },
      link: function($scope, element, attrs) {
        $("body").on('click touchstart', ".list-view .opens-action-bar", function(event) {
          if($scope.location.path().indexOf('songs') > -1) {
            $scope.showDownload = true;
          } else {
            $scope.showDownload = false;
          }

		  if(($scope.location.path().indexOf('albums') > -1) || ($scope.location.path().indexOf('artists') > -1)) {
            $scope.hideEdit = true;
          } else {
            $scope.hideEdit = false;
          }

          if($scope.location.path().indexOf('playlists') > -1) {
            $scope.hidePlaylist = true;
            $scope.hideEdit = true;
          } else {
            $scope.hidePlaylist = false;
          }

          if($scope.location.path().indexOf('playlist/') > -1) {
            $scope.showRemove = true;
          } else {
            $scope.showRemove = false;
          }

          $('.cell').removeClass('highlight');
          $(this).addClass('highlight');
          $(".action-bar").addClass("open");
        });

        $("body").on("click touchend", ".action-bar .close, .grid-view-btn", function(e){
          e.stopPropagation();
          $('.opens-action-bar').removeClass('highlight');
          $(".action-bar").removeClass("open");
          return false;
        });

        // Close actionbar on route change if that's opened already
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
          if ($('.action-bar').hasClass('open')) {
            $('.opens-action-bar.highlight').removeClass('highlight');
            $('.action-bar.open').removeClass('open');
          }
        });
      }
    }
  }]);
