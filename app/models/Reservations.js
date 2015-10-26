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
module.exports = mongoose.model('Reservations', schema, 'Reservations');


/*    RideTypeAvailable = [
      {id: 'JJER', name: 'Jumpy Joey Easy Ride'},
      {id: 'BBDUR', name: 'Big Bounder Down Under Ride'},
      {id: 'DOS', name: 'Deadly Outback Special'}
    ];

    

    RideTimesAvailable = ['08:00a', '08:30a', '09:00a', '09:30a', '10:00a', '10:30a', '11:00a', '11:30a', '12:00p', '12:30p', '01:00p', '01:30p', '02:00p', '02:30p', '03:00p', '03:30p', '04:00p', '04:30p'];
*/
