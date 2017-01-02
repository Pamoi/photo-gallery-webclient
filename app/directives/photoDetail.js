'use strict';

angular.module('photo-gallery.photoDetail', ['ngAnimate', 'ui.bootstrap'])

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
      $scope.$watch('photo', function(newValue, oldValue) {
        $scope.loading = true;
      });

      $scope.showBar = true;
      $scope.isShowRunning = false;

      $scope.nextPhoto = function() {
        $scope.stopShow();
        changePhoto('next');
      };

      $scope.previousPhoto = function() {
        $scope.stopShow();
        changePhoto('prev');
      };

      $scope.downloadPhoto = function() {
        var link = document.createElement('a');
        link.href = $('#detailedPhoto').attr('src');
        link.download = '';
        document.body.appendChild(link);
        link.click();
      };

      $scope.delete = function() {
        $scope.deletePhoto({photo: $scope.photo});
        $scope.photo = null;
      };

      $scope.close = function() {
        $scope.photo = null;
        $scope.stopShow();
      }

      var showPromise;

      function photoShow() {
        showPromise = $timeout(function() {
          changePhoto('next');
          photoShow();
        }, 5000);
      }

      $scope.startShow = function() {
        $scope.isShowRunning = true;
        photoShow();
      }

      $scope.stopShow = function() {
        $scope.isShowRunning = false;
        $timeout.cancel(showPromise);
      }

      function changePhoto(direction) {
        $timeout(function() {
          if (direction == 'next') {
            $scope.next();
          } else if (direction == 'prev') {
            $scope.prev();
          }

          $('#detailedPhoto').css('left', 0);
        });
      }

      function onKeyPressed(e) {
        $timeout(function() {
          if ($scope.photo) {
            if (e.keyCode == 39) {
              $scope.nextPhoto();
            } else if (e.keyCode == 37) {
              $scope.previousPhoto();
            } else if (e.keyCode == 27) {
              $scope.close();
            } else {
              return;
            }
          }
        });
      }

      function onImgLoad() {
        $scope.loading = false;
        $scope.$apply();
        $('#detailedPhoto').hide().fadeIn(700);
        //autoHideBar();
      }

      var timerPromise;

      function autoHideBar() {
        $timeout.cancel(timerPromise);
        timerPromise = $timeout(function() { $scope.showBar = false; }, 5000);
      }

      // Register event callbacks
      var photo = $('#detailedPhoto');
      var overlay = $('#overlay');
      photo.on('load', onImgLoad);
      photo.on('dragstart', function(e) { e.preventDefault(); });
      angular.element($window).on('keydown', onKeyPressed);

      elem.on('$destroy', function() {
        photo.off('load');
        photo.off('click');
        angular.element($window).off('keydown', onKeyPressed);
      });

      var xDragStart;
      var dragging = false;
      var mousedown = false;
      var dragLimitToChangePhoto = 70;

      photo.on('mousedown', function(e) {
        xDragStart = e.pageX;
        mousedown = true;
      });

      overlay.on('mousemove', function(e) {
        if (mousedown) {
          var dragLength = e.pageX - xDragStart;
          if (Math.abs(dragLength) > 10) {
            dragging = true;
          }
          photo.css('left', dragLength);
        }
      });

      overlay.on('mouseup', function(e) {
        mousedown = false;

        if (dragging) {
          dragging = false;
          var dragLength = e.pageX - xDragStart;

          if (dragLength < -dragLimitToChangePhoto) {
            changePhoto('next');
          } else if (dragLength > dragLimitToChangePhoto) {
            changePhoto('prev');
          } else {
            photo.css('left', 0);
          }
        } else {
          //autoHideBar();
          if (e.target.id == 'detailedPhoto' || e.target.id == 'overlay') {
            $scope.showBar = !$scope.showBar;
            $scope.$apply();
          }
        }
      });

    }
  };
}])
