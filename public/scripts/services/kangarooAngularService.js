angular.module('kangarooRideApp')
    .service('kangarooAngularService', function($http) {

        var parseIsoDatetime = function(dtstr) {
            //return moment(dtstr).tz('America/New_York').format("ddd, MMMM D YYYY, hh:mm A z");
            return moment(dtstr).utc().format("ddd, MMM D YYYY");
        }

        return {
            parseIsoDatetime: parseIsoDatetime 
        };




    });