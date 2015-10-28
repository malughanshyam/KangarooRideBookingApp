// Handler functions for the Rides Manager Module
// Load the Modules

var path = require('path');
var mongoose = require('mongoose');

// Load the loggers
var winston = require('winston');
var log = winston.loggers.get('log');

// Include the MongoDB Schema 
RideManager = require('../models/RideManagerSchema');

// Get all the Reservations
exports.getAllRidesAndAllowedSlotsInfo = function(req, res) {

    var clientIPaddress = req.ip || req.header('x-forwarded-for') || req.connection.remoteAddress;

    var callback = function(err, data) {
        if (err) {
            log.error('GET - Error retrieving AllRidesAndAllowedSlotsInfo: %s', JSON.stringify({
                clientIPaddress: clientIPaddress,
                error: err
            }));
            res.status(500)
            return res.send(err)
        } else {
            log.debug(' GET - AllRidesAndAllowedSlotsInfo');
            res.send(data);
        }

    }

    RideManager
        .findOne()
        .exec(callback);
}

