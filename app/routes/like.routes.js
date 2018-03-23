module.exports = function(app) {
    var like = require('../controllers/like.controller.js');

    // Add like on a post.
    app.post('/like/add/:postId/:userId', like.postAddLike);

    // Remove like on a post.
	app.post('/like/remove/:postId/:userId', like.postRemoveLike);

	// Get number of likes on a post.
	app.get('/likes/post/:postId', like.getPostNumLikes);
}
