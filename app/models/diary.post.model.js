var mongoose = require('mongoose');
var random = require('mongoose-random');

var PostSchema = mongoose.Schema({
    // _id is the post_id
    // _id is the default unique id provided by mongoDB
    diary_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    post_type: {
        type: Number,
        required: true
    },
    pictures_name: [String],
    pictures_desc: String,
    note: String,
    location: String
}, {
    timestamps: true
});

var DiarySchema = mongoose.Schema({
    // _id is the diary_id
    // _id is the default unique id provided by mongoDB
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cover_photo_name: String,
    post_ids: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    visibility: Number,
    views_count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

DiarySchema.plugin(random, {path: 'r'});

module.exports.Post = mongoose.model('Post', PostSchema);
module.exports.Diary = mongoose.model('Diary', DiarySchema);
