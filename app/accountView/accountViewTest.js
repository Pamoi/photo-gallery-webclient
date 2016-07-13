'use strict';

describe('photo-gallery.accountView module', function() {

  beforeEach(module('photo-gallery.accountView'), function($provide) {
    $provide.value('userFactory', {
      setPassword: jasmine.createSpy('setPassword'),
    });

    $provide.value('backendUrl', 'http://test.com');
  });

  var $httpBackend;

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    // Answer template request
    $httpBackend.whenGET('homeView/homeView.html').respond(200, '');
  }));

  describe('accountView controller', function(){

    var $controller, $scope, controller, userFactory, $q;

    beforeEach(inject(function(_$controller_, _$rootScope_, _userFactory_, _$q_) {
      $controller = _$controller_;
      $q = _$q_;
      userFactory = _userFactory_;
      userFactory.setPassword = jasmine.createSpy('setPassword');
      $scope = _$rootScope_.$new();
      $scope.requireLogin = jasmine.createSpy('requireLogin');
      controller = $controller('accountViewCtrl', { $scope: $scope });

      $scope.user = { username: 'Toto' };
      $scope.oldPass = '1234';
      $scope.newPass = '5678';
      $scope.form = {
        oldPass: { $pristine: true },
        newPass: { $pristine: true },
        $valid: true
      };
    }));

    it('should instanciate.', function() {
      expect(controller).toBeDefined();
    });

    it('should require login.', function() {
      expect($scope.requireLogin).toHaveBeenCalledWith('account');
    });

    it('should send a request to backend.', function() {
      userFactory.setPassword.and.returnValue($q.when({data: {message: 'msg'}}));
      $scope.changePassword();
      expect(userFactory.setPassword).toHaveBeenCalledWith('Toto', '1234', '5678');
    });

    it('should display success message.', function() {
      userFactory.setPassword.and.returnValue($q.when({data: {message: 'msg'}}));
      $scope.changePassword();
      $scope.$apply();
      expect($scope.message).toBe('Mot de passe changé avec succès !');
    });

    it('should display error message.', function() {
      userFactory.setPassword.and.returnValue($q.reject({data: {message: 'Invalid username or password.'}}));
      $scope.changePassword();
      $scope.$apply();
      expect($scope.message).toBe('Ancien mot de passe invalide.');
    });

    it('should show spinner.', function() {
      userFactory.setPassword.and.returnValue($q.when({data: {message: 'msg'}}));
      expect($scope.loading).toBeUndefined();
      $scope.changePassword();
      expect($scope.loading).toBe(true);
      $scope.$apply();
      expect($scope.loading).toBe(false);
    });

    it('should not send the request if the form is not valid.', function() {
      $scope.form.$valid = false;
      $scope.changePassword();
      expect(userFactory.setPassword).not.toHaveBeenCalled();
    });
  });
});
