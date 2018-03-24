module.exports = function(app) {
    var post = require('../controllers/post.controller.js');

    // Create a post.
    app.post('/post/create/:diaryId/:postType?', post.createPost);

    // Delete a post.
	app.post('/post/delete/:postId', post.deletePost);

	// View a post.
	app.get('/post/:postId', post.getPost);	
}
