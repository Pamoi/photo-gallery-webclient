'use strict';

angular.module('photo-gallery.uploadView', ['ui.router', 'photo-gallery.albumFactory'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('upload', {
    url: '/upload',
    templateUrl: 'uploadView/uploadView.html',
    controller: 'uploadViewCtrl',
  });
}])

.controller('uploadViewCtrl', ['$scope', '$http', '$state', 'backendUrl', 'albumFactory', 'userFactory',
function($scope, $http, $state, backendUrl, albumFactory, userFactory) {
  $scope.requireLogin('upload', {});
  // Configure uploader
  $scope.uploader.headers = { 'X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] };
  $scope.uploader.alias = 'photo';
  $scope.uploader.clearQueue();
  $scope.uploader.url = backendUrl + '/photo';
  $scope.totalSize = 0;
  $scope.uploader.onAfterAddingFile = function(item) {
    $scope.totalSize += item.file.size;
  };
  $scope.uploader.filters.push({
    name: 'imageFilter',
    fn: function(item, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });

  // Get user list to add authors
  $scope.users = [];
  $scope.authors = [];
  userFactory.getUserList().then(function(userList) {
    $scope.users = userList.filter(function(u) {
      return u.username != $scope.user.username;
    });
  });

  $scope.addAuthor = function($item) {
    $scope.authors.push($item);
    var index = $scope.users.indexOf($item);
    $scope.users.splice(index, 1);
    $scope.author = '';
  };

  $scope.removeAuthor = function(author) {
    var index = $scope.authors.indexOf(author);
    $scope.authors.splice(index, 1);
    $scope.users.push(author);
  };

  // Setup calendar
  $scope.today = new Date();
  $scope.date = new Date();

  $scope.openCalendar = function() {
    $scope.isCalendarOpen = true;
  }

  // Send album function
  $scope.send = function() {
    // Show validation for title
    $scope.form.title.$pristine = false;

    if (!$scope.form.$valid) {
      return;
    }

    // Create album
    var authorsIds = $scope.authors.map(function(a) {
      return a.id;
    });
    var album = {
      title: $scope.title,
      description: $scope.description,
      date: $scope.date.toISOString(),
      authorsIds: authorsIds.join(',')
    };

    // Post it to server and upload photos
    albumFactory.postAlbum(album).then(function(a) {
      // Redirect to new album after uploading has finished
      $scope.uploader.onCompleteAll = function() {
        if ($state.current.name == 'upload') {
          $state.go('albumDetail', { id: a.id });
        }
      };

      $scope.uploader.onBeforeUploadItem = function(item) {
        item.formData.push({ date: album.date });
        item.formData.push({ albumId: a.id });
      };

      $scope.uploader.uploadAll();
    });
  };
}])

/**
* Preview of selected images
* adapted from https://github.com/nervgh/angular-file-upload/blob/master/examples/image-preview/directives.js
*/
.directive('photoPreview', ['$window', '$timeout', function($window, $timeout) {
  var helper = {
    support: !!($window.FileReader),
    isFile: function(item) {
      return angular.isObject(item) && item instanceof $window.File;
    },
    isImage: function(file) {
      var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  };

  var count = 0;

  return {
    restrict: 'A',
    template: '<img alt="" class="photo-preview" />',
    link: function(scope, element, attributes) {
      if (!helper.support) return;

      var params = scope.$eval(attributes.photoPreview);

      if (!helper.isFile(params.file)) return;
      if (!helper.isImage(params.file)) return;

      var img = element.find('img');
      var reader = new FileReader();

      reader.onload = function (e) {
        img.attr('src', e.target.result);
      };

      // Empirical timeout to avoid blocking the UI
      $timeout(function() {
        reader.readAsDataURL(params.file);
        count -= 2000;
      }, count);
      count += 2000;
    }
  };
}]);
