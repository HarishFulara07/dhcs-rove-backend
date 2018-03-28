var Profile = require('../models/profile.model.js');

var multer = require('multer');
var path = require('path');

function getProfileImageDir() {
    var profileImageDir = ['/uploads', 'images', 'profile'].join(path.sep);
    return __dirname.split(path.sep).slice(0, -2).join(path.sep) + profileImageDir;
};

function saveProfileDetailsToDb(res, profile, isImageUploadFailed = false) {
    profile.save(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({msg: "Some error occurred while saving profile details."});
        } else if (isImageUploadFailed) {
            res.status(514).send({msg: "Profile name saved but failed to save profile picture."});
        } else {
            res.status(200).send({msg: "Profile details saved successfully."});
        }
    });
};

// Save user's profile details.
exports.saveProfile = function(req, res) {
    var userId = req.params.userId;
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;
    var isProfilePicPresent = req.params.isProfilePicPresent;
    var imageFileName;
    var storage;
    var profile;

    // Check if the user already exists.
    Profile.count({user_id: userId}, function (err, count) {
        if (count > 0) {
            return res.status(512).send({msg: "User already exists."});
        } else {
            if (isProfilePicPresent == 'true') {
                // We will use disk storage engine to store uploaded images on disk.
                storage = multer.diskStorage({
                    // Folder where uploaded images will be stored.
                    destination: function(req, file, callback) {
                        callback(null, getProfileImageDir());
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
                        // Insert the profile details in the DB.
                        profile = new Profile({user_id: userId, firstname: firstName,
                            lastname: lastName});
                        saveProfileDetailsToDb(res, profile, true);
                    } else {
                        // Insert the profile details in the DB.
                        profile = new Profile({user_id: userId, firstname: firstName,
                            lastname: lastName, profile_picture_name: imageFileName});
                        saveProfileDetailsToDb(res, profile);
                        console.log("Profile Picture '" + imageFileName + "' uploaded successfully.");
                    }
                });
            } else {
                // Insert the profile details in the DB.
                var profile = new Profile({user_id: userId, firstname: firstName,
                    lastname: lastName});
                saveProfileDetailsToDb(res, profile);
            }
        }
    });
};

// Update user's firstname and lastname.
exports.updateProfileName = function(req, res) {
    var userId = req.params.userId;
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;

    Profile.findOne({user_id: userId}, function (err, profile) {
        // Check if the user exists.
        if (profile == null || profile.length == 0) {
            return res.status(515).send({msg: "User doesn't exist."});
        } else {
            profile.firstname = firstName;
            profile.lastname = lastName;
            console.log(profile.firstname)

            profile.save(function(err, data){
                if(err) {
                    res.status(500).send({msg: "Could not update user's profile name."});
                } else {
                    res.status(200).send({msg: "Profile name successfully updated."});
                }
            });
        }
    });
};

// Update profile picture uploaded by the user.
exports.updateProfilePicture = function(req, res) {
    var userId = req.params.userId;
    var imageFileName;
    var storage;

    Profile.findOne({user_id: userId}, function (err, profile) {
        // Check if the user exists.
        if (profile == null || profile.length == 0) {
            return res.status(515).send({msg: "User doesn't exist."});
        } else {
            // We will use disk storage engine to store uploaded images on disk.
            storage = multer.diskStorage({
                // Folder where uploaded images will be stored.
                destination: function(req, file, callback) {
                    callback(null, getProfileImageDir());
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
                    return res.status(514).send("Failed to update profile picture.");
                } else {
                    profile.profile_picture_name = imageFileName
                    profile.save(function(err, data){
                        if(err) {
                            console.log(err);
                            res.status(500).send({msg: "Could not update user's profile picture."});
                        } else {
                            res.status(200).send({msg: "Profile picture updated successfully."});
                            console.log("Profile Picture '" + imageFileName + "' updated successfully.");
                        }
                    });
                }
            });
        }
    });
};

// Get user profile details.
exports.getProfileInfo = function(req, res) {
    var userId = req.params.userId;

    Profile.findOne({user_id: userId}, function (err, profile) {
        if (err) {
            console.log(err);
            return res.status(500).send({msg: "Could not retrieve user profile."});
        }
        // Check if the user exists.
        if (profile == null || profile.length == 0) {
            res.status(515).send({msg: "User doesn't exist."});
        } else {
            res.status(200).send({msg: "User profile fetched successfully.", profile: profile})
        }
    });
}
