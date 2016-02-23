'use strict';

angular.module('photo-gallery.albumView', ['ui.router', 'photo-gallery.albumFactory'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('albumDetail', {
    url: '/album/:id',
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

  $scope.makeThumbnailUrl = function(id) {
    return backendUrl + '/photo/' + id + '/thumb';
  };

  $scope.makeResizedUrl = function(id) {
    if (typeof id != "number") {
      return null;
    }
    return backendUrl + '/photo/' + id + '/resized';
  };

  $scope.deleteComment = function(comment) {
    albumFactory.deleteComment($scope.album.id, comment.id).then(function() {
      var index = $scope.album.comments.indexOf(comment);
      if (index > -1) {
        $scope.album.comments.splice(index, 1);
      }
    });
  };

  // Responsive layout callbacks
  function setContainerWidth() {
      // Adapted from http://stackoverflow.com/questions/19527104/left-aligned-last-row-in-centered-grid-of-elements
      $('.thumbnail-container').css('width', 'auto');
      var windowWidth = $('.container').width();
      var blockWidth = 210;
      var maxBoxPerRow = Math.floor(windowWidth / blockWidth);
      $('.thumbnail-container').width(maxBoxPerRow * blockWidth);
  }

  function setPhotoSize() {
    // Check width
    $('.overlay-img').width('auto');
    var imgWidth = $('.overlay-img').width();
    var windowWidth = $(window).width();
    if (imgWidth > windowWidth - 20) {
      $('.overlay-img').width(windowWidth - 20);
    }

    // Check height
    $('.overlay-img').height('auto');
    var imgHeight = $('.overlay-img').height();
    var windowHeight = $(window).height();
    if (imgHeight > windowHeight - 60) {
      $('.overlay-img').height(windowHeight - 60);
    }
  }

  // Binding callbacks
  $scope.$on('$viewContentLoaded', setContainerWidth);
  $('.overlay-img').bind('load', setPhotoSize);
  angular.element($window).bind('resize', setContainerWidth);
  angular.element($window).bind('resize', setPhotoSize);

  // Binding key events
  angular.element($window).on('keydown', function(e) {
    if ($scope.detailedPhoto) {
      if (e.keyCode == 39) {
        $scope.nextPhoto();
      } else if (e.keyCode == 37) {
        $scope.previousPhoto();
      } else if (e.keyCode == 27) {
        $scope.detailedPhoto = null;
      }
      $scope.$apply();
    }
  });
}]);
