var mongoose = require('mongoose');

var RelationshipSchema = mongoose.Schema({
    user_one_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_two_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
    	type: Number,
    	required: true
    }
}, {
    timestamps: true
});

RelationshipSchema.index({user_one_id: 1, user_two_id: 1}, {unique: true});

module.exports = mongoose.model('Relationship', RelationshipSchema);
