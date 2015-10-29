// Handler functions for the Rides Manager Module
// Load the Modules
var path = require('path');
var mongoose = require('mongoose');

// Load the loggers
var winston = require('winston');
var log = winston.loggers.get('log');

// Include the MongoDB Schema 
RideManager = require('../models/RideManagerSchema');


var initializeRideManagerInDatabase = function() {
    RideManager.count({
        _id: '1'
    }, function(err, count) {
        // Ride Manager Already initialized, Nothing extra to do
        if (count != 0) {
            return;
        } else {
            // Initialize
            RideManager.create({
                _id: '1',
                allowedRidesPerSlot: 1,
                availableRides: [],
                CreatedTimeStamp: new Date(),
                UpdatedTimeStamp: new Date()
            }, function(err, adHocQuery) {
                if (err) {
                    log.error('Error initializing RideManager Schema in Database: %s', JSON.stringify({
                        error: err
                    }));
                } else {
                    log.info('Initialized Ride Manager Schema in DB');
                }
                return;
            });
        }
    });
}

initializeRideManagerInDatabase();

// Get all the Reservations
exports.getAllRidesAndAllowedSlotsInfo = function(req, res) {

    var clientIPaddress = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;

    var callback = function(err, data) {
        if (err) {
            log.error('GET - Error retrieving AllRidesAndAllowedSlotsInfo: %s', JSON.stringify({
                clientIPaddress: clientIPaddress,
                error: err
            }));
            res.status(500);
            return res.send({
                error: err.message
            });
        } else {
            log.debug(' GET - AllRidesAndAllowedSlotsInfo');
            res.send(data);
        }

    }

    RideManager
        .findOne()
        .exec(callback);
}

exports.addNewRide = function(req, res) {

    res.set('Access-Control-Allow-Origin', '*');

    var clientIPaddress = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;
    var newRide = req.body.rideName

    var sendError = function(msg) {
        log.error('Error adding new Ride: %s', JSON.stringify({
            error: msg
        }));
        res.status(500)
        res.send({
            error: msg
        });
    }

    if (!newRide) {
        return sendError("Ride invalid. Please correct and resubmit");
    } else {

        // Add a ride
        var query = {};
        var updateFields = {
            $push: {
                "availableRides": newRide
            },
            $currentDate: {
                "UpdatedTimeStamp": true
            }
        };

        function callback(err) {
            if (err) {
                return sendError(err.message);
                log.error('Error adding new Ride :%s', JSON.stringify({
                    error: err
                }));
            } else {
                log.info('New Ride - "%s" added to the database', newRide);

                RideManager.findOne(function(err, data) {
                    if (err) {
                        return sendError(err.message);
                    } else {
                        res.send(data);
                    }
                });

            }
        }

        RideManager.findOneAndUpdate(query, updateFields, callback)

    }
}

exports.changeRidesPerSlot = function(req, res) {

    res.set('Access-Control-Allow-Origin', '*');

    var clientIPaddress = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;
    var newRidesPerSlotValue = req.body.newRidesPerSlotValue

    var sendError = function(msg) {
        log.error('Error updating the Rides Allowed Per Slot: %s', JSON.stringify({
            error: msg
        }));
        res.status(500)
        res.send({
            error: msg
        });
    }

    if (!newRidesPerSlotValue) {
        return sendError("newRidesPerSlotValue invalid. Please correct and resubmit");
    } else {

        // Update new allowed rides per slot value
        var query = {};
        var updateFields = {
            $set: {
                "allowedRidesPerSlot": newRidesPerSlotValue
            },
            $currentDate: {
                "UpdatedTimeStamp": true
            }
        };

        function callback(err) {
            if (err) {
                return sendError(err.message);
                log.error('Error updating allowedRidesPerSlot :%s', JSON.stringify({
                    error: err
                }));
            } else {
                log.info('New allowedRidesPerSlot value- "%s" added to the database', newRidesPerSlotValue);

                RideManager.findOne(function(err, data) {
                    if (err) {
                        return sendError(err.message);
                    } else {
                        res.send(data);
                    }
                });

            }
        }

        RideManager.findOneAndUpdate(query, updateFields, callback)

    }
}