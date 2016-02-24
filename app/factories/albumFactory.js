'use strict';

angular.module('photo-gallery.albumFactory', ['photo-gallery'])

.factory('albumFactory', ['backendUrl', '$http', function(backendUrl, $http) {
  function returnData(response) {
    return response.data;
  }

  return {
    /**
     * Get a page of the list of all albums sorted by most recent upload date.
     *
     * @param number page The number of the page to get.
     * @return A promise resolving to a list of albums.
     */
    fetchPage: function(page) {
      return $http.get(backendUrl + '/album/list/' + page).then(returnData);
    },

    /**
     * Get an album given it's id.
     *
     * @param number id The id of the album to get.
     * @return A promise resolving to the album object.
     */
    fetchAlbum: function(id) {
      return $http.get(backendUrl + '/album/' + id).then(returnData);
    },

    /**
     * Create a new album
     *
     * @param Object album An object descrbing the album containing title, description, date string
     * and comma-separated list of authors ids properties.
     * @return A promise resolving to the created album.
     */
    postAlbum: function(album) {
      return $http.post(backendUrl + '/album', album).then(returnData);
    },

    searchAlbum: function(term) {
      return $http.get(backendUrl + '/album/search/' + term).then(returnData);
    },

    deleteAlbum: function(id) {
      return $http.delete(backendUrl + '/album/' + id);
    },

    /**
     * Post a comment about an album.
     *
     * @param number id The id of the album to be commented.
     * @param string text The text of the comment.
     * @return A promise resolving to the updated album object.
     */
    postComment: function(id, text) {
      return $http.post(backendUrl + '/album/' + id + '/comment', {
        text: text
      }).then(returnData);
    },

    /**
     * Delete a comment about an album.
     *
     * @param number albumId The id of the album containing the comment.
     * @param number commentId The id of the comment to delete.
     * @return A promise resolving to the http request result.
     */
    deleteComment: function(albumId, commentId) {
      return $http.delete(backendUrl + '/album/' + albumId + '/comment/' + commentId);
    }
  }
}]);
