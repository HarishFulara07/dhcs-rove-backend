var mongoose = require('mongoose');

var LikeSchema = mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

LikeSchema.index({post_id: 1, user_id: 1}, {unique: true});

module.exports = mongoose.model('Like', LikeSchema);
