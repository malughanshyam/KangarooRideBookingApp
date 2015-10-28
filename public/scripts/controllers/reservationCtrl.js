// ---------------------------------
// Controller For Kangaroo Rides
// ---------------------------------
kangarooRideApp.controller('kangarooRideCtrl', function($scope, $compile, $http) {

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

	$scope.rideTypeAvailable = [
      'Jumpy Joey Easy Ride',
      'Big Bounder Down Under Ride',
      'Deadly Outback Special'
    ];

	

	$scope.rideTimesAvailable = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];
    $scope.rideTimesAvailableDisplayList = $scope.rideTimesAvailable

	$scope.bookReservation = function(){
		$http.post('/bookNewReservation', $scope.newBooking)
            .success(function(data) {
                $scope.newBooking.confirmationCode = data.confirmationCode;
                // $scope.activateCurrentJobStatusTab()
            })
            .error(function(err) {
                console.log(err);
                $scope.newBooking.confirmationCode = err.error;
                $scope.newBookingStatus = 'FAILED';
                // $scope.activateCurrentJobStatusTab()
            });
	}

	$scope.bookingReset = function(){
		$scope.newBooking = {};
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
                $scope.rideTimesAvailableDisplayList = $scope.rideTimesAvailable
                for (slot in data.soldOutSlotList){
                    var i = $scope.rideTimesAvailableDisplayList.indexOf(data.soldOutSlotList[slot]);
                    if(i != -1) {
                        $scope.rideTimesAvailableDisplayList.splice(i, 1);
                    }
                    
                }
                /*$('#rideTimePicker').timepicker({
                            'useSelect': true,
                            'noneOption': '--Select--',
                            'timeFormat': 'h:i A',
                            'minTime': '8:00am',
                            'maxTime': '4:30pm',
                            'step': 30,
                            'disableTimeRanges': $scope.soldOutReservationSlotsOfDay
                        });*/

            })
            .error(function(err) {
                console.log('Fetching soldOutReservationSlotsOfDay Failed :' + err);
            });
        
    }

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

