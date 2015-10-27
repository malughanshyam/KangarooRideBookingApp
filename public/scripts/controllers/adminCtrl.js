// ---------------------------------
// Controller For Kangaroo Rides - Admin
// ---------------------------------
kangarooRideApp.controller('adminCtrl', function($scope, $compile, $http, kangarooAngularService, $rootScope) {


    // Collection for Reservations Table
    $scope.reservations = [];
    $scope.displayedCollection = [];

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
                $scope.displayedCollection = [].concat($scope.reservations);
            })
            .error(function(err) {
                $scope.jobLog = 'Fetching Reservations Failed :' + err;
            });
    }

    $scope.populateReservationsTable();

});



