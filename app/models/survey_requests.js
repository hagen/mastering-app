// app/models/survey_request.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var requestSchema = mongoose.Schema({
  timestamp : Date,
  count : Number,
  names : String
});

// create the model for requests and expose it to our app
module.exports = mongoose.model('SurveyRequest', requestSchema);
