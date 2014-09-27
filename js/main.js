OAuth.initialize('2AFykuFEF-15WYcn6d9UHU_d9Fo');
var AUTH_PROMISE = OAuth.callback('twitter');
if (AUTH_PROMISE === undefined) window.location.href = '/login.html';


var tweetsVM = new Vue({
    el: '#content-zone',
    data: {
      tweets: []
    }
});

var queryJsonEachTweets = function queryJsonEachTweets(data) {
  console.log(data);
  var media = data.entities.media[0];
  var usr = data.user;
  return {
    linkToTweet: media.expanded_url,
    tweet: data.text,
    tweetTitle: usr.name /* + '（' + data.user.screen_name + '）' */,
    tweetDescription: data.created_at,
    size: media.sizes.small,
    profilepage: "https://twitter.com/" + usr.screen_name,
    imageUrl: media.media_url
  };
};

window.addEventListener('load', function(e) {
  "use strict";
  var LOCATION = window.location.origin;
  // OAuth.redirect('twitter', 'main.html');
  // OAuth.popup('twitter', {cache: true})
  AUTH_PROMISE
    .done(function(result) {
      //use result.access_token in your API request
      //or use result.get|post|put|del|patch|me methods (see below)
      console.log(result);
      result.get('/1.1/search/tweets.json?q=' + encodeURIComponent('#ウキヨエ') + ',exclude:retweets')
        .done(function(json) {
          tweetsVM.$data.tweets = json.statuses
            .filter(function(data) { return data.entities.media; })
            .map(queryJsonEachTweets);
        });
    })
    .fail(function (err) {
      console.log(err);
    });

  $('#content-zone').rebox({selector: '.tweet--picture__anchor'});
});

