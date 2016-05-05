myapp.controller('historyCtrl', function($scope, $http) {                
    /*$scope.data = [
        {'question': 1, 'text': 'Whats up?', 
        'dates': ['10/12/2015', '10/13/2015'],
        'links': [1,2]},
        {'question': 2, 'text': 'How are you?', 
        'dates': ['10/19/2015', '10/30/2015'],
        'links': [3,4]},
        {'question': 3, 'text': 'How is it going', 
        'dates': ['11/12/2015', '11/14/2015'],
        'links': [5,6]}
    ];*/

    var j = jQuery.noConflict();
    j.ajax({
          method: "GET",
          url:'/historyData',
          data: 1
    })
    .done(function(msg) {
        console.log(msg);
        $scope.data = msg;
        for(var i = 0; i < $scope.data.length; i++) {
            $scope.data[i].responses = [];
            for (var j = 0; j < $scope.data[i]['dates'].length; j++) {
              $scope.data[i].responses.push({'date': $scope.data[i]['dates'][j],
                                             'link': $scope.data[i]['links'][j]});
            }
        }
    });
});