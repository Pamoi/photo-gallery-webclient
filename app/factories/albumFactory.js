'use strict';

angular.module('photo-gallery.albumFactory', ['photo-gallery.config'])

.factory('albumFactory', ['backendUrl', '$http', function(backendUrl, $http) {
  function returnData(response) {
    return response.data;
  }

  function randomIndex(maxIndex) {
    // return a random number between 0 and maxIndex (exclusive)
    return Math.floor(Math.random() * maxIndex);
  }

  function selectCoverPhotos(album) {
    if (!album.photos) {
      return album;
    }

    if (album.photos.length <= 4) {
      album.coverPhotos = album.photos;
    } else {
      var photos = angular.copy(album.photos);
      album.coverPhotos = [];

      for (var i = 0; i < 4; i++) {
        var index = randomIndex(photos.length);
        album.coverPhotos.push(photos[index]);
        photos.splice(index, 1);
      }
    }

    return album;
  }

  function coverPhotos(albums) {
    if (Array.isArray(albums)) {
      return albums.map(selectCoverPhotos);
    } else {
      return albums;
    }
  }

  return {
    /**
     * Get a page of the list of all albums sorted by most recent upload date.
     *
     * @param number page The number of the page to get.
     * @return A promise resolving to a list of albums.
     */
    fetchPage: function(page) {
      return $http.get(backendUrl + '/album/list/' + page).then(returnData).then(coverPhotos);
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

    /**
     * Updates an album
     *
     * @param Object album An object descrbing the album containing title, description, date string
     * and comma-separated list of authors ids properties.
     * @return A promise resolving to the updated album.
     */
    putAlbum: function(album) {
      return $http.post(backendUrl + '/album/' + album.id, album).then(returnData);
    },

    /**
     * Search for albums whose names are containing a given string.
     *
     * @param String term The string to search for.
     * @return A promise resolving to a list of matching albums.
     */
    searchAlbum: function(term) {
      return $http.get(backendUrl + '/album/search/' + term).then(returnData).then(coverPhotos);
    },

    /**
     * Delete an album
     *
     * @param number The id of the album to delete.
     * @return A promise resolving to the HTTP response from the server.
     */
    deleteAlbum: function(id) {
      return $http.delete(backendUrl + '/album/' + id);
    },

    /**
     * Delete a photo
     *
     * @param number The id of the photo to delete.
     * @return A promise resolving to the HTTP response from the server.
     */
    deletePhoto: function(id) {
      return $http.delete(backendUrl + '/photo/' + id);
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
    },

    /**
     * Get a download token for a given album.
     *
     * @param number albumId The id of the album to download.
     * @return A promise resolving to the download token.
     */
    getDownloadToken: function(albumId) {
      return $http.get(backendUrl + '/album/' + albumId + '/downloadToken').then(function(response) {
        return response.data.token;
      });
    }
  }
}]);
