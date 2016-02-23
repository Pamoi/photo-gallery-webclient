'use strict';

angular.module('photo-gallery.commentForm', [])

.directive('commentForm', ['$rootScope', '$state', '$stateParams', 'albumFactory',
function($rootScope, $state, $stateParams, albumFactory) {
  return {
    template: '<textarea class="form-control margin-top-small" rows="3" placeholder="Ajouter un commentaire..." ' +
    'ng-model="commentText"></textarea><button class="btn btn-primary margin-top-small" ng-click="postComment()">' +
    'Envoyer</button>',
    restrict: 'E',
    scope: {
      album: '='
    },
    link: function($scope, elem, attrs) {
      $scope.postComment = function() {
        if ($scope.commentText != '' &&
        $rootScope.requireLogin($state.current, { id: $stateParams.id, album: $scope.album })) {
          albumFactory.postComment($scope.album.id, $scope.commentText).then(function(a) {
            $scope.album.comments = a.comments;
            $scope.commentText = '';
          });
        }
      };
    }
  };
}]);
