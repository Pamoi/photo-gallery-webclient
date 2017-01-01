'use strict';

angular.module('photo-gallery.photoDetail', ['ngAnimate', 'ui.bootstrap'])

.directive('photoDetail', ['$window', '$timeout', '$uibModal', function($window, $timeout, $uibModal) {
  return {
    templateUrl: 'directives/photoDetail.html',
    restrict: 'E',
    scope: {
      photo: '=',
      isAuthor: '=',
      prev: '&prev',
      next: '&next',
      makeUrl: '&makeUrl',
      deletePhoto: '&deletePhoto'
    },
    link: function($scope, elem, attrs) {
      $scope.$watch('photo', function(newValue, oldValue) {
        $scope.loading = true;
        $scope.$apply();
      });

      function changePhoto(direction) {
        $timeout(function() {
          if (direction == 'next') {
            $scope.next();
          } else if (direction == 'prev') {
            $scope.prev();
          }

          $('#detailedPhoto').css('left', 0);
        });
      }

      $scope.showBar = true;

      $scope.nextPhoto = function() {
        changePhoto('next');
      };

      $scope.previousPhoto = function() {
        changePhoto('prev');
      };

      $scope.openModal = function() {
        var modal = $uibModal.open({
          controller: 'PhotoModalCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'directives/photoDetailModal.html',
          resolve: {
            photo: function() {
              return $scope.photo;
            },
            canDelete: function() {
              return $scope.isAuthor;
            }
          }
        });

        modal.result.then(function() {
          $scope.deletePhoto({photo: $scope.photo});
          $scope.photo = null;
        });
      };

      function onKeyPressed(e) {
        $timeout(function() {
          if ($scope.photo) {
            if (e.keyCode == 39) {
              changePhoto('next');
            } else if (e.keyCode == 37) {
              changePhoto('prev');
            } else if (e.keyCode == 27) {
              $scope.photo = null;
            } else {
              return;
            }
          }
        });
      }

      function onImgLoad() {
        $scope.loading = false;
        $('#detailedPhoto').fadeIn();
        $scope.$apply();
        //autoHideBar();
      }

      var timerPromise;

      function autoHideBar() {
        $timeout.cancel(timerPromise);
        timerPromise = $timeout(function() { $scope.showBar = false; }, 5000);
      }

      // Register event callbacks
      var photo = $('#detailedPhoto');
      var overlay = $('#overlay');
      photo.on('load', onImgLoad);
      photo.on('dragstart', function(e) { e.preventDefault(); });
      angular.element($window).on('keydown', onKeyPressed);

      elem.on('$destroy', function() {
        photo.off('load');
        photo.off('click');
        angular.element($window).off('keydown', onKeyPressed);
      });

      var xDragStart;
      var dragging = false;
      var mousedown = false;
      var dragLimitToChangePhoto = 70;

      photo.on('mousedown', function(e) {
        xDragStart = e.pageX;
        mousedown = true;
      });

      overlay.on('mousemove', function(e) {
        if (mousedown) {
          var dragLength = e.pageX - xDragStart;
          if (Math.abs(dragLength) > 10) {
            dragging = true;
          }
          photo.css('left', dragLength);
        }
      });

      overlay.on('mouseup', function(e) {
        mousedown = false;

        if (dragging) {
          dragging = false;
          var dragLength = e.pageX - xDragStart;

          if (dragLength < -dragLimitToChangePhoto) {
            changePhoto('next');
          } else if (dragLength > dragLimitToChangePhoto) {
            changePhoto('prev');
          } else {
            photo.css('left', 0);
          }
        } else {
          //autoHideBar();
          $scope.showBar = !$scope.showBar;
          $scope.$apply();
        }
      });

    }
  };
}])

.controller('PhotoModalCtrl', ['$uibModalInstance', 'photo', 'canDelete',
function ($uibModalInstance, photo, canDelete, deletePhoto) {
  var $ctrl = this;
  $ctrl.canDelete = canDelete;
  $ctrl.photo = photo;

  $ctrl.downloadPhoto = function() {
    var link = document.createElement('a');
    link.href = $('#detailedPhoto').attr('src');
    link.download = '';
    document.body.appendChild(link);
    link.click();
  };

  $ctrl.delete = function() {
    $uibModalInstance.close();
  };

  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
