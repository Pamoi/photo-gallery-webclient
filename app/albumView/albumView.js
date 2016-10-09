'use strict';

angular.module('photo-gallery.albumView', ['ui.router', 'ui.bootstrap', 'photo-gallery.albumFactory'])

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

.controller('albumViewCtrl', ['$scope', '$state', '$stateParams', '$window', '$uibModal', 'albumFactory', 'backendUrl',
function($scope, $state, $stateParams, $window, $uibModal, albumFactory, backendUrl) {
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

  $scope.deleteComment = function(comment) {
    albumFactory.deleteComment($scope.album.id, comment.id).then(function() {
      var index = $scope.album.comments.indexOf(comment);
      if (index > -1) {
        $scope.album.comments.splice(index, 1);
      }
    });
  };

  $scope.deletePhoto = function(photo) {
    albumFactory.deletePhoto(photo.id).then(function() {
      var index = $scope.album.photos.indexOf(photo);
      if (index > -1) {
        $scope.album.photos.splice(index, 1);
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
    var modal = $uibModal.open({
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      templateUrl: 'albumView/modal.html',
      resolve: {
        albumId: function() {
          return $scope.album.id;
        }
      }
    });

    modal.result.then(function() {
      $state.go('home');
    });
  };

  $scope.downloadAlbum = function() {
    albumFactory.getDownloadToken($scope.album.id).then(function(token) {
      var link = document.createElement('a');
      link.href = backendUrl + '/album/' + $scope.album.id + '/download?token=' + token;
      document.body.appendChild(link);
      link.click();
    });
  }
}])

.controller('ModalInstanceCtrl', ['$uibModalInstance', 'albumFactory', 'albumId',
function ($uibModalInstance, albumFactory, albumId) {
  var $ctrl = this;
  $ctrl.text = 'Toutes les photos seront définitivement supprimées.';

  $ctrl.delete = function () {
    albumFactory.deleteAlbum(albumId).then(function() {
      $uibModalInstance.close();
    }).catch(function() {
      $ctrl.text = 'Erreur lors de la suppression de l\'album.';
    });
  };

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
}]);
