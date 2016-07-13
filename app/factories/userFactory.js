'use strict';

angular.module('photo-gallery.userFactory', ['photo-gallery.config'])

.factory('userFactory', ['backendUrl', '$http', '$rootScope', function(backendUrl, $http, $rootScope) {
  return {
      /**
       * Loads the locally stored logged in user and loads it into the application.
       *
       * @return Object|null The stored user if present
       */
      load: function() {
        var userJson = window.localStorage.getItem('photo-gallery.user');

        if (userJson) {
          var user = angular.fromJson(userJson);
          $rootScope.user = user;

          if (user && user.token) {
            $http.defaults.headers.common['X-AUTH-TOKEN'] = user.token;
          }

          return user;
        }

        return null;
      },

      /**
       * Saves locally the user object and updates it in the application.
       *
       * @param Object user The user object to save
       */
      save: function(user) {
        window.localStorage.setItem('photo-gallery.user', angular.toJson(user));
        $rootScope.user = user;

        if (user && user.token) {
          $http.defaults.headers.common = { 'X-AUTH-TOKEN' : user.token };
        } else {
          $http.defaults.headers.common = {};
        }
      },

      /**
       * Authenticates to the server and returns a promise of the API token.
       *
       * @param string usr The username
       * @param string pwd The password
       *
       * @return A promise resolving to the authenticated user
       */
      authenticate: function(usr, pwd) {
        return $http.post(backendUrl + '/authenticate', {
          username: usr,
          password: pwd
        }).then(function(response) {
          return response.data;
        });
      },

      /**
       * Changes the password for a user.
       *
       * @param string usr The username of the user that wishes to change it's password
       * @param string oldPass The current password of the user
       * @param string newPass The new password of the user
       *
       * @return A promise resolving the the server's response
       */
      setPassword: function(usr, oldPass, newPass) {
        return $http.post(backendUrl + '/password', {
          username: usr,
          oldPass: oldPass,
          newPass, newPass
        });
      },

      /**
       * Gets a list of all registered users.
       *
       * @return A promise resolving to a list of user objects
       */
      getUserList: function() {
        return $http.get(backendUrl + '/user/list').then(function(response) {
          return response.data;
        });
      }
    }
  }
]);
