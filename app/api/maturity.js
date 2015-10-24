// app/api/maturity.js
var Maturity = require("../models/maturity");
var Comp = require("../models/competitiveness");

module.exports = function(app) {

  app.get('/api/maturity', function(req, res) {

    // Declare challenges array
    var temp = {};

    // Now we need to process the challenges - this is a collection
    // so we're just going to drop the whole lot in as yes/no answers
    Maturity.aggregate({ "$group" : { "_id" : "$rating", "count" : { "$sum" : 1 } } }, function (err, results) {

      results.forEach(function(result, i) {
        temp[result._id] = { maturity : result.count };
      });

      // Now read in competitiveness and combine with maturity
      Comp.aggregate({ "$group" : { "_id" : "$rating", "count" : { "$sum" : 1 } } }, function (err, results) {

        results.forEach(function(result, i) {
          if(temp[result._id]) {
            temp[result._id] = {
              maturity : temp[result._id].maturity,
              competitiveness : result.count
            };
          } else {
            temp[result._id] = { competitiveness : result.count };
          }
        });

        // Now we can go from 1 to 10, and use 0 or the actual result
        var ratings = [];
        for (var i = 0; i < 10; i++) {
          var ix = i+1;
          if (temp[ix]) {
            ratings.push({
              rating : ix.toString(),
              maturity : temp[ix].maturity ? temp[ix].maturity : 0,
              competitiveness : temp[ix].competitiveness ? temp[ix].competitiveness : 0
            });
          } else {
            ratings.push({
              rating : ix.toString(),
              maturity : 0,
              competitiveness : 0
            });
          }
        }

        // Now we'll make sure there's an entry for all ratings. If one is missing,
        // we fill with zero
        res.json({ maturity_and_comp : ratings });
      });
    });
  });
};
