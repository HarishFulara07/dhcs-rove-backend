module.exports = function(app) {
    var profile = require('../controllers/profile.controller.js');

    // Update user's firstname and lastname.
    app.post('/profile/update/name/:userId/:firstName/:lastName', profile.updateProfileName);

    // Update profile picture uploaded by the user.
    app.post('/profile/update/picture/:userId', profile.updateProfilePicture);

    // Save user's profile details.
    app.post('/profile/:userId/:firstName/:lastName/:isProfilePicPresent', profile.saveProfile);

    // Get user profile details.
    // app.get('/profile/:userId', profile.getProfileInfo);

    // TODO
    // Get user profile details from diary.
    // Get user profile ddtails from post.
}
