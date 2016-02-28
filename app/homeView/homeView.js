'use strict';

angular.module('photo-gallery.homeView', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'homeView/homeView.html',
    controller: 'homeViewCtrl'
  });
}])

.controller('homeViewCtrl', ['$scope', 'albumFactory', '$window',
function($scope, albumFactory, $window) {
  var page = 0, endReached = false;
  $scope.fetching = false;
  $scope.albums = [];
  $scope.pageTitle = 'Albums récents';

  $scope.loadAlbums = function() {
    if (endReached || $scope.fetching) {
      return;
    }

    page += 1;
    $scope.fetching = true;
    albumFactory.fetchPage(page).then(function(a) {
      for (var i = 0; i < a.length; ++i) {
        $scope.albums.push(a[i]);
      }
    }).catch(function(response) {
      if (response.status == 404) {
        endReached = true;
      } else {
        $scope.message = 'Impossible de charger les albums depuis le serveur.';
      }
    }).finally(function() {
      $scope.fetching = false;
    });
  };

  $scope.loadAlbums();

  // Adapted from http://blog.sodhanalibrary.com/2015/02/detect-when-user-scrolls-to-bottom-of.html
  function onEndReached() {
    if (endReached || $scope.fetching) {
      return;
    }
    var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    var body = document.body, html = document.documentElement;
    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight,
      html.offsetHeight);
    var windowBottom = windowHeight + window.pageYOffset + 250;
    if (windowBottom >= docHeight) {
      $scope.loadAlbums();
    }
  }

  angular.element($window).on('scroll', onEndReached);

  $scope.$on('$stateChangeStart', function() {
    angular.element($window).off('scroll', onEndReached);
  });
}]);
