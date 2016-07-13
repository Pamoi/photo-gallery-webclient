'use strict';

angular.module('photo-gallery.accountView', ['ui.router', 'photo-gallery.userFactory', 'photo-gallery'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('account', {
    url: '/account',
    templateUrl: 'accountView/accountView.html',
    controller: 'accountViewCtrl',
  });
}])

.directive('sameAs', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      source: '=sameAs'
    },
    link: function(scope, elm, attrs, ngModel) {
      ngModel.$validators.sameAs = function(modelValue) {
        return modelValue == scope.source;
      };

      scope.$watch('source', function() {
        ngModel.$validate();
      });
    }
  };
})

.controller('accountViewCtrl', ['$scope', 'userFactory',
function($scope, userFactory) {
  $scope.requireLogin('account');

  $scope.changePassword = function() {
    $scope.form.oldPass.$pristine = false;
    $scope.form.newPass.$pristine = false;

    if(!$scope.form.$valid) {
      return;
    }

    $scope.loading = true;
    $scope.message = '';

    userFactory.setPassword($scope.user.username, $scope.oldPass, $scope.newPass).then(function() {
      $scope.msgClass = 'alert-success';
      $scope.message = 'Mot de passe changé avec succès !';
    }).catch(function(response) {
      $scope.msgClass = 'alert-danger';
      if (response.data.message == 'Invalid username or password.') {
        $scope.message = 'Ancien mot de passe invalide.';
      } else {
        $scope.message = 'Impossible de contacter le serveur.';
      }
    }).finally(function() {
      $scope.loading = false;
    });
  };
}]);
