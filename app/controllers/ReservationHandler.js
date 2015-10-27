// Handler functions for the Reservations Module
// Load the Modules

var path = require('path');
var mongoose = require('mongoose');

// Load the loggers
var winston = require('winston');
var log = winston.loggers.get('log');

// Types of Log Levels
// highLevelLogger.debug("Debug")
// highLevelLogger.verbose("verbose")
// highLevelLogger.info("info")
// highLevelLogger.warn("warn")
// highLevelLogger.error("error")

// detailLogger.debug("Debug")
// detailLogger.verbose("verbose")
// detailLogger.info("info")
// detailLogger.warn("warn")
// detailLogger.error("error")


// Include the MongoDB Schema 
Reservations = require('../models/Reservations');

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

            if (!reservation){
                log.error('Error retrieving reservation: %s', confirmationCode, JSON.stringify({
                    error: "ConfirmationCode not found"
                }));
                res.status(500)
                return res.send(JSON.stringify({
                    error: "ConfirmationCode not found"
                }));
   
            }else{

                log.debug(' ConfirmationCode - %s information retrieved by: %s', confirmationCode,JSON.stringify({
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


// Book new Reservation
exports.bookNewReservation = function(req, res) {
    console.log(req.body);
    log.debug("req %s", JSON.stringify(req.body));

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
        return sendError("Email invalid");
    }

    if (!firstName) {
        return sendError("First Name invalid");
    }

    if (!lastName) {
        return sendError("Last Name invalid");
    }

    if (!phoneNumber) {
        return sendError("Phone Number invalid");
    }

    if (!rideTypeSelected) {
        return sendError("Ride Type Selected invalid");
    }

    if (!rideDateSelected) {
        return sendError("Ride Date Selected invalid");
    }
   
    if (!rideTimeSelected) {
        return sendError("Ride Time Selected invalid");
    }

    if (!specialNeeds) {
        sqlQuery = '';
    }

    var confirmationCode = req.body.ConfirmationCode;

    if (!confirmationCode) {
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
            RideDateSelected: Date(rideDateSelected),
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
                        rideTypeSelected : rideTypeSelected,
                        rideDateSelected : rideDateSelected, 
                        rideTimeSelected : rideTimeSelected, 
                        specialNeeds : specialNeeds,
                        confirmationCode : confirmationCode
                }));

                res.send({
                        clientIPaddress: clientIPaddress,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: phoneNumber,
                        rideTypeSelected : rideTypeSelected,
                        rideDateSelected : rideDateSelected, 
                        rideTimeSelected : rideTimeSelected, 
                        specialNeeds : specialNeeds,
                        confirmationCode : confirmationCode
                });
             }

        });

    } 


};

