T = new TwitMaker({
    consumer_key:         Meteor.settings.twitterApp.consumer.key, 
    consumer_secret:      Meteor.settings.twitterApp.consumer.secret,
    access_token:         Meteor.settings.twitterApp.access_token.key, 
    access_token_secret:  Meteor.settings.twitterApp.access_token.secret
});