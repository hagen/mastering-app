// app/models/survey_request.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var personSchema = mongoose.Schema({
  request_id : String,
  name : String,
  position :  String,
  mobile : String,
  timestamp : Date
});

// create the model for requests and expose it to our app
module.exports = mongoose.model('Person', personSchema);
