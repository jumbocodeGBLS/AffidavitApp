var app = angular.module('history', []);
    
app.controller('historyCtrl', function($scope, $http) {

/********************** NAV STUFF ****************************/
/*
    Schema for user type:
    0:  (0000) not a user
    1:  (0001) client only
    2:  (0010) lawyer only
    3:  (0011) lawyer and client
    4:  (0100) advocate only
    5:  (0101) advocate and client
    6:  (0110) advocate and lawyer
    7:  (0111) advocate, lawyer, and client
    8:  (1000) administrator only
    9:  (1001) administrator and client
    10: (1010) administrator and lawyer
    11: (1011) administrator, lawyer, and client
    12: (1100) administrator and advocate
    13: (1101) administrator, advocate, and client
    14: (1110) administrator, advocate, and lawyer
    15: (1111) administrator, advocate, lawyer, and client

    1 bit turned on == client
    2 bit turned on == lawyer
    4 bit turned on == advocate
    8 bit turned on == administrator
*/
    // hard-coded for now. Later, get this from the server!!
    $scope.user = {
        'id': 1,
        'fname': 'James',
        'lname': 'Smith',
        'uname': 'JSmith01',
        'language': 'English',
        'type' : 15, 
        'clients': []
    };

    // set navbar options based on user type
    $scope.hasorisclient = function () {
        return ($scope.user['type'] & 1 || $scope.user['clients'].length > 0);
    };

    $scope.hasclient = function() {
        return ($scope.user['clients'].length > 0);
    };
    
    $scope.isadmin = function() {
        return ($scope.user['type'] & 8) > 0;
    };
/********************* NAV STUFF END *************************/
                
    $scope.data = [
        {'question': 1, 'text': 'Whats up?', 
        'responses': [{'date': '10/12/2015', 'link':'clientView.html'},
                      {'date': '10/13/2015', 'link':'clientView.html'}]},
        {'question': 2, 'text': 'How are you?', 
        'responses': [{'date':'10/19/2015', 'link':'clientView.html'},
                      {'date': '10/30/2015', 'link':'clientView.html'}]},
        {'question': 3, 'text': 'How is it going?', 
        'responses': [{'date':'11/12/2015', 'link':'clientView.html'}, 
                      {'date': '11/14/2015', 'link':'clientView.html'}]}
    ];
});

