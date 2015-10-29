// ---------------------------------
// Controller For Kangaroo Rides - Admin
// ---------------------------------
kangarooRideApp.controller('adminCtrl', function($scope, $compile, $http, kangarooAngularService, $rootScope) {


    // Collection for Reservations Table
    $scope.reservations = [];
    $scope.displayedReservationsCollection = [];
    $scope.displayedRidesCollection = [];
    $scope.ridesPerSlot;
    
    $scope.showAddRideForm = false;
    $scope.newRide = {};
    $scope.newRide.rideName;

    $scope.showChangeSlotsForm = false;
    $scope.newRidesPerSlot = {};
    $scope.newRidesPerSlot.newRidesPerSlotValue= $scope.ridesPerSlot

    // Activates a tab 
    function activateTab(tab){
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
    };

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

    $scope.addNewRide = function(){
        $http.post('/addNewRide', $scope.newRide)
            .success(function(data) {
                $scope.allAvailableRides = data.availableRides;
                $scope.displayedRidesCollection = [].concat($scope.allAvailableRides);
                $scope.newRide.rideName = '';
                $scope.showAddRideForm = false;
            })
            .error(function(err) {
                console.log(err);
            });
    }

    $scope.changeRidesPerSlot = function(){

         $http.post('/changeRidesPerSlot', $scope.newRidesPerSlot)
            .success(function(data) {
                $scope.newRidesPerSlot.newRidesPerSlotValue = '';
                $scope.ridesPerSlot = data.allowedRidesPerSlot;
                $scope.showChangeSlotsForm = false;
            })
            .error(function(err) {
                console.log(err);
            });
    }

    $scope.deleteReservation = function(reservation){
        if (!reservation.ConfirmationCode){
            return;
        } else{

            var deleteReservationURL = '/deleteReservation/' + reservation.ConfirmationCode;

            $http.delete(deleteReservationURL)
                .success(function (data) {
                    $scope.populateReservationsTable();
                })
                .error(function (err) {
                    alert('Error deleting reservation: ' + err.error);
                });

        }

    }


    $scope.editReservation = function(reservation){
        // Broadcast an event with the adHocJob details
        $rootScope.$broadcast('copyExistingReservationDetailsForEditing', reservation);
        activateTab('newReservationTab');
        activateTab('editReservation');
    }

    $scope.cancelEditAndGoBack = function(){
        $scope.existingReservation = {};
        activateTab('reservations');

    }

    $scope.activateExistingReservationsTab = function(){
        $scope.populateReservationsTable();
        $scope.cancelEditAndGoBack();
    }

    $scope.populateReservationsTable();
    $scope.populateRidesTableAndAllowedSlotsInfo();

    

});



