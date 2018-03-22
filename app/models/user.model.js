var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    // _id is the user_id
    // _id is the default unique id provided by mongoDB
    user_ext_id: {
    	type: String,
    	required: true,
    	unique: true
    },
    password: {
    	type: String,
    	required: false
    }
});

module.exports = mongoose.model('User', UserSchema);
