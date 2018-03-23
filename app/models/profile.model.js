var mongoose = require('mongoose');

var ProfileSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    profile_picture_name: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);
