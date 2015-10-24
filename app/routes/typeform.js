// load up the user model
var SurveyRequest = require('../models/survey_requests');

module.exports = function(app, io) {
  // middleware specific to this router
  app.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

  app.get('/typeform/refresh', function(req, res) {
    // When this GET endpoint is called, it triggers a refresh of the survey
    // results in to the database, which we then use to populate the dashboard

    // only read most recent request
    SurveyRequest.aggregate({ $group: { _id: 1, total: { $sum: "$count" } } }, function(err, results) {

      debugger;
      // Declare our Typeform query options
      var options = {
        host : "api.typeform.com",
        path : "",
        port : 443,
        method : "GET"
      };

      // We now have the most recent request (maybe) - if so, update the request to read only the most recent
      // since we last checked.
      if (results.length > 0) {
        options.path = "/v0/form/" + process.env.TYPEFORM_API_FORM + "?key=" + process.env.TYPEFORM_API_KEY + "&completed=true&offset=" + results[0].total;
      } else {
        options.path = "/v0/form/" + process.env.TYPEFORM_API_FORM + "?key=" + process.env.TYPEFORM_API_KEY + "&completed=true";
      }

      console.log(options);

      // Call the API
      require("https").request(options, function(response) {
        var str = "";
        var msg = {
          status : "BAD",
          request_id : "",
          count : 0,
          names : ""
        };

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
          str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          // We need JSON
          var json = JSON.parse(str);
          var handler = require("../typeform");
          var names = [];

          // If nothing was returned, then the button has been pressed without
          // a survey submission. Naughty.
          if (json.responses.length === 0) {
            io.emit("no surveys processed", msg);
            // Return response
            return res.json(msg);
          }

          // Prepare names of all submissions
          json.responses.forEach(function(r, i, responses) {
            names.push(r.answers.textfield_12057140);
          });

          // Add a request model entry
          var newReq = new SurveyRequest();
          newReq.timestamp = new Date();
          newReq.count = json.responses.length;
          newReq.names = names.join(", ");
          newReq.save(function(err, doc) {

            // update message
            msg.status = "OK";
            msg.request_id = doc.id;
            msg.count = doc.count;
            msg.names = doc.names;

            // Write answers to DB, referencing parent survey
            json.responses.forEach(function(r, i, responses) {
              handler(r.answers, doc.id);
            });

            // Emit a broadcast message to all listeners indicating data is available
            io.emit("surveys processed", msg);

            // Return response
            res.json(msg);
          });
        });
      }).end();
    });
  });
}
