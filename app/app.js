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
  'photo-gallery.searchView',
  'photo-gallery.userFactory',
  'photo-gallery.albumFactory',
  'photo-gallery.httpSrc',
  'photo-gallery.commentForm',
  'photo-gallery.photoDetail',
  'photo-gallery.thumbnailContainer',
  'photo-gallery.authorPicker',
  'photo-gallery.authorList'
])

.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider.otherwise('/')
}])

.value('backendUrl', 'http://localhost:8080')

.run(['backendUrl', '$rootScope', function(backendUrl, $rootScope) {
  $rootScope.makePhotoUrl = function(id) {
    if (id) {
      return backendUrl + '/photo/' + id;
    } else {
      return null;
    }
  };

  $rootScope.makeThumbnailUrl = function(id) {
    var photoUrl = $rootScope.makePhotoUrl(id);
    if (photoUrl) {
      return photoUrl + '/thumb';
    } else {
      return null;
    }
  };

  $rootScope.makeResizedUrl = function(id) {
    var photoUrl = $rootScope.makePhotoUrl(id);
    if (photoUrl) {
      return photoUrl + '/resized';
    } else {
      return null;
    }
  };
}])

.run(['$http', '$httpParamSerializerJQLike', function($http, $httpParamSerializerJQLike) {
  $http.defaults.headers.post = { 'Content-Type' : 'application/x-www-form-urlencoded' }
  $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);
}])

.run(['$rootScope', '$state', 'userFactory', 'FileUploader', 'backendUrl',
 function($rootScope, $state, userFactory, FileUploader, backendUrl) {
  userFactory.load();
  //$rootScope.uploader = new FileUploader();
  $rootScope.uploaders = [];

  $rootScope.getUploader = function() {
    var uploader = new FileUploader();
    uploader.headers = { 'X-AUTH-TOKEN': $rootScope.user.token };
    uploader.alias = 'photo';
    uploader.url = backendUrl + '/photo';
    uploader.filters.push({
      name: 'imageFilter',
      fn: function(item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
    $rootScope.uploaders.push(uploader);
    return uploader;
  };

  $rootScope.removeUploader = function(uploader) {
    var index = $rootScope.uploaders.indexOf(uploader);
    if (index >= 0) {
      $rootScope.uploaders.splice(index, 1);
    }
  };

  $rootScope.requireLogin = function(currentState, params) {
    if ($rootScope.user) {
      return true;
    } else {
      $state.go('login', { nextState: currentState, nextStateParams: params });
      return false;
    }
  };
}])

.controller('mainCtrl', ['$scope', 'userFactory', '$state',
function($scope, userFactory, $state) {
  $scope.logout = function() {
    userFactory.save(null);
    $state.go('home');
  };

  $scope.search = function() {
    if (!$scope.term) {
      $state.go('home');
    } else {
      $state.go('search', { term: $scope.term });
    }
  };

  $scope.getUploadProgress = function() {
    if ($scope.uploaders.length == 0) {
      return 0;
    }

    var progress = 0;
    for (var i = 0; i < $scope.uploaders.length; i++) {
      progress += $scope.uploaders[i].progress;
    }

    return progress / $scope.uploaders.length;
  };

  $scope.isUploading = function() {
    for (var i = 0; i < $scope.uploaders.length; i++) {
      if ($scope.uploaders[i].isUploading) {
        return true;
      }
    }

    return false;
  };
}]);
