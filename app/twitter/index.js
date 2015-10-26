// Need twitter
var Twitter = require('twitter');
// load up the user model
var Person = require('../models/person');
var tweets = [
  "BoothBot: mooooooooore jelly beans! Cheers [name]! @masteringsap #BSE2015 #ba15",
  "BoothBot: LET THERE BE CANDY. Enjoy [name]! @masteringsap #BSE2015 #ba15",
  "BoothBot: Thanks for stopping by [name] @masteringsap #BSE2015 #ba15",
  "BoothBot: Candy, candy, candy, [name], candy @masteringsap #BSE2015 #ba15",
  "BoothBot: I still have too many jelly beans [name] @masteringsap #BSE2015 #ba15",
  "BoothBot: Step 1, Survey; Step 2, Magic; Step 3, Jelly Beans for [name]! @masteringsap #BSE2015 #ba15",
  "BoothBot: Thank you [name] - enjoy your JBs @masteringsap #BSE2015 #ba15",
  "BoothBot: That ought to keep you going [name] - nice to have met you @masteringsap #BSE2015 #ba15",
  "BoothBot: Bursting at the jelly bean seams @masteringsap #BSE2015 #ba15",
  "BoothBot: [name], wonderful to have met your hand @masteringsap #BSE2015 #ba15",
  "BoothBot: Everyone! [name] has jelly beans. Just sayin' @masteringsap #BSE2015 #ba15",
  "BoothBot: Sugar hit in 5, 4, 3, 2, 1 [name]! @masteringsap #BSE2015 #ba15",
  "BoothBot: You may well win yourself an Apple Watch [name]! @masteringsap #BSE2015 #ba15 #watch @apple",
  "BoothBot: Thanks for taking our cool survey [name] (it's way cool) @masteringsap #BSE2015 #ba15",
  "BoothBot: 01000010011001010110000101101110001011010110000101110010011000010110110101100001 @masteringsap #BSE2015 #ba15",
  "BoothBot: Internet jelly beans for [name]! You're very welcome! @masteringsap #BSE2015 #ba15",
  "BoothBot: Forefront made me. Maybe thay can make you something [name]?! @masteringsap #BSE2015 #ba15",
  "BoothBot: Forefront Analytics - dispensing jelly beans over the interwebs since... a day ago @masteringsap #BSE2015 #ba15",
  "BoothBot: [name], I can see a cute tablet over the way. Could you introduce me? @masteringsap #BSE2015 #ba15",
  "BoothBot: Great to see you [name], enjoy those blue and green jules of joy @masteringsap #BSE2015 #ba15"
];

module.exports = function(app) {
  app.get('/twitter/post/:request_id', function(req, res) {
    // When this GET endpoint is called, it triggers a refresh of the survey
    // results in to the database, which we then use to populate the dashboard

    // only read most recent request
    Person.find({ request_id : req.params.request_id }, function(err, people) {

      var names = [];
      people.forEach(function(person, i) {
        names.push(person.name);
      });

      if (names.length === 0) {
        return res.json({ msg : "0 tweets posted" });
      }

      // Now connect to twitter, and post for each of the peeples.
      var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      });

      // For each of the names, we'll post a new tweet. We shouldn't run into
      // rate limiting, as we're not doing THAT many.
      var errors = [];
      names.forEach(function(name, index) {

        client.post('statuses/update', {status: randomTweet(name)},  function(error, tweet, response){
          if(error) {
            errors.push(error);
          }
          console.log(tweet);  // Tweet body.
          console.log(response);  // Raw response object.
        });
      });

      // return response.
      if (errors.length === 0) {
        res.json({
          status : "success",
          message : names.length + " tweet(s) sent"
        });
      } else {
        res.json({
          status : "error",
          message : errors.length + " errors encountered",
          errors : errors
        });
      }
    });
  });
}

/**
 * Picks a random tweet, replaces the name, and returns the tweet status
 * update string.
 * @param  {String} name The surveyed person's name
 * @return {String}      The tweet content
 */
function randomTweet(name) {
  return tweets[Math.floor(Math.random() * 20)].replace("[name]", name);
}
