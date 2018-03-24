module.exports = function(app) {
    var relationship = require('../controllers/relationship.controller.js');

    // Create relationship request.
    app.post('/relationship/create/:userOneId/:userTwoId', relationship.create);

    // Update relationship request.
	app.post('/relationship/update/:userOneId/:userTwoId/:status', relationship.update);

    // Delete relationship request.
	app.post('/relationship/delete/:userOneId/:userTwoId', relationship.delete);

	// View all relationship requests that user has received.
	app.get('/relationship/requests/recv/:userId', relationship.requestsRecv);

	// View all relationship requests that user has sent.
	app.get('/relationship/requests/sent/:userId', relationship.requestsSent);

	// View all followers.
	app.get('/relationship/followers/:userId', relationship.getFollowers);	

	// View all followings.
	app.get('/relationship/followings/:userId', relationship.getFollowings);
}
