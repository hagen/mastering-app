module.exports = function(app) {
  // middleware specific to this router
  app.use(function timeLog(req, res, next) {
    console.log('SMS lib initialised @', Date.now());
    next();
  });

  // Hand off to sms handler
  require("../sms")(app);
}
