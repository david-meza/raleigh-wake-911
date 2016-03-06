if (Meteor.isClient) {

  Meteor.subscribe("tweets");
 
  // This code only runs on the client
  angular.module('rw911',['angular-meteor', 'ngMaterial']);
 
  angular.module('rw911').controller('tweetsCtrl', ['$scope',
    function ($scope) {
 
      $scope.helpers({
        tweets() {
          return Tweets.find({}, {sort: {createdAt: 1}});
        }
      });
 
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
      var tweetDate = tweet.created_at;
      
      console.log(tweet);
      console.log(userScreenName + " (" + userName + ")" + " said " + userTweet + " at " + tweetDate);
      console.log("=======================================");
      Tweets.insert(tweet);
    }))
  });
}