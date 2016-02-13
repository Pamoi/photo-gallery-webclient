'use strict';

describe('photo-gallery.albumView module', function() {

  beforeEach(module('photo-gallery.albumView'));

  describe('albumView controller', function(){

    var $controller, $rootScope, $scope, controller;

    beforeEach(inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      controller = $controller('albumViewCtrl', { $scope: $scope });
    }));

    it('should instanciate.', function() {
      expect(controller).toBeDefined();
    });

    it('should have album set.', function() {
      expect($scope.album.title).toBe('Album title');
    });
  });
});
