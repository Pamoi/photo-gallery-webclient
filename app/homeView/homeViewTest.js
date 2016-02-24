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

    describe('homeView controller', function() {
      beforeEach(inject(function(_$q_, _albumFactory_) {
        albumFactory = _albumFactory_;
        albumFactory.fetchPage.and.returnValue(_$q_.when([1, 2, 3]));
      }));

      beforeEach(inject(function(_$controller_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        controller = _$controller_('homeViewCtrl', { $scope: $scope });
      }));

      it('should instanciate controller.', function() {
        expect(controller).toBeDefined();
      });

      describe('data loading', function() {
        it('should fetch albums using albumFactory.',function() {
          $scope.$apply();
          expect(albumFactory.fetchPage).toHaveBeenCalledWith(1);
          expect($scope.albums).toEqual([1, 2, 3]);
        });

        it('should show loading spinner.', function() {
          expect($scope.fetching).toBe(true);
          $scope.$apply();
          expect($scope.fetching).toBe(false);
        });

        it('should add albums to list after new loading.', function() {
          $scope.$apply();
          expect(albumFactory.fetchPage).toHaveBeenCalledWith(1);
          $scope.loadAlbums();
          $scope.$apply();
          expect(albumFactory.fetchPage).toHaveBeenCalledWith(2);
          expect($scope.albums).toEqual([1, 2, 3, 1, 2, 3]);
        });
      });
    });
  });
});
