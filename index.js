var app = angular.module('login', []);
    
app.controller('loginCtrl', function($scope, $http) {
    $scope.login = function() {
        console.log({
            'username':$scope.username,
            'password':$scope.password
        });
    }
});

