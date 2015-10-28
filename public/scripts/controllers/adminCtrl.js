// ---------------------------------
// Controller For Kangaroo Rides - Admin
// ---------------------------------
kangarooRideApp.controller('adminCtrl', function($scope, $compile, $http, kangarooAngularService, $rootScope) {


    // Collection for Reservations Table
    $scope.reservations = [];
    $scope.displayedReservationsCollection = [];
    $scope.displayedRidesCollection = [];
    $scope.ridesPerSlot;
    // Function to convert the ISO Datestring to Readable Format for displaying in the Recent Jobs Table
    $scope.parseIsoDatetime = function(dateStr) {
        return kangarooAngularService.parseIsoDatetime(dateStr);
    }

    // Flag for Show Popup while displaying long text of Special Needs 
    $scope.showPopupFlag = function(text, limit) {
        if (text.length > limit)
            return true;
        return false;
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
    $scope.populateRidesTableAndAllowedSlotsInfo = function() {
        var getAllAvailableRidesAndAllowedSlotsInfo = '/allRidesAndAllowedSlotsInfo';

        $http.get(getAllAvailableRidesAndAllowedSlotsInfo)
            .success(function(data) {
                $scope.ridesPerSlot = data.allowedRidesPerSlot;
                $scope.allAvailableRides = data.availableRides;
                $scope.displayedRidesCollection = [].concat($scope.allAvailableRides);
            })
            .error(function(err) {
                $scope.jobLog = 'Fetching Reservations Failed :' + err;
            });
    }

    $scope.populateReservationsTable();
    $scope.populateRidesTableAndAllowedSlotsInfo();

    

});



