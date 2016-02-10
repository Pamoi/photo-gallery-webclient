'use strict';

angular.module('photo-gallery.homeView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'homeView/homeView.html',
    controller: 'homeViewCtrl'
  });
}])

.controller('homeViewCtrl', ['$scope', function($scope) {
  $scope.albums = [
    {
      title: 'First album',
      description: 'This is the album description. More text about interesting details related to the album. Again a bit more text and goodbye.',
      photos: [
        { src: '#' },
        { src: '#' },
        { src: '#' },
        { src: '#' }
      ],
      comments: [
        { author: 'Me', text: 'Very nice pictures !' },
        { author: 'Someone else', text: 'They are not that good :(' }
      ]
    },
    {
      title: 'Another album',
      description: 'This album has a shorter description.',
      photos: [
        { src: '#' },
        { src: '#' },
        { src: '#' },
        { src: '#' }
      ],
      comments: []
    }
  ]
}]);
