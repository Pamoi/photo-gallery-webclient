'use strict';

angular.module('photo-gallery.authorPicker', ['ui.bootstrap'])

.directive('authorPicker', [function() {
  return {
    templateUrl: 'directives/authorPicker.html',
    restrict: 'E',
    scope: {
      users: '=',
      model: '='
    },
    link: function($scope, elem, attrs) {
      $scope.users = $scope.users.filter(function(u) {
        return $scope.model.indexOf(u) > 0;
      });

      $scope.addAuthor = function($item) {
        if ($scope.model.indexOf($item) < 0) {
          $scope.model.push($item);
        }
        var index = $scope.users.indexOf($item);
        $scope.users.splice(index, 1);
        $scope.author = '';
      };

      $scope.removeAuthor = function(author) {
        var index = $scope.model.indexOf(author);
        $scope.model.splice(index, 1);
        if ($scope.users.indexOf(author) < 0) {
          $scope.users.push(author);
        }
      };
    }
  };
}]);
