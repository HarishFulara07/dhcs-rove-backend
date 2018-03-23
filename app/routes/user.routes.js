module.exports = function(app) {
    var user = require('../controllers/user.controller.js');

    // Signs up a user via Rove signup interface.
    app.post('/user/signup/:userExtId/:password', user.appSignup);

    // Signs up a user via Facebook interface.
    app.post('/user/signup/:userExtId', user.fbSignup);

    // Login a user into Rove.
    app.post('/user/login/:userExtId/:password', user.login);    
}
