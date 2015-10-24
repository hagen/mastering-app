// app/api/challenges.js
var Challenges = require("../models/challenges");

module.exports = function(app) {

  app.get('/api/challenges', function(req, res) {

    // Declare challenges array
    var challenges = [];

    // Now we need to process the challenges - this is a collection
    // so we're just going to drop the whole lot in as yes/no answers
    Challenges.count({data_quality : true}, function(err, count) {
      challenges.push({
        challenge : "Data quality",
        count : count
      });
      Challenges.count({user_adoption : true}, function(err, count) {
        challenges.push({
          challenge : "User adoption",
          count : count
        });
        Challenges.count({roi : true}, function(err, count) {
          challenges.push({
            challenge : "ROI",
            count : count
          });
          Challenges.count({risk : true}, function(err, count) {
            challenges.push({
              challenge : "Risk",
              count : count
            });
            Challenges.count({cost_efficiency : true}, function(err, count) {
              challenges.push({
                challenge : "Cost efficiency",
                count : count
              });
              Challenges.count({self_service : true}, function(err, count) {
                challenges.push({
                  challenge : "Self-service",
                  count : count
                });
                res.json({
                  challenges : challenges
                });
              });
            });
          });
        });
      });
    });
  });
};
