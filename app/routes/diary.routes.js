module.exports = function(app) {
    var diary = require('../controllers/diary.controller.js');

    // Creata a diary.
    app.post('/diary/create/:userId/:title/:visibility/:isCoverPicPresent', diary.createDiary);

    // Search diaries.
	app.get('/diary/search/:searchQuery', diary.searchDiaries);

	// Get a diary.
	app.get('/diary/:diaryId', diary.getDiary);
}
