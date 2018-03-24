module.exports = function(app) {
    var comment = require('../controllers/comment.controller.js');

    // Add comment on a post.
    app.post('/comment/add/:postId/:userId/:comment', comment.postAddComment);

    // Remove comment from a post.
	app.post('/comment/remove/:commentId', comment.postRemoveComment);

	// Get all comments on a post.
	app.get('/comments/post/:postId', comment.getPostComments);	
}
