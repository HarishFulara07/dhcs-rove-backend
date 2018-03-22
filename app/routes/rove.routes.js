module.exports = function(app) {
    var user = require('../controllers/user.controller.js');

    // Signs up a user in Rove.
    app.post('/user/signup/:userExtId/:password', user.signup);

    // Login a user into Rove.
    app.post('/user/login/:userExtId/:password', user.login);    
}
