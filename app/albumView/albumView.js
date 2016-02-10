'use strict';

angular.module('photo-gallery.albumView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/album/:id/:name', {
    templateUrl: 'albumView/albumView.html',
    controller: 'albumViewCtrl'
  });
}])

.controller('albumViewCtrl', ['$scope', function($scope) {
  $scope.album = {
    title: 'Album title'
  };
}]);
