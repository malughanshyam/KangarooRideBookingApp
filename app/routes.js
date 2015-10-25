var path = require('path');

var THE_404_PAGE = 'views/404.html';
var HOME_PAGE = 'views/home.html';


// Include the MongoDB Schema 
module.exports = function(app) {

    // Default Route
    app.get('/', function (req, res) {
        res.sendFile(HOME_PAGE, { root: __dirname + '/../public/'}); 
    });

    app.use(function(req, res, next) {
        // respond with html page
        if (req.accepts('html')) {
            res.status(404).sendFile(THE_404_PAGE, { root: __dirname + '/../public/'});
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.status(400).send({
                "status": "400",
                "error": 'Page Not found'
            });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Page Not found');
    });




};