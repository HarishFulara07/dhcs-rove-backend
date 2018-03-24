var Relationship = require('../models/relationship.model.js');

// Create relationship request.
exports.create = function (req, res) {
	var userOneId = req.params.userOneId;
	var userTwoId = req.params.userTwoId;

	var relationship = new Relationship({user_one_id: userOneId, 
		user_two_id: userTwoId, status: 0});

    relationship.save(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while creating relationship."});
        } else {
        	res.status(200).send({msg: "Relationship created successfully."});
        }
    });
};

// Update relationship request.
exports.update = function (req, res) {
	var userOneId = req.params.userOneId;
	var userTwoId = req.params.userTwoId;
	var status = req.params.status;

	Relationship.findOne({user_one_id: userOneId, user_two_id: userTwoId}, function (err, rel) {
        if (err) {
        	console.log(err);
            res.status(500).send({msg: "Some error occurred while finding relationship."});
        } else {
        	rel.status = status;
        	rel.save(function(err, data) {
        		if (err) {
        			console.log(err);
            		res.status(500).send({msg: "Some error occurred while updating relationship."});
        		} else {
        			res.status(200).send({msg: "Relationship updated successfully."});
        		}
        	});
        }
    });
};

// Delete relationship request.
exports.delete = function (req, res) {
	var userOneId = req.params.userOneId;
	var userTwoId = req.params.userTwoId;

	Relationship.remove({user_one_id: userOneId, user_two_id: userTwoId}, function (err) {
		if (err) {
			console.log(err);
            res.status(500).send({msg: "Some error occurred while deleting relationship."});
		} else {
			res.status(200).send({msg: "Relationship deleted successfully."});
		}
	});
};

// View all relationship requests that user has received.
exports.requestsRecv = function (req, res) {
	var userId = req.params.userId;

	Relationship.find({user_two_id: userId}, function (err, data) {
        if (err) {
        	console.log(err);
            res.status(500).send({msg: "Some error occurred."});
        } else {
       		res.status(200).send({msg: "Got relationship requests.", requests_recv: data});	
       	}
    });
};

// View all relationship requests that user has sent.
exports.requestsSent = function (req, res) {
	var userId = req.params.userId;

	Relationship.find({user_one_id: userId}, function (err, data) {
        if (err) {
        	console.log(err);
            res.status(500).send({msg: "Some error occurred."});
        } else {
       		res.status(200).send({msg: "Got relationship requests.", requests_sent: data});	
       	}
    });
};

// View all followers.
exports.getFollowers = function (req, res) {
	var userId = req.params.userId;

	Relationship.find({user_two_id: userId, status: 1}, function (err, data) {
        if (err) {
        	console.log(err);
            res.status(500).send({msg: "Some error occurred."});
        } else {
       		res.status(200).send({msg: "Got followers.", followers: data});	
       	}
    });
};

// View all followings.
exports.getFollowings = function (req, res) {
	var userId = req.params.userId;

	Relationship.find({user_one_id: userId, status: 1}, function (err, data) {
        if (err) {
        	console.log(err);
            res.status(500).send({msg: "Some error occurred."});
        } else {
       		res.status(200).send({msg: "Got followings.", followings: data});	
       	}
    });
};
