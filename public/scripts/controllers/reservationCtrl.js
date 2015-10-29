// ---------------------------------
// Controller For Kangaroo Rides
// ---------------------------------
kangarooRideApp.controller('reservationCtrl', function($scope, $compile, $http) {

	$scope.newBooking = {};
	$scope.newBooking.email;

	$scope.newBooking.firstName;
	$scope.newBooking.lastName;
	$scope.newBooking.phoneNumber;
	$scope.newBooking.rideTypeSelected;
	$scope.newBooking.rideDateSelected;
	$scope.newBooking.rideTimeSelected;
	$scope.newBooking.specialNeeds = '';
	$scope.newBookingStatus;

	$scope.rideTypeAvailable=[];

	$scope.totalRideTimesAvailable = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];
    $scope.rideTimesAvailableDisplayList = $scope.totalRideTimesAvailable

    $scope.showFixErrorsButton = false;

    // Activates a tab 
    function activateTab(tab){
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
    };

    $scope.startNewBooking = function(){
        $scope.bookingReset();
        activateTab('newReservationTab');
    }


    $scope.fixBookingErrorsAndRebook = function(){
        activateTab('newReservationTab');
    }

	$scope.bookOrUpdateReservation = function(){

        activateTab('statusTab');

        $('#bookingStatusPlaceholderDiv').html('<h3 align="center"> <i class="fa fa-spinner fa-pulse fa-3x "></i> <br><br> Booking your Ride ... </h3>');
		
        $http.post('/bookOrUpdateReservation', $scope.newBooking)
            .success(function(data) {
                $scope.showFixErrorsButton=false;
                $scope.newBooking.confirmationCode = data.confirmationCode;
                $('#bookingStatusPlaceholderDiv').html('<h3 align="center" id="success"> <i  class="fa fa-check-square-o fa-3x "></i> <br>Booking Successful </h3>');
            })
            .error(function(err) {
                console.log(err);
                $scope.showFixErrorsButton=true;
                $scope.newBooking.confirmationCode = err.error;
                $scope.newBookingStatus = 'FAILED';
                $('#bookingStatusPlaceholderDiv').html('<h3 align="center" id="failed"> <i  class="fa fa-exclamation-triangle fa-3x "></i> <br>Booking Failed </h3>');
                $('#bookingStatusPlaceholderDiv').append('<div align="center"> <h3>Error</h3>' + err.error + '</div>') 
            });
	}


    //Reset the form
	$scope.bookingReset = function(){
		$scope.newBooking = {};
        $scope.newBooking.specialNeeds = '';
        $('#emailInputId').val('');
        $('#phoneNumber').val('');
        $('#rideDate').val('');
        $scope.form.phoneNumber.$error.pattern = false
        $scope.form.rideDate.$error.pattern = false
        $scope.form.$setPristine();
	}	

    $scope.populateAvailableRideTypes = function(){

        var getAllRidesAndAllowedSlotsInfo = '/allRidesAndAllowedSlotsInfo';
        
        $http.get(getAllRidesAndAllowedSlotsInfo)
            .success(function(data) {
                $scope.rideTypeAvailable = data.availableRides
            })
            .error(function(err) {
                console.log('Fetching available ride types failed :' + err);
            });
        
    }

    $scope.populateAvailableRideSlots = function(){

        if (!$scope.form.rideDate.$valid) {
            return;
        }

        var getSoldOutReservationSlotsOfDay = '/soldOutReservationSlotsOfDay/'+$scope.newBooking.rideDateSelected;
        
        $http.get(getSoldOutReservationSlotsOfDay)
            .success(function(data) {
                $scope.rideTimesAvailableDisplayList = $scope.totalRideTimesAvailable
                for (slot in data.soldOutSlotList){
                    var i = $scope.rideTimesAvailableDisplayList.indexOf(data.soldOutSlotList[slot]);
                    if(i != -1) {
                        $scope.rideTimesAvailableDisplayList.splice(i, 1);
                    }
                    
                }
            })
            .error(function(err) {
                console.log('Fetching soldOutReservationSlotsOfDay Failed :' + err);
            });
        
    }


    $scope.$on('copyExistingReservationDetailsForEditing', function(event, reservation) {
        $scope.newBooking.ConfirmationCode = reservation.ConfirmationCode;
        $scope.newBooking.email = reservation.Email;
        $scope.newBooking.firstName = reservation.FirstName;
        $scope.newBooking.lastName = reservation.LastName;
        $scope.newBooking.phoneNumber = reservation.PhoneNumber;
        $scope.newBooking.rideTypeSelected = reservation.RideTypeSelected;
        $scope.newBooking.rideDateSelected = reservation.RideDateSelected;
        $scope.newBooking.rideTimeSelected = reservation.RideTimeSelected;
        $scope.newBooking.specialNeeds  = reservation.SpecialNeeds;
    });

    $scope.populateAvailableRideTypes();
     
});


kangarooRideApp.directive('jqdatepicker', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datepicker({
                	minDate:0,
                    dateFormat:'mm-dd-yy',
                    onSelect:function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    }
});

