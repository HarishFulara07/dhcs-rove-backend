module.exports = function(app) {
    var bookmark = require('../controllers/bookmark.controller.js');

    // Bookmark a diary.
    app.post('/bookmark/add/:diaryId/:userId', bookmark.diaryBookmark);

    // Remove bookmark from a diary.
    app.post('/bookmark/remove/:diaryId/:userId', bookmark.diaryUnbookmark);

    // Get bookmarks for the user.
    app.get('/bookmark/:userId', bookmark.getBookmarks);
}
