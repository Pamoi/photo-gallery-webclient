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

        if (oldValue == null || oldValue == undefined) {
          showBar();
        }

        if (newValue != null) {
          $('body').css({overflow:'hidden'});
        } else {
          $('body').css({overflow:'auto'});
        }
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

      $scope.startShow = function() {
        $scope.isShowRunning = true;
        photoShow();
      }

      $scope.stopShow = function() {
        $scope.isShowRunning = false;
        $timeout.cancel(showPromise);
      }

      // Helper functions for changing photos and slideshow

      var showPromise;
      var showDelay = 5000;

      function photoShow() {
        showPromise = $timeout(function() {
          changePhoto('next');
          photoShow();
        }, showDelay);
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

      // Handle buttons show/hide

      var buttonLeft = $('#buttonLeft'), buttonRight = $('#buttonRight'), actionBar = $('#topBar');
      var leftOver = false, rightOver = false, barOver = false;
      var barPromise;
      var barTimeout = 2500;

      // Remember if the mouse is over a button
      buttonLeft.on('mouseenter', function() { leftOver = true; console.log('true'); });
      buttonLeft.on('mouseleave', function() { leftOver = false; });

      buttonRight.on('mouseenter', function() { rightOver = true; });
      buttonRight.on('mouseleave', function() { rightOver = false; });

      actionBar.on('mouseenter', function() { barOver = true; });
      actionBar.on('mouseleave', function() { barOver = false; });

      function hideBar() {
        if (!(leftOver || rightOver || barOver)) {
          $scope.showBar = false;
        }
      }

      function showBar() {
        $timeout(function() { $scope.showBar = true; });
        $timeout.cancel(barPromise);
        barPromise = $timeout(hideBar, barTimeout)
      }

      // DOM elements
      var photo = $('#detailedPhoto');
      var overlay = $('#overlay');

      // Event callbacks

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
        photo.hide().fadeIn(700);
      }

      // Variables to handle photo dragging
      var xDragStart;
      var dragging = false;
      var mousedown = false;
      var dragLimitToChangePhoto = 70;

      function onMouseDown(e) {
        xDragStart = e.pageX;
        mousedown = true;
      }

      function onMouseMove(e) {
        if (mousedown) {
          var dragLength = e.pageX - xDragStart;
          if (Math.abs(dragLength) > 10) {
            dragging = true;
          }
          photo.css('left', dragLength);
        }

        showBar();
      }

      function onMouseUp(e) {
        mousedown = false;

        if (dragging) {
          dragging = false;
          var dragLength = e.pageX - xDragStart;

          if (dragLength < -dragLimitToChangePhoto) {
            $scope.nextPhoto();
          } else if (dragLength > dragLimitToChangePhoto) {
            $scope.previousPhoto();
          } else {
            photo.css('left', 0);
          }
        }
      }

      // Register the callbacks
      photo.on('load', onImgLoad);
      photo.on('mousedown', onMouseDown);
      photo.on('dragstart', function(e) { e.preventDefault(); });
      overlay.on('mousemove', onMouseMove);
      overlay.on('mouseup', onMouseUp);
      angular.element($window).on('keydown', onKeyPressed);

      elem.on('$destroy', function() {
        angular.element($window).off('keydown', onKeyPressed);
      });

    }
  };
}])
