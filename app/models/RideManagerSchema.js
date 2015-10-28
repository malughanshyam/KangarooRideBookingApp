// Mongoose Model/Schema for AdHocJob Collection
var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_id				: String,
    availableRides 	: [String],
    allowedRidesPerSlot : Number,
    CreatedTimeStamp: { type: Date, default:Date.now }
});

module.exports = mongoose.model('RideManager', schema, 'RideManager');