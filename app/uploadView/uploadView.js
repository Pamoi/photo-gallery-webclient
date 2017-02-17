'use strict';

angular.module('photo-gallery.uploadView', [
  'ui.router',
  'photo-gallery.albumFactory',
  'photo-gallery.userFactory',
  'ui.bootstrap',
  'angularFileUpload'
])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('upload', {
    url: '/upload',
    templateUrl: 'uploadView/uploadView.html',
    controller: 'uploadViewCtrl'
  })

  .state('editAlbum', {
    url: '/edit/:id',
    templateUrl: 'uploadView/uploadView.html',
    controller: 'uploadViewCtrl',
  });
}])

.controller('uploadViewCtrl', ['$scope', '$state', '$stateParams', 'albumFactory', 'userFactory', 'FileUploader',
function($scope, $state, $stateParams, albumFactory, userFactory, FileUploader) {
  var state = $state.current.name;
  var params = {};
  $scope.sent = false;
  $scope.album = {
    authors: []
  };

  if (state == 'editAlbum') {
    params.id = $stateParams.id;
    $scope.edit = true;
    $scope.loading = true;
  }

  $scope.requireLogin(state, params);

  // Configure uploader
  if ($scope.user) {
    $scope.uploader = $scope.getUploader();
  } else {
    // Do not create global uploader as the user will be redirected
    $scope.uploader = new FileUploader();
  }

  $scope.totalSize = 0;
  $scope.uploader.onAfterAddingFile = function(item) {
    $scope.totalSize += item.file.size;
  };

  $scope.removeItem = function(item) {
    $scope.totalSize -= item.file.size;
    item.remove();
  }

  // Get user list to add authors
  function isNotCurrentUser(user) {
    return user.id != $scope.user.id;
  }

  function setLoadingError() {
    $scope.loadingError = true;
    $scope.loading = false;
  }

  $scope.users = [];
  userFactory.getUserList().then(function(userList) {
    $scope.users = userList.filter(isNotCurrentUser);
    if (state == 'editAlbum') {
      albumFactory.fetchAlbum(params.id).then(function(a) {
        $scope.album = a;
        var date = new Date(a.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        $scope.album.date = date;
        $scope.album.authors = $scope.album.authors.filter(isNotCurrentUser);
        var authorsIds = $scope.album.authors.map(function(u) { return u.id });
        $scope.users = $scope.users.filter(function(u) {
          return (authorsIds.indexOf(u.id) < 0);
        });
        $scope.loading = false;
      }).catch(setLoadingError);
    }
  }).catch(setLoadingError);

  // Setup calendar
  $scope.today = new Date();
  $scope.album.date = new Date();

  $scope.$on('$stateChangeStart', function() {
    if (!$scope.uploader.isUploading) {
      $scope.removeUploader($scope.uploader);
    }
  });

  // Send album function
  $scope.send = function() {
    // Show validation for title
    $scope.form.title.$pristine = false;

    if (!$scope.form.$valid || $scope.sent) {
      return;
    }

    if ($scope.uploader.queue.length == 0 && state == 'upload') {
      $scope.noPhotoError = true;
      return;
    }

    $scope.sent = true;

    // Create album
    var authorsIds = $scope.album.authors.map(function(a) {
      return a.id;
    });
    var album = {
      title: $scope.album.title,
      description: $scope.album.description,
      date: $scope.album.date.toISOString(),
      authorsIds: authorsIds.join(','),
    };

    var promise;
    if (state == 'upload') {
      promise = albumFactory.postAlbum(album);
    } else {
      album.id = $scope.album.id;
      promise = albumFactory.putAlbum(album);
    }

    promise.then(function(a) {
      $scope.albumId = a.id;

      $scope.uploader.onCompleteAll = function() {
        $scope.removeUploader($scope.uploader);
        $scope.uploadComplete = true;
      };

      $scope.uploader.onBeforeUploadItem = function(item) {
        item.formData.push({ date: album.date });
        item.formData.push({ albumId: a.id });
      };

      if ($scope.uploader.queue.length == 0) {
        $scope.uploader.onCompleteAll();
      } else {
        $scope.uploader.uploadAll();
      }
    }).catch(function(response) {
      $scope.sendError = true;
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

  // Helper functions to load images sequentially to avoid freezing the UI
  var wq = [];
  var busy = false;

  function enqueue(fn) {
    wq.push(function() {
      fn();
      busy = false;
      loadFirst();
    });
  }

  function loadFirst() {
    if (wq.length > 0 && busy == false) {
      busy = true;
      var fn = wq.shift();
      $timeout(fn, 500);
    }
  }

  return {
    restrict: 'A',
    template: '<canvas />',
    replace: true,
    link: function(scope, element, attributes) {
      if (!helper.support) return;

      var params = scope.$eval(attributes.photoPreview);

      if (!helper.isFile(params.file)) return;
      if (!helper.isImage(params.file)) return;

      // Variable to handle thumbnail size
      var maxWidth = 200;
      var maxHeight = 200;

      var img = new Image;
      var ctx = element[0].getContext('2d');

      img.onload = function() {
        // Create thumbnail
        var ratio = img.width / img.height;
        var width = img.width;
        var height = img.height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width * (1 / ratio);
        }

        if (height > maxHeight) {
          height = Math.min(maxHeight, maxWidth * (1 / ratio));
          width = height * ratio;
        }

        ctx.drawImage(img, 0, 0, width, height);
      }

      enqueue(function() {
        img.src = URL.createObjectURL(params.file);
      });

      $timeout(loadFirst);
    }
  };
}]);
