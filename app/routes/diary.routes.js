module.exports = function(app) {
    var diary = require('../controllers/diary.controller.js');

    // Creata a diary.
    app.post('/diary/create/:userId/:title/:visibility/:isCoverPicPresent', diary.createDiary);

    // Search diaries.
	app.get('/diary/search/:searchQuery', diary.searchDiaries);

	// Delete diary.
	app.post('/diary/delete/:diaryId', diary.deleteDiary);

	// Get diary with all posts.
	app.get('/diary/posts/:diaryId', diary.getDiaryWithPosts);

	// Get diary. It will not return posts inside the diary.
	app.get('/diary/:diaryId', diary.getDiary);
}
