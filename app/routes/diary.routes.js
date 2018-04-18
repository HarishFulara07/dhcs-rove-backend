module.exports = function(app) {
    var diary = require('../controllers/diary.controller.js');

    // Create default diary.
    app.post('/diary/create/default/:userId', diary.createDefaultDiary);

    // Create a diary.
    app.post('/diary/create/:userId/:title/:visibility/:isCoverPicPresent', diary.createDiary);

    // Upload image.
    app.post('/diary/uploadcoverpicture', diary.uploadCoverPicture);

    // Update a diary.
    app.post('/diary/update/:diaryId/:title/:visibility/:isCoverPicPresent', diary.updateDiary);

    // Update view count on a diary.
    app.post('/diary/views/:diaryId/:viewsCount', diary.updateDiaryViewsCount);

    // Search trending diaries.
	app.get('/diary/search/trending/:searchQuery', diary.searchTrendingDiaries);

    // Get top 20 recent diaries.
    app.get('/diary/recent/', diary.getRecentDiaries);

    // Search recent diaries.
    app.get('/diary/search/recent/:searchQuery', diary.searchRecentDiaries);

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
