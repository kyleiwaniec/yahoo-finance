'use strict';

angular.module('SnapPlayPortalApp')
  .directive('albumcovergrid', function (EnvService) {
    return {
      restrict: 'E',
      scope: {
        albums: '=albums'
      },
      templateUrl : '/views/play/partials/albumCoverGrid.html',
      controller: function ($scope, EnvService) {
        $scope.albumImages = [];
        $scope.env = EnvService;
        $scope.imageSizes = 140;

        $scope.$watch('albums', function() {
          $scope.albumImages = [];
          angular.forEach($scope.albums, function(album) {
            
            if(album.image_url && $scope.albumImages.length < 4) {
              if ($scope.albumImages.indexOf(album.image_url) == -1) {
                $scope.albumImages.push(album.image_url);
              }
            }
            
          });
          if($scope.albumImages.length == 2){
            $scope.albumImages.splice(1, 0, "placeholder");
            $scope.albumImages.splice(2, 0, "placeholder");
          }else if($scope.albumImages.length == 3){
            $scope.albumImages[3] = "placeholder";
          }          
        });
      }
    }
  });
