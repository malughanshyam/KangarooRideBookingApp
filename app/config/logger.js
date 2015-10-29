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
// Configure the logger
//
winston.loggers.add('log', {
    console: {
    level: 'debug',
    colorize: true,
    label: 'Log',
    exitOnError: false,
    handleExceptions: true,
    json: false
  },
    file: {
        level: 'debug',
        filename: './logs/log.log',
        exitOnError: false,
        handleExceptions: true,
        json: false
    }
});