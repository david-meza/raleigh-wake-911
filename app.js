if (Meteor.isClient) {
 
  // This code only runs on the client
  angular.module('simple-todos',['angular-meteor']);
 
  angular.module('simple-todos').controller('TodosListCtrl', ['$scope',
    function ($scope) {
 
      $scope.tasks = [
        { text: 'This is task 1' },
        { text: 'This is task 2' },
        { text: 'This is task 3' }
      ];
 
  }]);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var stream = T.stream('statuses/filter', { follow: 'rw911' })
  
    stream.on('tweet', function (tweet) {
      console.log(tweet)
    })
  });
}