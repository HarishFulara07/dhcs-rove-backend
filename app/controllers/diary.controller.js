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
            res.status(500).send({msg: "Some error occurred while saving diary.", res: false});
        } else if (isImageUploadFailed) {
            res.status(514).send({msg: "Diary saved but failed to save cover picture.", diary_id: diary._id, res: false});
        } else {
            res.status(200).send({msg: "Diary saved successfully.", diary_id: diary._id, res: true});
        }
    });
};

// Create a default diary.
exports.createDefaultDiary = function (req, res) {
    var userId = req.params.userId;
    var diaryTitle = "New Diary";
    var diaryVisibility = 1;
    var diary;

    // Insert the diary details in the DB.
    diary = new Diary({user_id: userId, title: diaryTitle,
                visibility: diaryVisibility, cover_photo_name: ""});
    saveDiaryDetailsToDb(res, diary);
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

exports.uploadCoverPicture = function (req, res) {
    console.log(req);
    var imageFileName;
    
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
            // console.log(err);
            // // Insert the diary details in the DB.
            // diary.title = diaryTitle;
            // diary.visibility = diaryVisibility;
            // saveDiaryDetailsToDb(res, diary, true);
            console.log('err');
        } else {
            // // Insert the diary details in the DB.
            // diary.title = diaryTitle;
            // diary.visibility = diaryVisibility;
            // diary.cover_photo_name = imageFileName;
            // saveDiaryDetailsToDb(res, diary);
            console.log("Diary Cover Picture '" + imageFileName + "' uploaded successfully.");
        }
    });
};

// Update a diary.
exports.updateDiary = function (req, res) {
    var diaryId = req.params.diaryId;
    var diaryTitle = req.params.title;
    var diaryVisibility = req.params.visibility;
    var isCoverPicPresent = req.params.isCoverPicPresent;
    var imageFileName;
    var storage;
    console.log(req);

    Diary.findOne({_id: diaryId}, function (err, diary) {
        if (diary == null || diary.length == 0) {
            return res.status(515).send({msg: "Diary doesn't exist.", res: false});
        } else if (isCoverPicPresent == 'true') {
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
                    diary.title = diaryTitle;
                    diary.visibility = diaryVisibility;
                    saveDiaryDetailsToDb(res, diary, true);
                } else {
                    // Insert the diary details in the DB.
                    diary.title = diaryTitle;
                    diary.visibility = diaryVisibility;
                    diary.cover_photo_name = imageFileName;
                    saveDiaryDetailsToDb(res, diary);
                    console.log("Diary Cover Picture '" + imageFileName + "' uploaded successfully.");
                }
            });
        } else {
            // Insert the diary details in the DB.
            diary.title = diaryTitle;
            diary.visibility = diaryVisibility;
            saveDiaryDetailsToDb(res, diary);
        }
    });
};

exports.searchRecentDiaries = function (req, res) {
	var searchQuery = req.params.searchQuery;

	Diary.find({title: {"$regex": searchQuery, "$options": "i" }})
        .sort({_id: -1}).limit(20).exec(function (err, data) {
    	if (data == null || data.length == 0) {
    		res.status(517).send({msg: "No diary found.", res: false});
    	} else {
    		res.status(200).send({msg: "Diaries found.", search_results: data, res: true});
    	}
    });
};

exports.getRecentDiaries = function (req, res) {
    Diary.find({}).sort({_id: -1}).limit(20).exec(function (err, data) {
        if (data == null || data.length == 0) {
            res.status(517).send({msg: "No diary found.", res: false});
        } else {
            res.status(200).send({msg: "Diaries found.", search_results: data, res: true});
        }
    });
};

exports.searchTrendingDiaries = function (req, res) {
    var searchQuery = req.params.searchQuery;

    Diary.find({title: {"$regex": searchQuery, "$options": "i" }})
        .sort({views_count: -1}).limit(20).exec(function (err, data) {
        if (data == null || data.length == 0) {
            res.status(517).send({msg: "No diary found.", res: false});
        } else {
            res.status(200).send({msg: "Diaries found.", search_results: data, res: true});
        }
    });
};

exports.getTrendingDiaries = function (req, res) {
    Diary.find({}).sort({views_count: -1}).limit(20).exec(function (err, data) {
        if (data == null || data.length == 0) {
            res.status(517).send({msg: "No diary found.", res: false});
        } else {
            res.status(200).send({msg: "Diaries found.", search_results: data, res: true});
        }
    });
};

exports.getRandomDiaries = function (req, res) {
    Diary.findRandom().limit(20).exec(function(err, data) {
        if (data == null || data.length == 0) {
            res.status(517).send({msg: "No diary found.", res: false});
        } else {
            res.status(200).send({msg: "Diaries found.", search_results: data, res: true});
        }
    });
};

exports.updateDiaryViewsCount = function(req, res) {
    var diaryId = req.params.diaryId;
    var viewsCount = req.params.viewsCount;

    Diary.findOne({_id: diaryId}, function (err, diary) {
        // Check if the diary exists.
        if (diary == null || diary.length == 0) {
            return res.status(404).send({msg: "Diary doesn't exist.", res: false});
        } else {
            diary.views_count += viewsCount;

            diary.save(function(err, data){
                if(err) {
                    res.status(500).send({msg: "Unable to update view counts.", res: false});
                } else {
                    res.status(200).send({res: true});
                }
            });
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
                return res.status(404).send({msg: "Diary not found with id " + diaryId, res: false});                
            }
            return res.status(500).send({msg: "Could not delete diary with id " + diaryId, res: false});
        }

        if(!diary) {
            return res.status(404).send({msg: "Diary not found with id " + diaryId, res: false});
        }

        res.status(200).send({msg: "Diary deleted successfully!", res: true});
    });
};

// Get diary. It will not return posts inside the diary.
exports.getDiary = function (req, res) {
	var diaryId = req.params.diaryId;
	
	Diary.findOne({_id: diaryId}, function (err, data) {
    	if (data == null || data.length == 0) {
    		res.status(500).send({msg: "Invalid diary id.", res: false});
    	} else {
    		res.status(200).send({msg: "Diary found.", diary: data, res: true});
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
    		res.status(500).send({msg: "Unable to get posts in the diary.", res: false});
    	}
        res.status(200).send({msg: "Posts fetched successfully.", diary: diary, res: true});
        diary.save();
        diary.markModified('post_ids');
    })
};
