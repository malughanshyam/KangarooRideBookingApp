// Configure Logger for the Application
var winston = require('winston');

// Specify Colors
winston.addColors({
    debug: 'green',
    info: 'cyan',
    silly: 'magenta',
    warn: 'yellow',
    error: 'red'
});

//
// Configure the logger for 'Detailed Logs'
//
winston.loggers.add('log', {
    console: {
    level: 'debug',
    colorize: true,
    label: 'Log',
    exitOnError: false,
    handleExceptions: true,
    json: false
//    prettyPrint:true
  },
    file: {
        level: 'debug',
        // colorize: true,
        filename: './logs/log.log',
        exitOnError: false,
        handleExceptions: true,
        // prettyPrint:true,
        // logstash: true,
        json: false
    }
});