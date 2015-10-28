// Mongoose Model/Schema for AdHocJob Collection
var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_id				: String,
    ConfirmationCode : { type: String, index: true },
    Email      	 	: String,
    FirstName     	: String,
    LastName    	: String, 
    PhoneNumber 	: String,
    RideTypeSelected 	: String,
    RideDateSelected 	: String,
    RideTimeSelected 	: String,
    SpecialNeeds    : String,    
    SubmittedByIP   : String,
    CreatedTimeStamp: { type: Date, default:Date.now },
    UpdatedTimeStamp: { type: Date, default:Date.now }
});

schema.index({ Email: 1, FirstName: 1, LastName: 1 }, { unique: true });
schema.index({ RideDateSelected: 1, RideTimeSelected: 1});
schema.index({ RideDateSelected: 1});
module.exports = mongoose.model('Reservations', schema, 'Reservations');
