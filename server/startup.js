'use strict';

Meteor.startup(function () {

  const T = new TwitMaker({
    consumer_key:         Meteor.settings.twitterApp.consumer.key, 
    consumer_secret:      Meteor.settings.twitterApp.consumer.secret,
    access_token:         Meteor.settings.twitterApp.access_token.key, 
    access_token_secret:  Meteor.settings.twitterApp.access_token.secret
  });

  // var raleigh = ['-79.1805267334', '35.574682601', '-78.3620452881', '36.0990476632'];
  let stream = T.stream('statuses/filter', { follow: ['20647123', '108853393'] });

  stream.on('tweet', Meteor.bindEnvironment(function (tweet) {
    tweet.created_at = new Date( Date.parse(tweet.created_at) );
    
    console.log(tweet);
    console.log("=======================================");
    
    Tweets.insert(tweet);
  }));
});