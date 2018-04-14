var DiaryPostModel = require('../models/diary.post.model.js');
var Post = DiaryPostModel.Post
var Diary = DiaryPostModel.Diary

var multer = require('multer');
var path = require('path');

function getPostPicturesDir() {
    var postPicturesDir = ['/uploads', 'images', 'post'].join(path.sep);
    return __dirname.split(path.sep).slice(0, -2).join(path.sep) + postPicturesDir;
};

function savePostToDb(res, post) {
    post.save(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while saving post.", res: false});
        } else {
            res.status(200).send({msg: "Post saved successfully.", post_id: post._id, res: true});
        }
    });
};

// Update the diary to which user posted.
function updateDiary(diaryId, post) {
    Diary.findOne({_id: diaryId}, function (err, diary) {
        diary.post_ids.push(post);
        diary.save(function(err, data) {});
    });
};

// Create a post.
exports.createPost = function (req, res) {
    var diaryId = req.params.diaryId;
    var postType = req.params.postType;

    if (postType == '1') {  // Pictures post.
        var nPictures = parseInt(req.query.nPictures);
        var picturesDesc = req.query.picturesDesc;
        var picturesName = [];
        var imageFileName;
        var storage;
        var post;

        // We will use disk storage engine to store uploaded images on disk.
        storage = multer.diskStorage({
            // Folder where uploaded images will be stored.
            destination: function(req, file, callback) {
                callback(null, getPostPicturesDir());
            },
            // Name with which an uploaded image will be stored.
            filename: function(req, file, callback) {
                imageFileName = diaryId + '_' + Date.now() + '_' + file.originalname;
                callback(null, imageFileName);
            }
        });

        var upload = multer({storage: storage}).array('image', nPictures);

        upload(req, res, function(err) {
            if (err) {
                console.log(err);
                res.status(514).send({msg: "Post pictures upload failed.", res: false});
            } else {
                for (var i = 0; i < nPictures; i++) {
                    picturesName.push(req.files[i].filename);
                }
                post = new Post({diary_id: diaryId, post_type: postType,
                    pictures_name: picturesName, pictures_desc: picturesDesc});
                savePostToDb(res, post);
                updateDiary(diaryId, post)
                console.log("Post Pictures '" + picturesName + "' uploaded successfully.");
            }
        });
    } else if (postType == '2') {   // Note post.
        var note = req.query.note;
        var post = new Post({diary_id: diaryId, post_type: postType, note: note});

        post.save(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send({msg: "Some error occurred while saving post.", res: false});
            } else {
                updateDiary(diaryId, post)
                res.status(200).send({msg: "Post saved successfully.", post_id: post._id, res: true});
            }
        });
    } else if (postType == '3') {   // Location post.
        var location = req.query.location;
        var post = new Post({diary_id: diaryId, post_type: postType, location: location});

        post.save(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send({msg: "Some error occurred while saving post.", res: false});
            } else {
                updateDiary(diaryId, post)
                res.status(200).send({msg: "Post saved successfully.", post_id: post._id, res: true});
            }
        });
    } else {
        res.status(518).send({msg: "Invalid post type.", res: false});
    }
};

// View a post.
exports.getPost = function (req, res) {
    var postId = req.params.postId;

    Post.findOne({_id: postId}, function (err, data) {
        if (data == null || data.length == 0) {
            res.status(500).send({msg: "Invalid post id.", res: false});
        } else {
            res.status(200).send({msg: "Post found.", post: data, res: true});
        }
    });
};

// Delete a post.
exports.deletePost = function (req, res) {
    var postId = req.params.postId;

    Post.findByIdAndRemove({_id: postId}, function (err, post) {
        if(err) {
            console.log(err);
            if(err.kind === 'ObjectId') {
                return res.status(404).send({msg: "Post not found with id " + postId, res: false});                
            }
            return res.status(500).send({msg: "Could not delete post with id " + postId, res: false});
        }

        if(!post) {
            return res.status(404).send({msg: "Post not found with id " + postId, res: false});
        }

        res.status(200).send({msg: "Post deleted successfully!", res: true});
    });
};
