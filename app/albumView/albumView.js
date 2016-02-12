'use strict';

angular.module('photo-gallery.albumView', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('albumDetail', {
    url: '/album/:id/:name',
    templateUrl: 'albumView/albumView.html',
    controller: 'albumViewCtrl'
  });
}])

.controller('albumViewCtrl', ['$scope', function($scope) {
  $scope.album = {
    title: 'Album title'
  };
}]);
