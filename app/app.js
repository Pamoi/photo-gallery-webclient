'use strict';

// Declare app level module which depends on views, and components
angular.module('photo-gallery', [
  'ngRoute',
  'photo-gallery.homeView',
  'photo-gallery.albumView',
  /*'myApp.version'*/
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
