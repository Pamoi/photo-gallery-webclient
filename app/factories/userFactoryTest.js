'use strict';

describe('photo-gallery.userFactory', function() {

  var $httpBackend, userFactory, $rootScope, $http;
  var user;
  var correct = {
    username: 'toto',
    token: 'IamAToken'
  };

  // Workaround to make test localStorage on firefox.
  var mock = (function() {
    var store = {};
    return {
      getItem: function(key) {
        return store[key];
      },
      setItem: function(key, value) {
        store[key] = value.toString();
      },
      clear: function() {
        store = {};
      }
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: mock,configurable:true,enumerable:true,writable:true });

  // Load full app as formatter for POST requests is set in app.js
  beforeEach(module('photo-gallery', function($provide) {
    $provide.value('backendUrl', 'http://test.com');
  }));

  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function(_$httpBackend_, _userFactory_, _$rootScope_, _$http_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('**/*.html').respond(200);
    userFactory = _userFactory_;
    $rootScope = _$rootScope_;
    $http = _$http_;
    spyOn($http.defaults.headers, 'common');
  }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
  });

  describe('load existing user', function() {

    beforeEach(function() {
      spyOn(window.localStorage, 'getItem').and.returnValue('{"username":"toto","token":"IamAToken"}');
      user = userFactory.load();
    });

    it('should load user from localstorage', function() {
      expect(localStorage.getItem).toHaveBeenCalledWith('photo-gallery.user');
      expect(user).toEqual(correct);
    });

    it('should set user in root scope.', function() {
      expect($rootScope.user).toEqual(correct);
    });

    it('should set http headers.', function() {
      expect($http.defaults.headers.common['X-AUTH-TOKEN']).toBe('IamAToken');
    });
  });

  describe('load non existing user', function() {
    beforeEach(function() {
      spyOn(window.localStorage, 'getItem').and.returnValue(undefined);
      user = userFactory.load();
    });

    it('should return null.', function() {
      expect(user).toBe(null);
    });

    it('should not set http headers', function() {
      expect($http.defaults.headers.common['X-AUTH-TOKEN']).toBe(undefined);
    });
  });

  describe('save user', function() {
    beforeEach(function() {
      spyOn(window.localStorage, 'setItem');
      userFactory.save({
        username: 'toto',
        token: 'IamAToken'
      });
    });

    it('should save user to local storage.', function() {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('photo-gallery.user',
      '{"username":"toto","token":"IamAToken"}');
    });

    it('should set user in root scope', function() {
      expect($rootScope.user).toEqual(correct);
    });

    it('should set http headers', function() {
      expect($http.defaults.headers.common['X-AUTH-TOKEN']).toBe('IamAToken');
    });
  });

  describe('authenticate on server', function() {
    it('should send request to the server and get back a token.', function() {
      $httpBackend.expect('POST', 'http://test.com/authenticate', 'password=1234&username=toto')
      .respond(200, '{"token":"IamAToken"}');

      var token;
      userFactory.authenticate('toto', '1234').then(function(t) {
        token = t;
      });
      $httpBackend.flush();
      expect(token).toBe('IamAToken');
    });

    it('should return response on error', function() {
      $httpBackend.expect('POST', 'http://test.com/authenticate', 'password=1234&username=toto')
      .respond(401, 'error');

      var response;
      userFactory.authenticate('toto', '1234').catch(function(r) {
        response = r;
      });
      $httpBackend.flush();
      expect(response.status).toBe(401);
      expect(response.data).toBe('error');
    });
  });
});
