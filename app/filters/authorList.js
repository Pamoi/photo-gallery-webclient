'use strict';

angular.module('photo-gallery.authorList', []).filter('authorList', function() {
  return function(input) {
    if (!input) {
      return '';
    }
    
    var authors = angular.copy(input);

    var author = authors.shift().username;
    var authorNames = authors.map(function(u) {
      return u.username;
    });

    var end = authorNames.length == 0 ? '' : ' avec ' + authorNames.join(', ');

    return author + end;
  };
});
