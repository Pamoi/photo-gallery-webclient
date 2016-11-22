'use strict';

// Declare app level module which depends on views, and components
angular.module('photo-gallery', [
  'angularFileUpload',
  'ui.router',
  'ui.bootstrap',
  'photo-gallery.config',
  'photo-gallery.homeView',
  'photo-gallery.albumView',
  'photo-gallery.loginView',
  'photo-gallery.accountView',
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

// Provide application wide functions to create photo urls (should be refactored)
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

// Provide a function to check if the user is logged in and redirect to the login page if not
.run(['$rootScope', '$state', 'userFactory', function($rootScope, $state, userFactory) {
  userFactory.load();

  $rootScope.requireLogin = function(currentState, params) {
    if ($rootScope.user) {
      return true;
    } else {
      $state.go('login', { nextState: currentState, nextStateParams: params });
      return false;
    }
  };
}])

// Transform form requests in www-form-urlencoded format instead of json
.run(['$http', '$httpParamSerializerJQLike', function($http, $httpParamSerializerJQLike) {
  $http.defaults.headers.post = { 'Content-Type' : 'application/x-www-form-urlencoded' }
  $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);
}])

// Automatic logout if the saved token is refused by the API
.run(['$http', '$state', 'userFactory', function($http, $state, userFactory) {
  function logoutOnInvalidToken(response, headersGetter, status) {
    if (status == 403 && response.message == 'Invalid token') {
      userFactory.save(null);
      $state.go('login');
    }

    return response;
  }

  $http.defaults.transformResponse.push(logoutOnInvalidToken);
}])

// Manage uploader instances for parallel uploads
.run(['$rootScope', '$state', 'userFactory', 'FileUploader', 'backendUrl',
 function($rootScope, $state, userFactory, FileUploader, backendUrl) {
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
}])

// Controller for the navbar
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

  $scope.getUploadProgressText = function() {
    if ($scope.uploaders.length == 0) {
      return '';
    } else if ($scope.uploaders.length == 1) {
      return $scope.uploaders[0].progress + ' %';
    } else {
      var count = 0;
      var progress = 0;

      for (var i = 0; i < $scope.uploaders.length; i++) {
        if ($scope.uploaders[i].isUploading) {
          count++;
          progress = $scope.uploaders[i].progress;
        }
      }

      if (count == 1) {
        return progress + ' %';
      } else {
        return count + ' albums';
      }
    }
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
