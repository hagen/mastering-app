// app/api/accuracy.js
var Accuracy = require("../models/accuracy");

module.exports = function(app) {

  app.get('/api/accuracy', function(req, res) {

    // Declare challenges array
    var temp = {};

    // Now we need to process the challenges - this is a collection
    // so we're just going to drop the whole lot in as yes/no answers
    Accuracy.aggregate({ "$group" : { "_id" : "$percentage", "count" : { "$sum" : 1 } } }, function (err, results) {

      var answers = [];
      results.forEach(function(result, i) {
        answers.push({
          percentage : result._id,
          count : result.count,
        });
      });

      // Now we'll make sure there's an entry for all ratings. If one is missing,
      // we fill with zero
      res.json({ accuracy : answers });
    });
  });
};
