// ---------------------------------
// Controller For Kangaroo Rides - Admin
// ---------------------------------
kangarooRideApp.controller('adminCtrl', function($scope, $compile, $http, kangarooAngularService, $rootScope) {


    // Collection for Reservations Table
    $scope.reservations = [];
    $scope.displayedReservationsCollection = [];
    $scope.displayedRidesCollection = [];
    $scope.ridesPerSlot = 1;
    // Function to convert the ISO Datestring to Readable Format for displaying in the Recent Jobs Table
    $scope.parseIsoDatetime = function(dateStr) {
        return kangarooAngularService.parseIsoDatetime(dateStr);
    }

    // Populate ReservationsTable
    $scope.populateReservationsTable = function() {
        var getReservations = '/reservations';

        $http.get(getReservations)
            .success(function(data) {
                $scope.reservations = data;
                $scope.displayedReservationsCollection = [].concat($scope.reservations);
            })
            .error(function(err) {
                $scope.jobLog = 'Fetching Reservations Failed :' + err;
            });
    }


    // Populate ReservationsTable
    $scope.populateRidesTable = function() {
        var getAllAvailableRides = '/allAvailableRides';

        $http.get(getAllAvailableRides)
            .success(function(data) {
                $scope.allAvailableRides = data;
                $scope.displayedRidesCollection = [].concat($scope.allAvailableRides);
            })
            .error(function(err) {
                $scope.jobLog = 'Fetching Reservations Failed :' + err;
            });
    }

    $scope.populateReservationsTable();
    $scope.populateRidesTable();

    

});



