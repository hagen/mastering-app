// load up the user model
var Person = require('../models/person');

module.exports = function(app) {

  app.get('/sms/send/:request_id', function(req, res) {
    // When this GET endpoint is called, it triggers a refresh of the survey
    // results in to the database, which we then use to populate the dashboard

    // only read most recent request
    Person.find({ request_id : req.params.request_id }, function(err, people) {

      // Declare our Typeform query options
      var options = {
        host : "api.directsms.com.au",
        path : "/s3/rest/sms/send",
        port : 443,
        method : "POST",
        headers : {
          'Content-Type' : 'application/json',
	        'Accept' : 'application/json',
	        'Username' : process.env.DIRECTSMS_USERNAME || "<username>",
	        'Password' : process.env.DIRECTSMS_PASSWORD || "<password>"
        }
      };

      var to = [];
      people.forEach(function(person, i) {
        to.push(person.mobile);
      });

      if (to.length === 0) {
        return res.json({ msg : "0 text messages sent" });
      }

      // Call the API
      var post = require("https").request(options, function(response) {
        var str = "";

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
          str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          // Return response
          res.json(JSON.parse(str));
        });
      });

      // Log
      console.log('Sending SMS to:', to);

      post.write(JSON.stringify({
	    	messageType : "1-way",
	    	senderId : "Forefront",
	    	messageText : "We hope you're enjoying Mastering 2015. Apple Watch winner drawn at ~3.30pm Tuesday. Good luck!",
	    	to: to
	    }));

      post.end();
    });
  });
}
