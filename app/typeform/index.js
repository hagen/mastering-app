// app/typeform/index.js
var Person = require("../models/person");
var Maturity = require("../models/maturity");
var DataDriven = require("../models/data_driven");
var Comp = require("../models/competitiveness");
var Accuracy = require("../models/accuracy");
var Challenges = require("../models/challenges");

module.exports = function(answers, request_id) {

  // An array of answers comes in. We will pull out those we
  // need and update the stored results
  var date = new Date(Date.now());

  // Name answer
  var person = new Person();
  person.request_id = request_id;
  person.name = answers.textfield_12057140;
  person.position =  answers.textfield_12057141;
  person.mobile = "61" + answers.number_12057142; // might need to do some checking here
  person.timestamp = date;
  person.save(function (err) {
    var maturity = new Maturity();
    maturity.request_id = request_id;
    maturity.rating = answers.opinionscale_12057143;
    maturity.timestamp = date;
    maturity.save(function(err) {
      var data = new DataDriven();
      data.request_id = request_id;
      data.answer = answers.list_12057144_choice;
      data.timestamp = date;
      data.save(function (err) {
        var comp = new Comp();
        comp.request_id = request_id;
        comp.rating = answers.rating_12057146;
        comp.timestamp = date;
        comp.save(function(err) {
          var accuracy = new Accuracy();
          accuracy.request_id = request_id;
          accuracy.percentage = answers.list_12058205_choice;
          accuracy.timestamp = date;
          accuracy.save(function (err) {
            // Now we need to process the challenges - this is a collection
            // so we're just going to drop the whole lot in as yes/no answers
            var challenges = new Challenges();
            challenges.request_id = request_id;
            challenges.data_quality = (answers.list_12058057_choice_14932697 ? true : false);
            challenges.user_adoption = (answers.list_12058057_choice_14932698 ? true : false);
            challenges.roi = (answers.list_12058057_choice_14932699 ? true : false);
            challenges.risk = (answers.list_12058057_choice_14932700 ? true : false);
            challenges.cost_efficiency = (answers.list_12058057_choice_14932701 ? true : false);
            challenges.self_service = (answers.list_12058057_choice_14932702 ? true : false);
            challenges.timestamp = date;
            challenges.save(function (err) {
              return;
            });
          });
        })
      });
    });
  });
};
