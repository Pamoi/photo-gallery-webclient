'use strict';

angular.module('photo-gallery.albumFactory', [])

.factory('albumFactory', ['backendUrl', '$http', function(backendUrl, $http) {
  return {
    fetchPage: function(page) {
      return $http.get(backendUrl + '/album/list/' + page).then(function(response) {
        return response.data;
      });
    }
  }
}]);
