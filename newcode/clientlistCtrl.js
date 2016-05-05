myapp.controller('clientlistCtrl', function($scope, $http, $state) {
  /*$scope.data = [
        {'name': 'Isaiah', 'progress': 96, 'id':6},
        {'name': 'Rachael', 'progress': 72, 'id':2},
        {'name': 'Shanshan', 'progress': 89, 'id':3},
        {'name': 'Eric', 'progress': 57, 'id':4},
        {'name': 'Erica', 'progress': 48, 'id':5}
    ];*/
    var j = jQuery.noConflict();
    j.ajax({
          method: "GET",
          url: '/clientlistData',
          data: 1
    })
    .done(function(msg) {
        console.log(msg);
        $scope.data = msg;
    });
    $scope.download = [];
    for (var i = 0; i < $scope.data.length; i++) {
        $scope.download.push(false);
    }
    $scope.click = function(id) {
        localStorage.setItem('viewhistoryof', id);
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
});