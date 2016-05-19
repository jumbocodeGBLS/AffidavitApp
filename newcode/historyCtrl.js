angular.module('myapp').controller('historyCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {            
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
                console.log(msg);
                $scope.user = msg[0];
                var id = '';
                if ($scope.user.type != 1 && $scope.user.type != "client") {
                    var client = JSON.parse(localStorage.getItem('viewhistoryof'));
                    id = client.user_id;
                } else {
                    id = $scope.user.user_id;
                }
                j.ajax({
                    method: "GET",
                    url:'/historyData',
                    data: {clientID: id}
                })
                .done(function(msg) {
                    console.log(msg);
                    $scope.data = msg;
                    for(var i = 0; i < $scope.data.length; i++) {
                        $scope.data[i].responses = [];
                        for (var j = 0; j < $scope.data[i]['date'].length; j++) {
                          $scope.data[i].responses.push({'date': $scope.data[i]['date'][j],
                                                         'link': $scope.data[i]['link'][j]});
                        }
                    }
                    $scope.$apply();
                });
            });
        }
    });
}]);