// app/api/data_driven.js
var DataDriven = require("../models/data_driven");

module.exports = function(app) {

  app.get('/api/data_driven', function(req, res) {

    // Declare challenges array
    var temp = {};

    // Now we need to process the challenges - this is a collection
    // so we're just going to drop the whole lot in as yes/no answers
    DataDriven.aggregate({ "$group" : { "_id" : "$answer", "count" : { "$sum" : 1 } } }, function (err, results) {

      var answers = [];
      results.forEach(function(result, i) {
        answers.push({
          statement : result._id,
          count : result.count,
        });
      });

      // Now we'll make sure there's an entry for all ratings. If one is missing,
      // we fill with zero
      res.json({ data_driven : answers });
    });
  });
};
