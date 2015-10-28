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
    RideDateSelected 	: Date,
    RideTimeSelected 	: String,
    SpecialNeeds    : String,    
    SubmittedByIP   : String,
    CreatedTimeStamp: { type: Date, default:Date.now },
    UpdatedTimeStamp: { type: Date, default:Date.now }
});

schema.index({ Email: 1, FirstName: 1, LastName: 1 }, { unique: true });
module.exports = mongoose.model('ReservationsSchema', schema, 'ReservationsSchema');
