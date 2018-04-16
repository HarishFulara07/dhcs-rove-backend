module.exports = function(app) {
    var diary = require('../controllers/diary.controller.js');

    // Creata a diary.
    app.post('/diary/create/:userId/:title/:visibility/:isCoverPicPresent', diary.createDiary);

    // Update view count on a diary.
    app.post('/diary/views/:diaryId/:viewsCount', diary.updateDiaryViewsCount);

    // Search diaries.
	app.get('/diary/search/:searchQuery', diary.searchDiaries);

    // Get top 20 recent diaries.
    app.get('/diary/recent/', diary.getRecentDiaries);

    // Get top 20 trending diaries.
    app.get('/diary/trending/', diary.getTrendingDiaries);

    // Get 20 random diaries.
    app.get('/diary/random/', diary.getRandomDiaries);

	// Delete diary.
	app.post('/diary/delete/:diaryId', diary.deleteDiary);

	// Get diary with all posts.
	app.get('/diary/posts/:diaryId', diary.getDiaryWithPosts);

	// Get diary. It will not return posts inside the diary.
	app.get('/diary/:diaryId', diary.getDiary);
}
