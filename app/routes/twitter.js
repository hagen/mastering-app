module.exports = function(app) {
  // middleware specific to this router
  app.use(function timeLog(req, res, next) {
    console.log('Twitter API initialised @', Date.now());
    next();
  });

  // Hand off to twitter handler
  require("../twitter");
}
