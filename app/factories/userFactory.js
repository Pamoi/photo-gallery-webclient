'use strict';

angular.module('photo-gallery.userFactory', [])

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

        if (user) {
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
       * @return string A promise resolving to the API token
       */
      authenticate: function(usr, pwd) {
        return $http.post(backendUrl + '/authenticate', {
          username: usr,
          password: pwd
        }).then(function(response) {
          return response.data.token;
        });
      }
    }
  }
]);
