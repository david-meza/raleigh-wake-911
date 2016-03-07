'use strict';

angular.module('rw911').controller('tweetsCtrl', ['$scope', 'mapService',
  function ($scope, mapService) {

    $scope.helpers({
      tweets: function() {
        return Tweets.find({}, {sort: {created_at: -1}});
      }
    });

    var location = {
      coords: {
        latitude: 35.79741992502266, 
        longitude: -78.64118938203126
      }
    };

    $scope.map = {
      zoom: 13,
      location: location,
      control: {},
      events: {},
      bounds: {
        northeast: {
          longitude: -78.336890,
          latitude: 36.113561
        },
        southwest: {
          latitude: 35.437814,
          longitude: -78.984583
        }
      },
      options: {
        disableDefaultUI: true,
        draggable: true,
        scrollwheel: false,
        minZoom: 9,
        tilt: 0,
        zoomControl: true,
        zoomControlOptions: {
          position: 6,
          style: 1,
        },
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
          position: 6
        },
        rotateControl: false,
        panControl: false
      },
    };

}]);