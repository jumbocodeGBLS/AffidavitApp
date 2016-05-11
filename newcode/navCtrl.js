angular.module('myapp').controller('navCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {
    $scope.reserror = "";
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
        return ($scope.user['type'] == 1);
    };

    $scope.hasclient = function() {
        return ($scope.user['type'] != 1);
    };
    
    $scope.isadmin = function() {
        return ($scope.user['type'] == 8);
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
        j('#email').modal('show');
        $scope.reserror = "";
    };

    $scope.changepswd = function() {
        var j =jQuery.noConflict(); 
        j('#pswd').modal('show');
        $scope.reserror = "";
    };

    $scope.deleteuser = function() {
        var j =jQuery.noConflict(); 
        j('#delete').modal('show');
        $scope.reserror = "";
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $scope.pinfo = function() {
        var filledout =
               document.getElementById('username').value != "" &&
               document.getElementById('oldpassword').value != "" &&
               document.getElementById('newpassword').value != "";
        var validemail = validateEmail(document.getElementById('username').value);
        return filledout && validemail;
    };

    $scope.uinfo = function() {
        var filledout =
               document.getElementById('oldusername').value != "" &&
               document.getElementById('newusername').value != "" &&
               document.getElementById('password').value != "";
        var validemail1 = validateEmail(document.getElementById('oldusername').value);
        var validemail2 = validateEmail(document.getElementById('newusername').value);
        return filledout && validemail1 && validemail2;
    };

    $scope.dinfo = function() {
        var filledout =
               document.getElementById('username2').value != "" &&
               document.getElementById('password2').value != "";
        var validemail = validateEmail(document.getElementById('username2').value);
        return filledout && validemail;
    };

    $scope.changeEmail = function(user) {
        AuthenticationService.changeEmail(user, function(response) {
            console.log(response);
            if (response.status == 200) {
                $scope.reserror = "";
                var j =jQuery.noConflict(); 
                j('#email').modal('hide');
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
                j('#pswd').modal('hide');
            } else {
                $scope.reserror = response;
            }
        });
    };

    $scope.deleteUser = function(user) {
        AuthenticationService.deleteuser(user, function(response) {
            console.log(response);
            if (response.status == 200) {
                $scope.reserror = "";
                var j =jQuery.noConflict(); 
                j('#delete').modal('hide');
            } else {
                $scope.reserror = response;
            }
        });
    }
}]);

