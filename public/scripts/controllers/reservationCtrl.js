angular.module('kangarooRideApp')

// ---------------------------------
// Controller For Kangaroo Rides
// ---------------------------------
.controller('kangarooRideCtrl', function($scope, $compile, $http) {

	$scope.newBooking = {};
	$scope.newBooking.email;

	$scope.newBooking.firstName;
	$scope.newBooking.lastName;
	$scope.newBooking.phoneNumber;
	$scope.newBooking.rideTypeSelected;
	$scope.newBooking.rideDateSelected;
	$scope.newBooking.rideTimeSelected;
	$scope.newBooking.specialNeeds;

	$scope.rideTypeAvailable = [
      {id: 'JJER', name: 'Jumpy Joey Easy Ride'},
      {id: 'BBDUR', name: 'Big Bounder Down Under Ride'},
      {id: 'DOS', name: 'Deadly Outback Special'}
    ];

	

	$scope.rideTimesAvailable = ['08:00a', '08:30a', '09:00a', '09:30a', '10:00a', '10:30a', '11:00a', '11:30a', '12:00p', '12:30p', '01:00p', '01:30p', '02:00p', '02:30p', '03:00p', '03:30p', '04:00p', '04:30p'];

	
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
