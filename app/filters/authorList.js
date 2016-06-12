'use strict';

angular.module('photo-gallery.authorList', []).filter('authorList', function() {
  return function(input) {
    if (!input) {
      return '';
    }

    var authors = angular.copy(input);

    var authorNames = authors.map(function(u) {
      return u.username;
    });

    return authorNames.join(', ');
  };
});
