angular.module('myapp').controller('navCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {
    $scope.user = {
        'type' : 0, 
        'viewee': []
    };
    console.log('in navCtrl, state: ', $state.current.name);
    AuthenticationService.getUser(function(res){
        if (res != "") {
            console.log(res.password.email);
            var j = jQuery.noConflict();
            j.ajax({
                  method: "GET",
                  url: '/userData',
                  data: {data: res.password.email} 
            })
            .done(function(msg) {
                $scope.user = msg[0];
                console.log($scope.user);
                if ($scope.user.type == "client") {
                    $scope.user.type = 1;
                } else if ($scope.user.type == "lawyer") {
                    $scope.user.type = 2;
                } else if ($scope.user.type == "admin") {
                    $scope.user.type = 8;
                } else {
                    $scope.user.type = 4;
                }
                $scope.$apply();
            });
        }
    });

    $scope.isclient = function () {
        return ($scope.user['type'] & 1);
    };

    $scope.hasclient = function() {
        return ($scope.user['viewee'].length > 0);
    };
    
    $scope.isadmin = function() {
        return ($scope.user['type'] & 8) > 0;
    };


    $scope.logout = function() {
    console.log("calling logout");
      AuthenticationService.logout(function(res) {
        console.log(res);
        if (res.status == 200) {
            $state.go('login');
        }
      });
    };

    $scope.changeemail = function() {
        var j =jQuery.noConflict(); 
        j('#myModal1').modal('show');
        $scope.reserror = "";
    };

    $scope.changepswd = function() {
        var j =jQuery.noConflict(); 
        j('#myModal2').modal('show');
        $scope.reserror = "";
    };

    $scope.pinfo = function() {
        return document.getElementById('username').value != "" &&
               document.getElementById('oldpassword').value != "" &&
               document.getElementById('newpassword').value != "";
    };

    $scope.uinfo = function() {
        return document.getElementById('oldusername').value != "" &&
               document.getElementById('newusername').value != "" &&
               document.getElementById('password').value != "";
    };

    $scope.changeEmail = function(user) {
        AuthenticationService.changeEmail(user, function(response) {
            console.log(response);
            if (response.status == 200) {
                $scope.reserror = "";
                var j =jQuery.noConflict(); 
                j('#myModal1').modal('hide');
            } else {
                $scope.reserror = response;
            }
        });
    };

    $scope.changePassword = function(user) {
        AuthenticationService.changePassword(user, function(response) {
            console.log(response);
            if (response.status == 200) {
                $scope.reserror = "";
                var j =jQuery.noConflict(); 
                j('#myModal2').modal('hide');
            } else {
                $scope.reserror = response;
            }
        });
    };
}]);

