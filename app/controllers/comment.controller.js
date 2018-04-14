var Comment = require('../models/comment.model.js');

// Add comment on a post.
exports.postAddComment = function (req, res) {
	var postId = req.params.postId;
	var userId = req.params.userId;
    var commentText = req.params.comment;

	// Insert the comment in the DB.
	var comment = new Comment({post_id: postId, user_id: userId, comment: commentText});

    comment.save(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while commenting on the post.", res: false});
        } else {
        	res.status(200).send({msg: "Commented on post successfully.", comment_id: data._id, res: true});
        }
    });
};

// Remove comment from a post.
exports.postRemoveComment = function (req, res) {
	var commentId = req.params.commentId;

	Comment.remove({_id: commentId}, function (err) {
		if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while uncommenting on the post.", res: false});
        } else {
        	res.status(200).send({msg: "Post uncommented successfully.", res: true});
        }
	});
};

// Get all comments on a post.
exports.getPostComments = function (req, res) {
	var postId = req.params.postId;

	Comment.find({post_id: postId}, function (err, data) {
		if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while retrieving comments on the post.", res: false});
        } else {
        	res.status(200).send({msg: "Comments on post retrieved successfully.", comments: data, res: true});
        }
	});
};
