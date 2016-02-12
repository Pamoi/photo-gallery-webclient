'use strict';

angular.module('photo-gallery.loginView', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'loginView/loginView.html',
    controller: 'loginViewCtrl'
  });
}])

.controller('loginViewCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'userFactory',
function($scope, $rootScope, $state, $stateParams, userFactory) {
  $scope.login = function() {
    userFactory.authenticate($scope.username, $scope.password).then(function(token) {
      var user = {
        username: $scope.username,
        token: token
      };

      userFactory.save(user);

      if ($stateParams.nextState) {
        $state.go($stateParams.nextState);
      } else {
        $state.go('home');
      }
    }).catch(function(response) {
      if (response.status == 401) {
        $scope.message = 'Nom d\'utilisateur ou mot de passe incorrect.';
      } else {
        $scope.message = 'Impossible de joindre le serveur.';
      }
    });
  }
}]);
