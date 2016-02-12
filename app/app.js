'use strict';

// Declare app level module which depends on views, and components
angular.module('photo-gallery', [
  'ui.router',
  'photo-gallery.homeView',
  'photo-gallery.albumView',
  'photo-gallery.loginView',
  'photo-gallery.userFactory',
  'photo-gallery.albumFactory',
  'photo-gallery.httpSrc',
  'photo-gallery.authorList'
  /*'myApp.version'*/
])

.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider.otherwise('/')
}])

.run(['$http', '$httpParamSerializerJQLike', function($http, $httpParamSerializerJQLike) {
  $http.defaults.headers.post = { 'Content-Type' : 'application/x-www-form-urlencoded' }
  $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);
}])

.run(['$rootScope', 'userFactory', function($rootScope, userFactory) {
  userFactory.load();
}])

.value('backendUrl', 'http://localhost:8080')

.controller('mainCtrl', ['$scope', '$rootScope', 'userFactory', '$state',
function($scope, $rootScope, userFactory, $state) {
  $scope.logout = function() {
    userFactory.save(null);
    $state.go('home');
  };
}]);
