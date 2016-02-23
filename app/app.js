'use strict';

// Declare app level module which depends on views, and components
angular.module('photo-gallery', [
  'angularFileUpload',
  'ui.router',
  'ui.bootstrap',
  'photo-gallery.homeView',
  'photo-gallery.albumView',
  'photo-gallery.loginView',
  'photo-gallery.uploadView',
  'photo-gallery.userFactory',
  'photo-gallery.albumFactory',
  'photo-gallery.httpSrc',
  'photo-gallery.commentForm',
  'photo-gallery.authorList'
])

.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider.otherwise('/')
}])

.run(['$http', '$httpParamSerializerJQLike', function($http, $httpParamSerializerJQLike) {
  $http.defaults.headers.post = { 'Content-Type' : 'application/x-www-form-urlencoded' }
  $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);
}])

.run(['$rootScope', '$state', 'userFactory', 'FileUploader', function($rootScope, $state, userFactory, FileUploader) {
  userFactory.load();
  $rootScope.uploader = new FileUploader();
  $rootScope.requireLogin = function(currentState, params) {
    if ($rootScope.user) {
      return true;
    } else {
      $state.go('login', { nextState: currentState, nextStateParams: params });
      return false;
    }
  };
}])

.value('backendUrl', 'http://localhost:8080')

.controller('mainCtrl', ['$scope', '$rootScope', 'userFactory', '$state',
function($scope, $rootScope, userFactory, $state) {
  $scope.logout = function() {
    userFactory.save(null);
    $state.go('home');
  };
}]);
