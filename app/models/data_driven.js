// app/models/data_driven.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var dataSchema = mongoose.Schema({
  request_id : String,
  answer : String,
  timestamp : Date
});

// create the model for requests and expose it to our app
module.exports = mongoose.model('DataDriven', dataSchema);
