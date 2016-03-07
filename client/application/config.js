(function() {

  'use strict';

  Meteor.subscribe("tweets");
  
  angular.module('rw911')
    .config(['uiGmapGoogleMapApiProvider', function (uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          signed_in: true,
          v: '3.22',
          libraries: 'places'
      });
    }]);

})();