// Handler functions for the Reservations Module
// Load the Modules
var path = require('path');
var mongoose = require('mongoose');

// Load the loggers
var winston = require('winston');
var log = winston.loggers.get('log');

// Types of Log Levels
// detailLogger.debug("Debug")
// detailLogger.verbose("verbose")
// detailLogger.info("info")
// detailLogger.warn("warn")
// detailLogger.error("error")


// Include the MongoDB Schema 
Reservations = require('../models/ReservationsSchema');
RideManager = require('../models/RideManagerSchema');


var getAllowedRidesPerSlotInfo = function(callbackFunc) {

    var callback = function(err, data) {
        if (err) {
            log.error('Error retrieving AllowedSlotsInfo: %s', JSON.stringify({
                error: err
            }));
            return -1;
        } else {
            log.debug('Retrieved AllowedSlotsInfo');
            callbackFunc(data.allowedRidesPerSlot);
        }
    }

    RideManager
        .findOne()
        .exec(callback);
}

var getAllBookedReservationSlotsOfDayCount = function(reservationDay, callbackFunc) {
    console.log("Var :" + reservationDay);

    var agg = [{
        $match: {
            'RideDateSelected': reservationDay
        }
    }, {
        $group: {
            _id: {
                'RideDateSelected': '$RideDateSelected',
                'RideTimeSelected': '$RideTimeSelected'
            },
            count: {
                $sum: 1
            }
        }
    }];

    Reservations.aggregate(agg, function(err, data) {
        if (err) {
            log.error(' Error retrieving Existing Reservations of the day %s: %s', reservationDay, JSON.stringify({
                error: err
            }));
            return -1;
        }
        log.debug(' Retrieved all Existing Reservations of the day %s: %s', reservationDay, JSON.stringify(data));
        callbackFunc(data);

    });

}

var isBookingSlotFreeForSpecificDateTime = function(reservationDay, reservationTime, callbackFunc) {


    var callback = function(allowedRidesPerSlot) {
        console.log("asdfasf" + reservationDay + reservationTime);

        Reservations.count({
            "RideDateSelected": reservationDay,
            "RideTimeSelected": reservationTime
        }, function(err, count) {
            console.log("count")
            console.log(count)
            if (err) {
                log.error(' Error retrieving Existing Reservations of the day %s %s: %s', reservationDay, reservationTime, JSON.stringify({
                    error: err
                }));
                return -1;
            }

            log.debug(' Retrieved all Existing Reservations of the day %s %s: %s', reservationDay, reservationTime, count);

            if ((allowedRidesPerSlot - count) > 0) {
                freeSlotPresentFlag = true;
            } else {
                freeSlotPresentFlag = false;
            }
            callbackFunc(freeSlotPresentFlag)

        });
    }

    getAllowedRidesPerSlotInfo(callback)


}


// Get all the Reservations
exports.getAllReservations = function(req, res) {

    var clientIPaddress = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;

    var callback = function(err, reservations) {
        if (err) {
            log.error('GET - Error retrieving all Reservations: %s', JSON.stringify({
                clientIPaddress: clientIPaddress,
                error: err
            }));
            res.status(500)
            return res.send(err)
        } else {
            log.debug(' GET - Retrieved all Reservations');
            res.send(reservations);
        }

    }

    Reservations
        .find()
        .sort('-UpdatedTimeStamp')
        .limit(100)
        .exec(callback);
}


// Get Reservation based on Confirmation Code
exports.getAllReservationByConfirmationCode = function(req, res) {
    var confirmationCode = req.params.ConfirmationCode;
    var clientIPaddress = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;

    return Reservations.findById(confirmationCode, function(err, reservation) {
        if (!err) {

            if (!reservation) {
                log.error('Error retrieving reservation: %s', confirmationCode, JSON.stringify({
                    error: "ConfirmationCode not found"
                }));
                res.status(500)
                return res.send(JSON.stringify({
                    error: "ConfirmationCode not found"
                }));

            } else {

                log.debug(' ConfirmationCode - %s information retrieved by: %s', confirmationCode, JSON.stringify({
                    clientIPaddress: clientIPaddress
                }));
                return res.send(reservation);
            }

        } else {
            log.debug(' ConfirmationCode - %s information retrieval failed by: %s', confirmationCode, JSON.stringify({
                clientIPaddress: clientIPaddress,
                error: err
            }));
            res.status(500)
            return res.send(err)
        }
    });
}

// Get Remaining Reservation Slots Of Day
exports.getSoldOutReservationSlotsOfDay = function(req, res) {
    var rideDateSelected = req.params.RideDateSelected;
    res.set('Access-Control-Allow-Origin', '*');
    callback = function(data) {
        console.log(data)
        res.send({
            'data': data
        });
    }
    getAllBookedReservationSlotsOfDayCount(rideDateSelected, callback);
    //    getAllowedRidesPerSlotInfo(callback);

}


exports.getExistingReservationsSlotCount = function(req, res) {

    var clientIPaddress = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;
    var rideDateSelected = req.body.rideDateSelected;

    var agg = [{
        $group: {
            _id: {
                'RideDateSelected': '$RideDateSelected',
                'RideTimeSelected': '$RideTimeSelected'
            },
            count: {
                $sum: 1
            }
        }
    }];

    Reservations.aggregate(agg, function(err, data) {
        if (err) {
            log.error('GET - Error retrieving Existing Reservations Count: %s', JSON.stringify({
                clientIPaddress: clientIPaddress,
                error: err
            }));
            res.status(500);
            return res.send(err);
        }
        log.debug(' GET - Retrieved all Rides');
        res.send({
            RideTimeSelected: data[0]._id.RideTimeSelected,
            count: data[0].count
        });
        // res.send(data[0]);
        console.log(data);
    });

}


// Book new Reservation
exports.bookNewReservation = function(req, res) {

    // Initialize the Reservation Variables
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNumber = req.body.phoneNumber;
    var rideTypeSelected = req.body.rideTypeSelected;
    var rideDateSelected = req.body.rideDateSelected;
    var rideTimeSelected = req.body.rideTimeSelected;
    var specialNeeds = req.body.specialNeeds;
    var clientIPaddress = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;

    res.set('Access-Control-Allow-Origin', '*');

    var sendError = function(msg) {
        log.error('Error creating new Reservation: %s', JSON.stringify({
            error: msg
        }));
        res.status(500)
        res.send(JSON.stringify({
            error: msg
        }));
    }

    if (!email) {
        return sendError("Email invalid. Please correct and resubmit");
    }

    if (!firstName) {
        return sendError("First Name invalid. Please correct and resubmit");
    }

    if (!lastName) {
        return sendError("Last Name invalid. Please correct and resubmit");
    }

    if (!phoneNumber) {
        return sendError("Phone Number invalid. Please correct and resubmit");
    }

    if (!rideTypeSelected) {
        return sendError("Ride Type Selected invalid. Please correct and resubmit");
    }

    if (!rideDateSelected) {
        return sendError("Ride Date Selected invalid. Please correct and resubmit");
    }

    if (!rideTimeSelected) {
        return sendError("Ride Time Selected invalid. Please correct and resubmit");
    }

    if (!specialNeeds) {
        sqlQuery = '';
    }

    var confirmationCode = req.body.ConfirmationCode;

    if (!confirmationCode) {

        callback = function(isBookingSlotFreeForSpecificDateTimeFlag) {

            if (isBookingSlotFreeForSpecificDateTimeFlag == true) {

                // Create a new Job ID     
                var ObjectId = mongoose.Types.ObjectId;
                confirmationCode = new ObjectId;

                confirmationCode = confirmationCode.toString().toUpperCase();

                // Create a MongoDB record for the AdHoc Job
                Reservations.create({
                    _id: confirmationCode,
                    ConfirmationCode: confirmationCode,
                    Email: email,
                    FirstName: firstName,
                    LastName: lastName,
                    PhoneNumber: phoneNumber,
                    RideTypeSelected: rideTypeSelected,
                    RideDateSelected: rideDateSelected,
                    RideTimeSelected: rideTimeSelected,
                    SpecialNeeds: specialNeeds,
                    SubmittedByIP: clientIPaddress,
                    CreatedTimeStamp: new Date(),
                    UpdatedTimeStamp: new Date()
                }, function(err, adHocQuery) {
                    if (err) {
                        return sendError(err);
                        /*log.error('ConfirmationCode - %s Error creating new Reservation: %s', confirmationCode, JSON.stringify({
                            error: err
                        }));
                        res.status(500)
                        return res.send(err)*/
                    } else {
                        log.info(' ConfirmationCode - %s New Reservation Submitted: %s', confirmationCode, JSON.stringify({
                            clientIPaddress: clientIPaddress,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            phoneNumber: phoneNumber,
                            rideTypeSelected: rideTypeSelected,
                            rideDateSelected: rideDateSelected,
                            rideTimeSelected: rideTimeSelected,
                            specialNeeds: specialNeeds,
                            confirmationCode: confirmationCode
                        }));

                        res.send({
                            clientIPaddress: clientIPaddress,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            phoneNumber: phoneNumber,
                            rideTypeSelected: rideTypeSelected,
                            rideDateSelected: rideDateSelected,
                            rideTimeSelected: rideTimeSelected,
                            specialNeeds: specialNeeds,
                            confirmationCode: confirmationCode
                        });
                    }

                });
            } else {
                // Slot not available
                return sendError("Reservation Slot no longer available. Please book another slot");
            }


        }

        isBookingSlotFreeForSpecificDateTime(rideDateSelected, rideTimeSelected, callback);




    }


};