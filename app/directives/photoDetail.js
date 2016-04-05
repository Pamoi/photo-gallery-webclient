'use strict';

angular.module('photo-gallery.photoDetail', [])

.directive('photoDetail', ['$window', function($window) {
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
      function changePhoto(direction) {
        var id = $scope.photo.id;

        if (direction == 'next') {
          $scope.next();
        } else if (direction == 'prev') {
          $scope.prev();
        }

        $scope.$apply();

        if ($scope.photo.id != id) {
          $scope.loading = true;
          $scope.$apply();
        }
      }

      $scope.nextPhoto = function() {
        changePhoto('next');
      }

      $scope.previousPhoto = function() {
        changePhoto('prev');
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
          photo.height(windowHeight - paddingHeight - buttonHeight);
          photo.width('auto');
          frame.width('auto');
        }
      }

      function onKeyPressed(e) {
        if ($scope.photo) {
          var photo = $scope.photo;
          if (e.keyCode == 39) {
            $scope.nextPhoto();
          } else if (e.keyCode == 37) {
            $scope.previousPhoto();
          } else if (e.keyCode == 27) {
            $scope.photo = null;
            $scope.$apply();
          } else {
            return;
          }
        }
      }

      function onImgLoad() {
        $scope.loading = false;
        $('#detailedPhoto').fadeIn();
        $scope.$apply();
        setFrameSize();
      }

      $scope.loading = true;

      var photo = $('#detailedPhoto');
      angular.element($window).on('resize', setFrameSize);
      photo.on('load', onImgLoad);
      photo.on('dragstart', function(e) { e.preventDefault(); });
      photo.on('swipeleft', $scope.nextPhoto);
      photo.on('swiperight',$scope.previousPhoto);
      angular.element($window).on('keydown', onKeyPressed);

      elem.on('$destroy', function() {
        angular.element($window).off('resize', setFrameSize);
        photo.off('load', onImgLoad);
        photo.off('swipeleft', $scope.previousPhoto);
        photo.off('swiperight', $scope.nextPhoto);
        angular.element($window).off('keydown', onKeyPressed);
      });
    }
  };
}]);
