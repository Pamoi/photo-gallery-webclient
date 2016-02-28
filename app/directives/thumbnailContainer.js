'use strict';

angular.module('photo-gallery.thumbnailContainer', [])

.directive('thumbnailContainer', ['$window', function($window) {
  return {
    templateUrl: 'directives/thumbnailContainer.html',
    restrict: 'E',
    scope: {
      photos: '=',
      makeUrl: '&makeUrl',
      onClick: '&onClick'
    },
    link: function($scope, elem, attrs) {
      // Get width of a single thumbnail
      var div = $('<div>').addClass('photo-thumbnail').hide();
      $('body').append(div);
      var blockWidth = div.outerWidth(true);
      div.remove();

      function setContainerWidth() {
        $('.thumbnail-container').width('auto');
        var pageWidth = $('.container').width();
        var maxBoxPerRow = Math.floor(pageWidth / blockWidth);
        $('.thumbnail-container').width(maxBoxPerRow * blockWidth);
      }

      setContainerWidth();

      angular.element($window).on('resize', setContainerWidth);

      elem.on('$destroy', function() {
        angular.element($window).off('resize', setContainerWidth);
      });
    }
  };
}]);
