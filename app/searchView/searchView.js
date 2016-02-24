'use strict';

angular.module('photo-gallery.searchView', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('search', {
    url: '/search/:term',
    templateUrl: 'homeView/homeView.html',
    controller: 'searchViewCtrl'
  });
}])

.controller('searchViewCtrl', ['$scope', '$stateParams', 'albumFactory',
function($scope, $stateParams, albumFactory) {
  $scope.albums = [];
  $scope.pageTitle = 'Résultats pour "' + $stateParams.term + '"';

  $scope.fetching = true;
  albumFactory.searchAlbum($stateParams.term).then(function(list) {
    $scope.albums = list;
    if (list.length == 0) {
      $scope.message = 'Aucun résultat.';
    }
  }).catch(function(response) {
    $scope.message = 'Impossible de charger les albums depuis le serveur.';
  }).finally(function() {
    $scope.fetching = false;
  });
}]);
