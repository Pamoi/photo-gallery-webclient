/*
This is an adapted version of the angular-img-http-src library available at

https://github.com/dougmoscrop/angular-img-http-src

and published under the following licence:

The MIT License (MIT)

Copyright (c) 2014 Doug Moscrop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

(function () {
  'use strict';
  /*global angular, Blob, URL */
  
  angular.module('photo-gallery.httpSrc', [
  ]).directive('httpSrc', ['$http', function ($http) {
    return {
      scope: {},
      link: function ($scope, elem, attrs) {
        function revokeObjectURL() {
          if ($scope.objectURL) {
            URL.revokeObjectURL($scope.objectURL);
          }
        }

        $scope.$watch('objectURL', function (objectURL) {
          elem.attr('src', objectURL);
        });

        $scope.$on('$destroy', function () {
          revokeObjectURL();
        });

        attrs.$observe('httpSrc', function (url) {
          revokeObjectURL();

          if(url && url.indexOf('data:') === 0) {
            $scope.objectURL = url;
          } else if(url) {
            $http.get(url, { responseType: 'arraybuffer' })
            .then(function (response) {
              var blob = new Blob(
                [ response.data ],
                { type: response.headers('Content-Type') }
              );
              $scope.objectURL = URL.createObjectURL(blob);
            });
          }
        });
      }
    };
  }]);
}());
