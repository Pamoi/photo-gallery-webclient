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
            $scope.next();
          } else if (e.keyCode == 37) {
            $scope.prev();
          } else if (e.keyCode == 27) {
            $scope.photo = null;
          } else {
            return;
          }
          $scope.$apply();
          if ($scope.photo != photo) {
            $scope.loading = true;
          }
          $scope.$apply();
        }
      }

      function onImgLoad() {
        setFrameSize();
        $scope.loading = false;
        $scope.$apply();
      }

      $scope.loading = true;

      angular.element($window).on('resize', setFrameSize);
      $('#detailedPhoto').on('load', onImgLoad);
      angular.element($window).on('keydown', onKeyPressed);

      elem.on('$destroy', function() {
        angular.element($window).off('resize', setFrameSize);
        $('#detailedPhoto').off('load', onImgLoad);
        angular.element($window).off('keydown', onKeyPressed);
      });
    }
  };
}]);
