// app/models/accuracy.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var accuracySchema = mongoose.Schema({
  request_id : String,
  percentage : String,
  timestamp : Date
});

// create the model for requests and expose it to our app
module.exports = mongoose.model('Accuracy', accuracySchema);
