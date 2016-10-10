'use strict';

angular.module('photo-gallery.photoDetail', ['ui.bootstrap'])

.directive('photoDetail', ['$window', '$timeout', '$uibModal', function($window, $timeout, $uibModal) {
  return {
    templateUrl: 'directives/photoDetail.html',
    restrict: 'E',
    scope: {
      photo: '=',
      isAuthor: '=',
      prev: '&prev',
      next: '&next',
      makeUrl: '&makeUrl',
      deletePhoto: '&deletePhoto'
    },
    link: function($scope, elem, attrs) {
      $scope.$watch('photo', function() {
        $scope.loading = true;
      });

      function changePhoto(direction) {
        $timeout(function() {
          if (direction == 'next') {
            $scope.next();
          } else if (direction == 'prev') {
            $scope.prev();
          }
        });
      }

      $scope.nextPhoto = function() {
        changePhoto('next');
      };

      $scope.previousPhoto = function() {
        changePhoto('prev');
      };

      $scope.openModal = function() {
        var modal = $uibModal.open({
          controller: 'PhotoModalCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'directives/photoDetailModal.html',
          resolve: {
            photo: function() {
              return $scope.photo;
            },
            canDelete: function() {
              return $scope.isAuthor;
            }
          }
        });

        modal.result.then(function() {
          $scope.deletePhoto({photo: $scope.photo});
          $scope.photo = null;
        });
      };

      function setFrameSize() {
        var frame = $('#photoFrame');
        var photo = $('#detailedPhoto');
        var centered = $('#centeredContent');

        // Fit screen width if necessary
        frame.width('auto');
        var frameOuterWidth = frame.outerWidth(true);
        var frameWidth = frame.width();
        var paddingWidth = frameOuterWidth - frameWidth;
        var windowWidth = $(window).width();
        if (frameOuterWidth > windowWidth) {
          // Hide vertical frame side if photo is larger than screen
          frame.css('padding', '10px 0px');
          frame.width(windowWidth);
        }

        // Fit screen height if necessary
        frame.height('auto');
        photo.height('auto');
        var buttonHeight = $('#closeDetailButton').outerHeight(true);
        var centeredOuterHeight = centered.outerHeight(true);
        var frameHeight = frame.height();
        var paddingHeight = centeredOuterHeight - frameHeight;
        var windowHeight = $(window).height();
        if (centeredOuterHeight > windowHeight) {
          photo.height(windowHeight - paddingHeight - 2 * buttonHeight);
          photo.width('auto');
          frame.width('auto');
          // Show vertical frame side if vertical resizing reduced image width
          if (photo.width() < windowWidth - paddingWidth) {
            frame.css('padding', '10px');
          }
        }
      }

      function onKeyPressed(e) {
        $timeout(function() {
          if ($scope.photo) {
            if (e.keyCode == 39) {
              changePhoto('next');
            } else if (e.keyCode == 37) {
              changePhoto('prev');
            } else if (e.keyCode == 27) {
              $scope.photo = null;
            } else {
              return;
            }
          }
        });
      }

      function onImgLoad() {
        $scope.loading = false;
        $('#detailedPhoto').fadeIn();
        $scope.$apply();
        setFrameSize();
      }

      // Register event callbacks
      var photo = $('#detailedPhoto');
      angular.element($window).on('resize', setFrameSize);
      photo.on('load', onImgLoad);
      photo.on('dragstart', function(e) { e.preventDefault(); });
      photo.on('swipeleft', function() { changePhoto('next'); });
      photo.on('swiperight', function() { changePhoto('prev'); });
      angular.element($window).on('keydown', onKeyPressed);

      elem.on('$destroy', function() {
        angular.element($window).off('resize', setFrameSize);
        photo.off('load');
        photo.off('swipeleft');
        photo.off('swiperight');
        angular.element($window).off('keydown', onKeyPressed);
      });
    }
  };
}])

.controller('PhotoModalCtrl', ['$uibModalInstance', 'photo', 'canDelete',
function ($uibModalInstance, photo, canDelete, deletePhoto) {
  var $ctrl = this;
  $ctrl.canDelete = canDelete;
  $ctrl.photo = photo;

  $ctrl.downloadPhoto = function() {
    var link = document.createElement('a');
    link.href = $('#detailedPhoto').attr('src');
    link.download = '';
    document.body.appendChild(link);
    link.click();
  };

  $ctrl.delete = function() {
    $uibModalInstance.close();
  };

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
