angular.module('myapp').controller('loginCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {
    console.log('in loginCtrl, state: ', $state.current.name);

    $scope.reserror = "";

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

	$scope.login = function(user) {
	    console.log(user);
	    if (!validateEmail($scope.user.username)) {
            alert("Invalid email address");
            return;
        }
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
			        console.log(msg);
			        if ($scope.user.type == "client") {
			        	$scope.user.type = 1;
			        	$state.go('clientview');
			        } else if ($scope.user.type == "lawyer") {
			        	$scope.user.type = 2;
			        	$state.go('clientlist');
			        } else if ($scope.user.type == "admin") {
			        	$scope.user.type = 8;
			        	$state.go('admin');
			        } else {
			        	$scope.user.type = 4;
			        }
			    });
		    } else {
		    	$scope.reserror = response;
		    }
	  	});
	};

	$scope.resetPswd = function(user) {
		if (!validateEmail($scope.user.username)) {
            alert("Invalid email address");
            return;
        }
		AuthenticationService.resetPassword(user, function(response) {
			console.log(response);
            if (response.status == 200) {
                $scope.reserror = "";
                alert("Password reset email sent successfully");
            } else {
                $scope.reserror = response;
            }
		});
	};
}]);

