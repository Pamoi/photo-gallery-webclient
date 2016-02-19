'use strict';

angular.module('photo-gallery.homeView', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'homeView/homeView.html',
    controller: 'homeViewCtrl'
  });
}])

.controller('homeViewCtrl', ['$scope', 'albumFactory', 'backendUrl', function($scope, albumFactory, backendUrl) {
  albumFactory.fetchPage(1).then(function(albums) {
    $scope.albums = albums;
  }).catch(function() {
    $scope.message = 'Impossible de charger les albums depuis le serveur.';
  });

  $scope.makePhotoUrl = function(id) {
    return backendUrl + '/photo/' + id + '/thumb';
  };
}]);
