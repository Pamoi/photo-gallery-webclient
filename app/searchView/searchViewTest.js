'use strict';

describe('photo-gallery.searchView module', function() {

  describe('searchView controller', function() {

    var $scope, controller, albumFactory;

    beforeEach(module('photo-gallery.searchView', function($provide) {
      $provide.value('albumFactory', {
        searchAlbum: jasmine.createSpy('searchAlbum')
      });

      $provide.value('$stateParams', { term: 'toto' });
    }));

    describe('searchView controller', function() {
      beforeEach(inject(function(_$q_, _albumFactory_) {
        albumFactory = _albumFactory_;
        albumFactory.searchAlbum.and.returnValue(_$q_.when([1, 2, 3]));
      }));

      beforeEach(inject(function(_$controller_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        controller = _$controller_('searchViewCtrl', { $scope: $scope });
      }));

      it('should instanciate controller.', function() {
        expect(controller).toBeDefined();
      });

      describe('data loading', function() {
        it('should search albums using albumFactory.',function() {
          $scope.$apply();
          expect(albumFactory.searchAlbum).toHaveBeenCalledWith('toto');
          expect($scope.albums).toEqual([1, 2, 3]);
        });

        it('should show loading spinner.', function() {
          expect($scope.fetching).toBe(true);
          $scope.$apply();
          expect($scope.fetching).toBe(false);
        });
      });
    });
  });
});
