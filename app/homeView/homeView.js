'use strict';

angular.module('photo-gallery.homeView', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'homeView/homeView.html',
    controller: 'homeViewCtrl'
  });
}])

.controller('homeViewCtrl', ['$scope', 'albumFactory', 'backendUrl', '$window',
function($scope, albumFactory, backendUrl, $window) {
  var page = 0, endReached = false, fetching = false;
  $scope.albums = [];

  $scope.loadAlbums = function() {
    if (endReached || fetching) {
      return;
    }

    page += 1;
    fetching = true;
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
      fetching = false;
    });
  };

  $scope.makePhotoUrl = function(id) {
    if (id) {
      return backendUrl + '/photo/' + id + '/thumb';
    } else {
      return null;
    }
  };

  $scope.loadAlbums();

  // Load more albums when bottom of page is reached
  // Adapted from http://blog.sodhanalibrary.com/2015/02/detect-when-user-scrolls-to-bottom-of.html
  angular.element($window).bind("scroll", function() {
    if (endReached || fetching) {
      return;
    }
    var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    var body = document.body, html = document.documentElement;
    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight,
      html.offsetHeight);
    var windowBottom = windowHeight + window.pageYOffset + 50;
    if (windowBottom >= docHeight) {
      $scope.loadAlbums();
    }
  });
}]);
