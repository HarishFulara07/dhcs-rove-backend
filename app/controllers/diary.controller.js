var DiaryPostModel = require('../models/diary.post.model.js');
var Diary = DiaryPostModel.Diary

var multer = require('multer');
var path = require('path');

function getDiaryCoverImageDir() {
    var coverImageDir = ['/uploads', 'images', 'cover'].join(path.sep);
    return __dirname.split(path.sep).slice(0, -2).join(path.sep) + coverImageDir;
};

function saveDiaryDetailsToDb(res, diary, isImageUploadFailed = false) {
    diary.save(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while saving diary."});
        } else if (isImageUploadFailed) {
            res.status(514).send({msg: "Diary saved but failed to save cover picture.", diary_id: diary._id});
        } else {
            res.status(200).send({msg: "Diary saved successfully.", diary_id: diary._id});
        }
    });
};

// Create a diary.
exports.createDiary = function (req, res) {
	var userId = req.params.userId;
	var diaryTitle = req.params.title;
	var diaryVisibility = req.params.visibility;
	var isCoverPicPresent = req.params.isCoverPicPresent;
	var imageFileName;
    var storage;
    var diary;

    if (isCoverPicPresent == 'true') {
        // We will use disk storage engine to store uploaded images on disk.
        storage = multer.diskStorage({
            // Folder where uploaded images will be stored.
            destination: function(req, file, callback) {
                callback(null, getDiaryCoverImageDir());
            },
            // Name with which an uploaded image will be stored.
            filename: function(req, file, callback) {
                imageFileName = userId + '_' + Date.now() + '_' + file.originalname;
                callback(null, imageFileName);
            }
        });

        // Create a multer object.
        var upload = multer({storage: storage}).single('image');
        upload(req, res, function(err) {
            if (err) {
                console.log(err);
                // Insert the diary details in the DB.
                diary = new Diary({user_id: userId, title: diaryTitle,
                    visibility: diaryVisibility});
                saveDiaryDetailsToDb(res, diary, true);
            } else {
                // Insert the diary details in the DB.
                diary = new Diary({user_id: userId, title: diaryTitle,
                    visibility: diaryVisibility, cover_photo_name: imageFileName});
                saveDiaryDetailsToDb(res, diary);
                console.log("Diary Cover Picture '" + imageFileName + "' uploaded successfully.");
            }
        });
    } else {
        // Insert the diary details in the DB.
        diary = new Diary({user_id: userId, title: diaryTitle,
                    visibility: diaryVisibility});
        saveDiaryDetailsToDb(res, diary);
    }
};

// Search for diaries.
exports.searchDiaries = function (req, res) {
	var searchQuery = req.params.searchQuery;

	Diary.find({title: {"$regex": searchQuery, "$options": "i" }}, function (err, data) {
    	if (data == null || data.length == 0) {
    		res.status(517).send({msg: "No diary found."});
    	} else {
    		res.status(200).send({msg: "Diaries found.", search_results: data});
    	}
    });
};

// Delete diary.
exports.deleteDiary = function (req, res) {
	var diaryId = req.params.diaryId;

    Diary.findByIdAndRemove({_id: diaryId}, function (err, diary) {
        if(err) {
            console.log(err);
            if(err.kind === 'ObjectId') {
                return res.status(404).send({msg: "Diary not found with id " + diaryId});                
            }
            return res.status(500).send({msg: "Could not delete diary with id " + diaryId});
        }

        if(!diary) {
            return res.status(404).send({msg: "Diary not found with id " + diaryId});
        }

        res.status(200).send({msg: "Diary deleted successfully!"});
    });
};

// Get diary. It will not return posts inside the diary.
exports.getDiary = function (req, res) {
	var diaryId = req.params.diaryId;
	
	Diary.findOne({_id: diaryId}, function (err, data) {
    	if (data == null || data.length == 0) {
    		res.status(500).send({msg: "Invalid diary id."});
    	} else {
    		res.status(200).send({msg: "Diary found.", diary: data});
    	}
    });
};

// Get diary with all posts.
exports.getDiaryWithPosts = function (req, res) {
	var diaryId = req.params.diaryId;

	Diary.findById(diaryId)
    .populate('post_ids')
    .exec((err, diary) => {
    	if (err) {
    		console.log(err);
    		res.status(500).send({msg: "Unable to get posts in the diary."});
    	}
        res.status(200).send({msg: "Posts fetched successfully.", diary: diary});
        diary.save();
        diary.markModified('post_ids');
    })
};
