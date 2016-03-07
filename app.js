if (Meteor.isClient) {

  Meteor.subscribe("tweets");
 
  // This code only runs on the client
  angular.module('rw911',['angular-meteor', 'ngMaterial', 'uiGmapgoogle-maps', 'ngStorage']);
 
  angular.module('rw911').controller('tweetsCtrl', ['$scope',
    function ($scope) {
 
      $scope.helpers({
        tweets() {
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

  angular.module('rw911').config(['uiGmapGoogleMapApiProvider', function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        signed_in: true,
        v: '3.22',
        libraries: 'places'
    });
  }]);

  angular.module('rw911').factory('geocoderService', ['$q', '$timeout', 'uiGmapGoogleMapApi', '$localStorage',
    function ($q, $timeout, mapsApi, $localStorage) {
    

    var locations = $localStorage.locations ? JSON.parse($localStorage.locations) : {};
    var queue = [];
    var geocoder;
    
    // Assign the google.maps object when the API is ready
    var google = {};
    mapsApi.then( function (maps) {
      google.maps = maps;
      geocoder = new google.maps.Geocoder();
      geocodeNextAddress();
    });

    // Amount of time (in milliseconds) to pause between each trip to the
    // Geocoding API, which places limits on frequency.
    var QUERY_PAUSE = 250;

    /**
     * geocodeNextAddress() - execute the next function in the queue.
     *                  If a result is returned, fulfill the promise.
     *                  If we get an error, reject the promise (with message).
     *                  If we receive OVER_QUERY_LIMIT, increase interval and try again.
     */
    var geocodeNextAddress = function () {
      if (!geocoder) { return $timeout(geocodeNextAddress, QUERY_PAUSE); }
      // Don't do anything if there aren't any tasks left
      if (!queue.length) { return; }

      // Get the next task (though not shift from queue yet, until it is finally resolved)
      var task = queue[0];

      // If we already processed this address return the stored results and go on to the next item in the queue
      if (locations.hasOwnProperty(task.address)) {
        console.log('location was stored', task.address, locations[task.address]);
        queue.shift();
        task.d.resolve(locations[task.address]);
        if (queue.length) { return geocodeNextAddress(); }

      // Otherwise get the results from the geocoder service
      } else {
        console.log('hitting the API for', task.address);
        geocoder.geocode({ address : task.address }, function (result, status) {

          // Resolve the promise with the results and reset the pause to the default
          if (status === google.maps.GeocoderStatus.OK) {

            var parsedResult = {
              lat: result[0].geometry.location.lat(),
              lng: result[0].geometry.location.lng(),
              formattedAddress: result[0].formatted_address
            };
            
            locations[task.address] = parsedResult;
            $localStorage.locations = JSON.stringify(locations);
            task.d.resolve(parsedResult);
            QUERY_PAUSE = 250;

          // Increase the pause up to 1s intervals and keep trying...
          } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            QUERY_PAUSE = (QUERY_PAUSE < 1000) ? QUERY_PAUSE + 250 : 1000;

          // Reject any other result
          } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
            task.d.reject({
              type: 'zero',
              message: 'Zero results for geocoding address ' + task.address
            });
          } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
            task.d.reject({
              type: 'denied',
              message: 'Request denied for geocoding address ' + task.address
            });
          } else {
            task.d.reject({
              type: 'invalid',
              message: 'Invalid request for geocoding: status=' + status + ', address=' + task.address
            });
          }

          // Remove from queue if the promise has been resolved or rejected
          if (status !== google.maps.GeocoderStatus.OVER_QUERY_LIMIT) { queue.shift(); }

          // Go on to the next item in the queue
          if (queue.length) { $timeout(geocodeNextAddress, QUERY_PAUSE); }    
        });
      }


    };

    // Publically available function to push addresses to the queue. Returns the promise so it can be chained with .then
    var getLatLng = function (address) {
      var d = $q.defer();

      queue.push({
        address: address,
        d: d
      });

      if (queue.length === 1) { geocodeNextAddress(); }

      return d.promise;
    };

    
    return {
      getLatLng : getLatLng
    };


  }]);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var raleigh = ['-79.1805267334', '35.574682601', '-78.3620452881', '36.0990476632'];
    var stream = T.stream('statuses/filter', { follow: ['20647123', '108853393'] })
  
    stream.on('tweet', Meteor.bindEnvironment(function (tweet) {
      var userName = tweet.user.name;
      var userLocation = tweet.user.location;
      var userUrl = tweet.user.url;
      var userScreenName = tweet.user.screen_name;
      var profileImg = tweet.user.profile_image_url;
      var userTweet = tweet.text;
      tweet.created_at = new Date( Date.parse(tweet.created_at) );
      var tweetDate = tweet.created_at;
      
      console.log(tweet);
      console.log(userScreenName + " (" + userName + ")" + " said " + userTweet + " at " + tweetDate);
      console.log("=======================================");
      Tweets.insert(tweet);
    }))
  });
}