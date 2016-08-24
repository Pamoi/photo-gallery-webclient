'use strict';

angular.module('photo-gallery.homeView', ['ui.router', 'photo-gallery.albumFactory'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'homeView/homeView.html',
    controller: 'homeViewCtrl'
  });
}])

.controller('homeViewCtrl', ['$scope', 'albumFactory', '$window',
function($scope, albumFactory, $window) {
  function randomIndex(maxIndex) {
    // return a random number between 0 and maxIndex (exclusive)
    return Math.floor(Math.random() * maxIndex);
  }

  function selectCoverPhotos(album) {
    if (!album.photos) {
      return album;
    }

    if (album.photos.length <= 4) {
      album.coverPhotos = album.photos;
    } else {
      var photos = angular.copy(album.photos);
      album.coverPhotos = [];

      for (var i = 0; i < 4; i++) {
        var index = randomIndex(photos.length);
        album.coverPhotos.push(photos[index]);
        photos.splice(index, 1);
      }
    }

    return album;
  }

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
        $scope.albums.push(selectCoverPhotos(a[i]));
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
