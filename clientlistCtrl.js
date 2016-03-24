myapp.controller('clientlistCtrl', function($scope, $http, $state) {
  $scope.data = [
        {'name': 'Isaiah', 'progress': 96, 'id':6},
        {'name': 'Rachael', 'progress': 72, 'id':2},
        {'name': 'Shanshan', 'progress': 89, 'id':3},
        {'name': 'Eric', 'progress': 57, 'id':4},
        {'name': 'Erica', 'progress': 48, 'id':5}
    ];
    $scope.click = function(id) {
        localStorage.setItem('viewhistoryof', id);
        $state.go('history');
    };
});