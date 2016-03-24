var app = angular.module('login', []);
    
app.controller('loginCtrl', function($scope, $http) {
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
	        'type' : 15, 
	        'clients': [2,3,4]
	    };

	    if ($scope.user['type'] & 8) {
	    	window.location = 'admin.html';
	    } else if ($scope.user['clients'].length > 0) {
	    	window.location = 'clientlist.html';
	    } else if ($scope.user['type'] & 1) {
	    	window.location = 'clientview.html';
	    } else {
	    	console.log('error');
	    }
    };
});

