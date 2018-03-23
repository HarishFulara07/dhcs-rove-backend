var User = require('../models/user.model.js');

// Signs up a user in Rove.
exports.appSignup = function(req, res) {
    var userExtId = req.params.userExtId;
    var password = req.params.password;

    // Check if the user is already signed up.
    User.count({user_ext_id: userExtId}, function (err, count) {
    	if (count > 0) {
    		return res.status(512).send({msg: "User already signed up."});
    	} else {
    		// Insert the user in the DB.
    		var user = new User({user_ext_id: userExtId, password: password});

		    user.save(function(err, data) {
		        if (err) {
		            console.log(err);
		            res.status(500).send({msg: "Some error occurred while signing up."});
		        } else {
		        	// Send user id back to the client.
		        	// This will be used by the client for future calls to the database.
		        	res.status(200).send({msg: "Successfully signed up.", user_id: data._id});
		        }
		    });
    	}
    });
};

// Signs up a user in Rove.
exports.fbSignup = function(req, res) {
    var userExtId = req.params.userExtId;

    // Check if the user is already signed up.
    User.count({user_ext_id: userExtId}, function (err, count) {
        if (count > 0) {
            return res.status(512).send({msg: "User already signed up."});
        } else {
            // Insert the user in the DB.
            var user = new User({user_ext_id: userExtId});

            user.save(function(err, data) {
                if (err) {
                    console.log(err);
                    res.status(500).send({msg: "Some error occurred while signing up."});
                } else {
                    // Send user id back to the client.
                    // This will be used by the client for future calls to the database.
                    res.status(200).send({msg: "Successfully signed up.", user_id: data._id});
                }
            });
        }
    });
};

// Logs in a user in Rove.
exports.login = function(req, res) {
    var userExtId = req.params.userExtId;
    var password = req.params.password;

    // Check if the credentials are valid.
    User.findOne({user_ext_id: userExtId, password: password}, function (err, data) {
    	if (data == null || data.length == 0) {
    		res.status(513).send({msg: "Invalid login credentials."});
    	} else {
    		res.status(200).send({msg: "Successfully logged in.", user_id: data._id});
    	}
    });
}
