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

      // Scope functions
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

      // Handle slideshow

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

      // Handle action bar autohide

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
          $timeout(function() { $scope.showBar = false; });
        }
      }

      function showBar() {
        $timeout(function() { $scope.showBar = true; });
        $timeout.cancel(barPromise);
        barPromise = $timeout(hideBar, barTimeout)
      }

      // Handle keyboard events

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

      // Handle photo switching

      var photo = $('#detailedPhoto');
      var overlay = $('#overlay');

      function onImgLoad() {
        $scope.loading = false;
        $scope.$apply();
        photo.hide().fadeIn(700);
      }

      // JS events callbacks
      photo.on('load', onImgLoad);
      photo.on('dragstart', function(e) { e.preventDefault(); });
      overlay.on('mousemove', showBar);
      angular.element($window).on('keydown', onKeyPressed);

      elem.on('$destroy', function() {
        angular.element($window).off('keydown', onKeyPressed);
      });

      // Hammer events
      var mc = new Hammer(document.getElementById('overlay'));

      mc.on('pan', function(ev) {
        photo.css('left', ev.deltaX);
      });

      mc.on('panend', function(ev) {
        if (ev.direction == Hammer.DIRECTION_LEFT) {
          $scope.nextPhoto();
        } else if (ev.direction == Hammer.DIRECTION_RIGHT) {
          $scope.previousPhoto();
        } else {
          photo.css('left', 0);
        }
      });

      mc.on('tap', function(ev) {
        if ($scope.showBar) {
          hideBar();
        } else {
          showBar();
        }
      });
    }
  };
}]);
