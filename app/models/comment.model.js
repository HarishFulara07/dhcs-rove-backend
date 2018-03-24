var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    comment: {
    	type: String,
    	required: true
    }
}, {
    timestamps: true
});

CommentSchema.index({post_id: 1});

module.exports = mongoose.model('Comment', CommentSchema);
