myapp.controller('historyCtrl', function($scope, $http) {                
    $scope.data = [
        {'question': 1, 'text': 'Whats up?', 
        'responses': [{'date': '10/12/2015', 'link':'1'},
                      {'date': '10/13/2015', 'link':'2'}]},
        {'question': 2, 'text': 'How are you?', 
        'responses': [{'date':'10/19/2015', 'link':'3'},
                      {'date': '10/30/2015', 'link':'4'}]},
        {'question': 3, 'text': 'How is it going?', 
        'responses': [{'date':'11/12/2015', 'link':'5'}, 
                      {'date': '11/14/2015', 'link':'6'}]}
    ];
});