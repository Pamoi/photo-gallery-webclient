'use strict';

angular.module('photo-gallery.albumView', ['ui.router', 'photo-gallery.albumFactory'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('albumDetail', {
    url: '/album/:id/:name',
    templateUrl: 'albumView/albumView.html',
    controller: 'albumViewCtrl',
    params: {
      album: null
    }
  });
}])

.controller('albumViewCtrl', ['$scope', '$state', '$stateParams', '$window', 'albumFactory', 'backendUrl',
function($scope, $state, $stateParams, $window, albumFactory, backendUrl) {
  if ($stateParams.album) {
    $scope.album = $stateParams.album;
  } else {
    albumFactory.fetchAlbum($stateParams.id).then(function(a) {
      $scope.album = a;
    }).catch(function() {
      $scope.loadingError = true;
    });
  }

  $scope.detailedPhoto = null;

  $scope.downloadText = 'Télécharger';

  $scope.showPhotoDetails = function(photo) {
    $scope.detailedPhoto = photo;
  }

  $scope.nextPhoto = function() {
    var index = $scope.album.photos.indexOf($scope.detailedPhoto) + 1;
    if (index == $scope.album.photos.length) {
      index = 0;
    }
    $scope.detailedPhoto = $scope.album.photos[index];
  }

  $scope.previousPhoto = function() {
    var index = $scope.album.photos.indexOf($scope.detailedPhoto) - 1;
    if (index < 0) {
      index = $scope.album.photos.length - 1;
    }
    $scope.detailedPhoto = $scope.album.photos[index];
  }

  $scope.deleteComment = function(comment) {
    albumFactory.deleteComment($scope.album.id, comment.id).then(function() {
      var index = $scope.album.comments.indexOf(comment);
      if (index > -1) {
        $scope.album.comments.splice(index, 1);
      }
    });
  };

  $scope.isUserAuthor = function() {
    if (!$scope.user || !$scope.album || !$scope.album.authors) {
      return false;
    }

    return $scope.album.authors.filter(function(a) {
      return a.id == $scope.user.id;
    }).length > 0;
  };

  $scope.deleteAlbum = function() {
    albumFactory.deleteAlbum($scope.album.id).then(function() {
      $state.go('home');
    });
  };

  $scope.downloadAlbum = function() {
    $scope.downloadText = 'Téléchargement en cours...';

    albumFactory.downloadAlbum($scope.album.id).then(function(data) {
      var file = new Blob([ data ], {
        type : 'application/zip'
      });

      var fileURL = URL.createObjectURL(file);
      var link = document.createElement('a');
      link.href = fileURL;
      link.target = '_blank';
      link.download = 'album.zip';
      document.body.appendChild(link);
      link.click();

      $scope.downloadText = 'Télécharger';
    });
  }
}]);
