'use strict';

describe('photo-gallery.loginView module', function() {

  describe('loginView controller', function() {

    var $controller, $scope, controller;

    beforeEach(module('photo-gallery.loginView', function($provide) {
      $provide.value('userFactory', {
          load: jasmine.createSpy('load'),
          save: jasmine.createSpy('save'),
          authenticate: jasmine.createSpy('authenticate')
      });

      $provide.value('$state', {
        go: jasmine.createSpy('go')
      });

      $provide.value('$stateParams', {});
    }));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      controller = $controller('loginViewCtrl', { $scope: $scope });
    }));

    it('should instanciate controller.', function() {
      expect(controller).toBeDefined();
    });

    describe('login', function() {

      var userFactory, $q, $state, $stateParams;

      beforeEach(inject(function(_userFactory_,  _$q_, _$state_, _$stateParams_) {
        userFactory = _userFactory_;
        $q = _$q_;
        $state = _$state_;
        $stateParams = _$stateParams_;
      }));

      describe('successful', function() {
        beforeEach(function() {
          userFactory.authenticate.and.returnValue($q.when('IamAToken'));
          $scope.username = 'toto';
          $scope.password = '1234';
          $scope.login();
        });

        it('should authenticate.', function() {
          expect(userFactory.authenticate).toHaveBeenCalledWith('toto', '1234');
        });

        it('should save user.', function() {
          $scope.$apply();
          expect(userFactory.save).toHaveBeenCalledWith({
            username: 'toto',
            token: 'IamAToken'
          });
        });

        it('should redirect on successful authentification', function() {
          $scope.$apply();
          expect($state.go).toHaveBeenCalledWith('home');
        });

        it('should redirect to state given in $stateParams on successful authentification', function() {
          $stateParams.nextState = 'stateX';
          $scope.$apply();
          expect($state.go).toHaveBeenCalledWith('stateX');
        });
      });

      describe('failed', function() {
        it('should display invalid credentials message', function() {
          userFactory.authenticate.and.returnValue($q.reject({ status: 401 }));
          $scope.login();
          $scope.$apply();
          expect($scope.message).toBe('Nom d\'utilisateur ou mot de passe incorrect.');
        });

        it('should display unable to reach server message', function() {
          userFactory.authenticate.and.returnValue($q.reject({ status: -1 }));
          $scope.login();
          $scope.$apply();
          expect($scope.message).toBe('Impossible de joindre le serveur.');
        });
      });
    });
  });
});
