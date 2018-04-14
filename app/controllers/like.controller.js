var Like = require('../models/like.model.js');

// Add like on a post.
exports.postAddLike = function (req, res) {
	var postId = req.params.postId;
	var userId = req.params.userId;

	// Insert the like in the DB.
	var like = new Like({post_id: postId, user_id: userId});

    like.save(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while liking the post.", res: false});
        } else {
        	res.status(200).send({msg: "Post liked successfully.", res: true});
        }
    });
};

// Remove like on a post.
exports.postRemoveLike = function (req, res) {
	var postId = req.params.postId;
	var userId = req.params.userId;	

	Like.remove({post_id: postId, user_id: userId}, function (err) {
		if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while unliking the post.", res: false});
        } else {
        	res.status(200).send({msg: "Post unliked successfully.", res: true});
        }
	});
};

// Get number of likes on a post.
exports.getPostNumLikes = function (req, res) {
	var postId = req.params.postId;

	Like.count({post_id: postId}, function (err, count) {
		if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while retrieving likes on the post.", res: false});
        } else {
        	res.status(200).send({msg: "Likes on post retrieved successfully.", n_likes: count, res: true});
        }
	});
};
