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
	$scope.newBooking.specialNeeds;
	$scope.newBookingStatus;

	$scope.rideTypeAvailable = [
      {id: 'JJER', name: 'Jumpy Joey Easy Ride'},
      {id: 'BBDUR', name: 'Big Bounder Down Under Ride'},
      {id: 'DOS', name: 'Deadly Outback Special'}
    ];

	

	$scope.rideTimesAvailable = ['08:00a', '08:30a', '09:00a', '09:30a', '10:00a', '10:30a', '11:00a', '11:30a', '12:00p', '12:30p', '01:00p', '01:30p', '02:00p', '02:30p', '03:00p', '03:30p', '04:00p', '04:30p'];


	$scope.bookReservation = function(){
		console.log("Submitting : ");
		console.log($scope.newBooking);
		$http.post('/bookNewReservation', $scope.newBooking)
            .success(function(data) {
                $scope.newBooking.confirmationCode = data.confirmationCode;
                console.log(data);
                console.log(" $scope.newBooking.confirmationCode",  $scope.newBooking.confirmationCode);
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
/*
    while (h<17){
    	$scope.newBooking.rideTimesAvailable.push({'id':id, 'slot': (h % 12) + ':' + m + ampm});
    	id= id+1;
    	h = h + 1;
    	if (h > 12) {
    		ampm = 'pm';
    	}
    }
*/

});


kangarooRideApp.directive('jqdatepicker', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datepicker({
                	minDate:0,
                    dateFormat:'dd/mm/yy',
                    onSelect:function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    }
});
