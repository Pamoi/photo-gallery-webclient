'use strict';

angular.module('photo-gallery.photoDetail', ['ui.bootstrap'])

.directive('photoDetail', ['$window', '$timeout', '$uibModal', function($window, $timeout, $uibModal) {
  return {
    templateUrl: 'directives/photoDetail.html',
    restrict: 'E',
    scope: {
      photo: '=',
      prev: '&prev',
      next: '&next',
      makeUrl: '&makeUrl'
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
      }

      $scope.previousPhoto = function() {
        changePhoto('prev');
      }

      $scope.openModal = function() {
        var modal = $uibModal.open({
          controller: 'PhotoModalCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'directives/photoDetailModal.html',
          resolve: {
            photoId: function() {
              return $scope.photo.id;
            }
          }
        });
      }

      function setFrameSize() {
        var frame = $('#photoFrame');
        var photo = $('#detailedPhoto');
        var centered = $('#centeredContent');

        frame.width('auto');
        var frameOuterWidth = frame.outerWidth(true);
        var frameWidth = frame.width();
        var paddingWidth = frameOuterWidth - frameWidth;
        var windowWidth = $(window).width();
        if (frameOuterWidth > windowWidth) {
          frame.width(windowWidth - paddingWidth);
        }

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

.controller('PhotoModalCtrl', ['$uibModalInstance', 'photoId',
function ($uibModalInstance, photoId) {
  var $ctrl = this;
  $ctrl.pid = photoId;

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
}]);
