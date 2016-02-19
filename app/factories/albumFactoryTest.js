'use strict';

describe('photo-gallery.albumFactory', function() {

  var $httpBackend, albumFactory;

  beforeEach(module('photo-gallery.albumFactory', function($provide) {
    $provide.value('backendUrl', 'http://test.com');
  }));

  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
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

  describe('fetch album', function() {

    it('should fetch album from server and return it.', function() {
      $httpBackend.expect('GET', 'http://test.com/album/33')
      .respond(200, 'album data');

      var album;
      albumFactory.fetchAlbum(33).then(function(a) {
        album = a;
      });
      $httpBackend.flush();
      expect(album).toBe('album data');
    });

    it('should return response on error.', function() {
      $httpBackend.expect('GET', 'http://test.com/album/33')
      .respond(403, 'error');

      var response;
      albumFactory.fetchAlbum(33).catch(function(r) {
        response = r;
      });
      $httpBackend.flush();
      expect(response.status).toBe(403);
      expect(response.data).toBe('error');
    });
  });

  describe('post comment', function() {

    it('should post comment to server and return updated album.', function() {
      $httpBackend.expect('POST', 'http://test.com/album/33/comment', 'text=commentText')
      .respond(200, 'album data');

      var album;
      albumFactory.postComment(33, 'commentText').then(function(a) {
        album = a;
      });
      $httpBackend.flush();
      expect(album).toBe('album data');
    });

    it('should return response on error.', function() {
      $httpBackend.expect('POST', 'http://test.com/album/33/comment')
      .respond(403, 'error');

      var response;
      albumFactory.postComment(33, 'toto').catch(function(r) {
        response = r;
      });
      $httpBackend.flush();
      expect(response.status).toBe(403);
      expect(response.data).toBe('error');
    });
  });

  describe('delete comment', function() {

    it('should delete comment on server.', function() {
      $httpBackend.expect('DELETE', 'http://test.com/album/33/comment/11')
      .respond(200);

      albumFactory.deleteComment(33, 11);
      $httpBackend.flush();
    });

    it('should return response on error.', function() {
      $httpBackend.expect('DELETE', 'http://test.com/album/33/comment/11')
      .respond(403, 'error');

      var response;
      albumFactory.deleteComment(33, 11).catch(function(r) {
        response = r;
      });
      $httpBackend.flush();
      expect(response.status).toBe(403);
      expect(response.data).toBe('error');
    });
  });
});
