var mongoose = require('mongoose');

var BookmarkSchema = mongoose.Schema({
    diary_id: {
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

BookmarkSchema.index({diary_id: 1, user_id: 1}, {unique: true});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
