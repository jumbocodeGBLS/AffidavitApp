myapp.controller('loginCtrl', function($scope, $http, $state) {
    $scope.login = function() {
        console.log({
            'username':$scope.username,
            'password':$scope.password
        });

        $scope.user = {
	        'id': 1,
	        'fname': 'James',
	        'lname': 'Smith',
	        'uname': 'JSmith01',
	        'language': 'English',
	        'type' : 14, 
	        'clients': [2,3,4]
	    };

	    if ($scope.user['type'] & 8) {
	    	$state.go('admin');
	    } else if ($scope.user['clients'].length > 0) {
	    	$state.go('clientlist');
	    } else if ($scope.user['type'] & 1) {
	    	$state.go('clientview');
	    } else {
	    	console.log('error');
	    }
	};
    
});