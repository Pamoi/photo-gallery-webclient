'use strict';

describe('photo-gallery.homeView module', function() {

  describe('homeView controller', function() {

    var $scope, controller, albumFactory;

    beforeEach(module('photo-gallery.homeView', function($provide) {
      $provide.value('albumFactory', {
        fetchPage: jasmine.createSpy('fetchPage')
      });

      $provide.value('backendUrl', 'http://test.com');
    }));

    beforeEach(inject(function(_$q_, _albumFactory_) {
      albumFactory = _albumFactory_;
      albumFactory.fetchPage.and.returnValue(_$q_.when('albums'));
    }));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
      $scope = _$rootScope_.$new();
      controller = _$controller_('homeViewCtrl', { $scope: $scope });
      $scope.$apply();
    }));

    it('should instanciate controller.', function() {
      expect(controller).toBeDefined();
    });

    it('should create correct photo URLs.', function() {
      expect($scope.makePhotoUrl(33)).toBe('http://test.com/photo/33/thumb');
    });

    it('should fetch albums using albumFactory.',function() {
      expect(albumFactory.fetchPage).toHaveBeenCalledWith(1);
      expect($scope.albums).toBe('albums');
    });
  });
});
