'use strict';

describe('photo-gallery.albumFactory', function() {

  var $httpBackend, albumFactory;

  beforeEach(module('photo-gallery.albumFactory', function($provide) {
    $provide.value('backendUrl', 'http://test.com');
  }));

  beforeEach(inject(function(_$httpBackend_, _albumFactory_) {
    $httpBackend = _$httpBackend_;
    albumFactory = _albumFactory_;
  }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
  });

  describe('fetch album list page', function() {

    beforeEach(function() {
    });

    it('should fetch page from server and return it.', function() {
      $httpBackend.expect('GET', 'http://test.com/album/list/1')
      .respond(200, 'album list');

      var albumList;
      albumFactory.fetchPage(1).then(function(l) {
        albumList = l;
      });
      $httpBackend.flush();
      expect(albumList).toBe('album list');
    });

    it('should return response on error.', function() {
      $httpBackend.expect('GET', 'http://test.com/album/list/1')
      .respond(403, 'error');

      var response;
      albumFactory.fetchPage(1).catch(function(r) {
        response = r;
      });
      $httpBackend.flush();
      expect(response.status).toBe(403);
      expect(response.data).toBe('error');
    });
  });
});
