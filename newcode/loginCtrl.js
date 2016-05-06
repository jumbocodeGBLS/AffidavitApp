angular.module('myapp').controller('loginCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {
    console.log('in loginCtrl, state: ', $state.current.name);

    $scope.reserror = "";

	$scope.login = function(user) {
	    console.log(user);
	    AuthenticationService.login(user, function(response) {
	        console.log(response);
	        if (response.status == 200) {
	        	$scope.reserror = "";
	          	var j = jQuery.noConflict();
			    j.ajax({
			          method: "GET",
			          url: '/userData',
			          data: {data: $scope.user.username} 
			    })
			    .done(function(msg) {
			        $scope.user = msg[0];
			        if ($scope.user.type == "client") {
			        	$scope.user.type = 1;
			        } else if ($scope.user.type == "lawyer") {
			        	$scope.user.type = 2;
			        } else if ($scope.user.type == "admin") {
			        	$scope.user.type = 8;
			        } else {
			        	$scope.user.type = 4;
			        }
			        console.log($scope.user);
			        if ($scope.user['type'] & 8) {
						$state.go('admin');
					} else if ($scope.user['viewee'].length > 0) {
						$state.go('clientlist');
					} else if ($scope.user['type'] & 1) {
						$state.go('clientview');
					} else {
						console.log('error');
					}
					console.log($state);
			    });
		    } else {
		    	$scope.reserror = response;
		    }
	  	});
	}
}]);

