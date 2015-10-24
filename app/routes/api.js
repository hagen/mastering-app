
module.exports = function(app) {
  // middleware specific to this router
  app.use(function timeLog(req, res, next) {
    console.log('API route initialised @ ', Date.now());
    next();
  });

  // Hand off to challenges handler
  require("../api/challenges")(app);

  // Hand off to maturity handler
  require("../api/maturity")(app);

  // Hand off to data driven handler
  require("../api/data_driven")(app);

  // Hand off to accuracy handler
  require("../api/accuracy")(app);
}
