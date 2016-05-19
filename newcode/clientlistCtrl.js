angular.module('myapp').controller('clientlistCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {
    $scope.user = {
        'type' : 0, 
        'viewee': []
    };
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
                $scope.getclients();
            });
        }
    });

    $scope.getclients = function() {
        $scope.download = [];
        var lid = parseInt($scope.user.user_id);
        var j = jQuery.noConflict();
        j.ajax({
              method: "GET",
              url: '/clientlistData',
              data: {lawyerID: lid}
        })
        .done(function(msg) {
            $scope.data = msg;
            console.log($scope.data);
            for (var i = 0; i < $scope.data.length; i++) {
                $scope.download.push(false);
            }
            $scope.$apply();
        });
    };
    
    $scope.click = function(id) {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i]['user_id'] == id) {
                console.log("found", $scope.download);
                localStorage.setItem('viewhistoryof', JSON.stringify($scope.data[i]));
                break;
            }
        }
        $state.go('history');
    };
    $scope.selectall = function() {
        for (var i = 0; i < $scope.download.length; i++) {
            $scope.download[i] = true;
        }
    };
    $scope.downloadtranscripts = function() {
        for (var i = 0; i < $scope.download.length; i++) {
            if ($scope.download[i] == true) {
                console.log($scope.data[i]);
            }
        }
    };
}]);
