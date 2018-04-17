var Bookmark = require('../models/bookmark.model.js');

exports.diaryBookmark = function (req, res) {
    var diaryId = req.params.diaryId;
    var userId = req.params.userId;

    var bookmark = new Bookmark({diary_id: diaryId, user_id: userId});

    bookmark.save(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while bookmarking the post.", res: false});
        } else {
            res.status(200).send({res: true});
        }
    });
};

exports.diaryUnbookmark = function (req, res) {
    var diaryId = req.params.diaryId;
    var userId = req.params.userId;

    Bookmark.remove({diary_id: diaryId, user_id: userId}, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while unliking the post.", res: false});
        } else {
            res.status(200).send({res: true});
        }
    });
};

exports.getBookmarks = function (req, res) {
    var userId = req.params.userId;

    Bookmark.find({user_id: userId}, function (err, data) {
        if (data == null || data.length == 0) {
            res.status(517).send({msg: "No bookmarks found.", res: false});
        } else {
            res.status(200).send({bookmarks: data, res: true});
        }
    });
};
