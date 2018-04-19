var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// create express app
var app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ 
	extended: true,
	parameterLimit: 100000,
    limit: '50mb'
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Directory containing images.
var imagesDir = require('path').join(__dirname, '/uploads');
app.use(express.static(imagesDir));

// Configuring the database
var dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url);

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})

// Define the default route
app.get('/', function(req, res){
    res.json({"message": "Welcome to Rove..."});
});

// Require Rove routes
require('./app/routes/user.routes.js')(app);
require('./app/routes/profile.routes.js')(app);
require('./app/routes/like.routes.js')(app);
require('./app/routes/diary.routes.js')(app);
require('./app/routes/post.routes.js')(app);
require('./app/routes/comment.routes.js')(app);
require('./app/routes/relationship.routes.js')(app);
require('./app/routes/bookmark.routes.js')(app);

// listen for requests
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is listening on port 3000");
});
