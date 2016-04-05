'use strict';

angular.module('photo-gallery.loginView', ['ui.router', 'photo-gallery.userFactory'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'loginView/loginView.html',
    controller: 'loginViewCtrl',
    params: {
      nextState: null,
      nextStateParams: {}
    }
  });
}])

.controller('loginViewCtrl', ['$scope', '$state', '$stateParams', 'userFactory',
function($scope, $state, $stateParams, userFactory) {
  $scope.login = function() {
    userFactory.authenticate($scope.username, $scope.password).then(function(user) {
      userFactory.save(user);

      if ($stateParams.nextState) {
        $state.go($stateParams.nextState, $stateParams.nextStateParams);
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
