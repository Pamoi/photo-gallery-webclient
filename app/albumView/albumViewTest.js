'use strict';

describe('photo-gallery.albumView module', function() {

  beforeEach(module('photo-gallery.albumView'), function($provide) {
    $provide.value('albumFactory', {
      fetchPage: jasmine.createSpy('fetchPage'),
      fetchAlbum: jasmine.createSpy('fetchAlbum'),
      postComment: jasmine.createSpy('postComment'),
      deleteComment: jasmine.createSpy('deleteComment')
    });

    $provide.value('backendUrl', 'http://test.com');

    $provide.value('$state', {
      go: jasmine.createSpy('go')
    });

    $provide.value('$stateParams', {});
  });

  describe('albumView controller', function(){

    var $controller, $scope, controller;

    beforeEach(inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      controller = $controller('albumViewCtrl', { $scope: $scope });
    }));

    it('should instanciate.', function() {
      expect(controller).toBeDefined();
    });
  });
});
