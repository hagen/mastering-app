// app/models/challenges.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var challengesSchema = mongoose.Schema({
  request_id : String,
  data_quality : Boolean,
  user_adoption : Boolean,
  roi : Boolean,
  risk : Boolean,
  cost_efficiency : Boolean,
  self_service : Boolean,
  timestamp : Date
});

// create the model for requests and expose it to our app
module.exports = mongoose.model('Challenges', challengesSchema);
