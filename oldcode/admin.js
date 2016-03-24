function compare(a,b) {
    if (a['lname'] < b['lname']) {
        return -1;
    } else if (a['lname'] > b['lname']) {
        return 1;
    } else {
        return 0;
    }
}

var app = angular.module('admin', []);
    
app.controller('adminCtrl', function($scope, $http) {

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



/************************* ADD USER **************************/
   // initialize values in add user modal
    $scope.fname = "";
    $scope.lname = "";
    $scope.uname = "";
    $scope.password = "";
    $scope.language = "preference";
    $scope.lawyer = false;
    $scope.client = false;
    $scope.advocate = false;
    $scope.administrator = false;

    // opens add user modal
    $scope.addUser = function() {
        var j =jQuery.noConflict(); 
        j('#myModal1').modal('show'); 
    };

    // is there enough info to create a new user?
    // submit button controller
    $scope.enoughnewinfo = function() {
        if (($scope.client || $scope.lawyer || $scope.advocate || $scope.administrator)
            && $scope.fname != ""
            && $scope.lname != ""
            && $scope.uname != ""
            && $scope.password != ""
            && $scope.language != "preference")
            return true;
        else
            return false;
    };

    // create a new user
    $scope.submitNew = function() {
        var type = 0;
        if ($scope.client) {
            type += 1;
        }
        if ($scope.lawyer) {
            type += 2;
        }
        if ($scope.advocate) {
            type += 4;
        }
        if ($scope.administrator) {
            type += 8;
        }
        console.log({
            'fname': $scope.fname,
            'lname': $scope.lname,
            'uname': $scope.uname,
            'password': $scope.password,
            'id': $scope.users.length + 1,
            'language': $scope.language,
            'type': type,
            'clients': []
        });
        $scope.users.push({ // add new user to our array!
            'id': document.getElementById('usertoedit').value,
            'fname': $scope.fname,
            'lname': $scope.lname,
            'uname': $scope.uname,
            'id': $scope.users.length + 1,
            'language': $scope.language,
            'type': type,
            'clients': []
        });
        $scope.users.sort(compare);
        $scope.setClientsAndReps();
    };

/************************* ADD USER END **********************/



/************************* EDIT USER **************************/
    // opens edit user modal
    $scope.editUser = function() {
        var j =jQuery.noConflict(); 
        j('#myModal2').modal('show'); 
    };

    // open hidden section of edit user modal if user selected; initialize values
    $scope.openEdit = function() {
        var clientid = document.getElementById('usertoedit').value;
        if (clientid != "") {
            document.getElementById('editcontent').hidden = false;
            var client = $scope.getuserbyid(clientid);
            $scope.nowfname = client['fname'];
            $scope.nowlname = client['lname'];
            $scope.nowuname = client['uname'];
            $scope.nowlanguage = client['language'];
            $scope.nowlawyer = (client['type'] & 2) ? true : false;
            $scope.nowclient = (client['type'] & 1) ? true : false;
            $scope.nowadvocate = (client['type'] & 4) ? true : false;
            $scope.nowadministrator = (client['type'] & 8) ? true : false;
        }
    };

     // given id, returns user with that id
    $scope.getuserbyid = function(id) {
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i]['id'] == id) {
                return $scope.users[i];
            }
        }
    };

    // is there enough info to edit a new user?
    // submit button controller
    $scope.enougheditinfo = function() {
        if (($scope.nowclient || $scope.nowlawyer || $scope.nowadvocate || $scope.nowadministrator)
            && $scope.nowfname != ""
            && $scope.nowlname != ""
            && $scope.nowuname != ""
            && $scope.nowlanguage != "preference")
            return true;
        else
            return false;
    };

    // edit a given user
    $scope.submitEdit = function() {
        var type = 0;
        if ($scope.nowclient) {
            type += 1;
        }
        if ($scope.nowlawyer) {
            type += 2;
        }
        if ($scope.nowadvocate) {
            type += 4;
        }
        if ($scope.nowadministrator) {
            type += 8;
        }
        console.log({
            'id': document.getElementById('usertoedit').value,
            'fname': $scope.nowfname,
            'lname': $scope.nowlname,
            'uname': $scope.nowuname,
            'language': $scope.nowlanguage,
            'type': type,
            'clients': []
        });
        for (var i = 0; i < $scope.users.length; i++) { // reflect changes in our array!
                if ($scope.users[i]['id'] == document.getElementById('usertoedit').value) {
                    $scope.users[i] = {
                        'id': document.getElementById('usertoedit').value,
                        'fname': $scope.nowfname,
                        'lname': $scope.nowlname,
                        'uname': $scope.nowuname,
                        'language': $scope.nowlanguage,
                        'type': type,
                        'clients': []
                    };
                }
            }
            $scope.users.sort(compare);
            $scope.setClientsAndReps();
    };

/************************* EDIT USER END **********************/



/*********************** ASSIGN CLIENT ************************/
    // opens assign client modal
    $scope.assignClient = function() {
        var j =jQuery.noConflict(); 
        j('#myModal3').modal('show'); 
    };

    // open hidden section of client assignment modal if user selected; initialize values
    $scope.openPair = function() {
        var clientid = document.getElementById('usertopair').value;
        if (clientid != "") {
            document.getElementById('paircontent').hidden = false;
            for (var i = 0; i < $scope.reps.length; i++) {
                document.getElementById($scope.reps[i]['id']).checked = false;
                for (var j = 0; j < $scope.reps[i]['clients'].length; j++) {
                    if ($scope.reps[i]['clients'][j] == clientid) {
                        document.getElementById($scope.reps[i]['id']).checked = true;
                    }
                }
            }
        }
    };

    // is there enough info to assign a client to a group of lawyers?
    // submit button controller
    $scope.enoughassigninfo = function() {
        if (document.getElementById('usertopair').value != "")
            return true;
        else
            return false;
    };

    // submits an assignment of a client to a group of lawyers
    $scope.submitPair = function() {
        var clientid = document.getElementById('usertopair').value;
        var clientreps = []; // array of client's reps

        for (var i = 0; i < $scope.users.length; i++) {

            // if this is true, they're not a representative
            if (($scope.users[i]['type'] & 2) == 0 && 
                ($scope.users[i]['type'] & 4) == 0) {
                continue;
            }

            // if they're checked off as one of the client's reps
            if (document.getElementById($scope.users[i]['id']).checked) {
                clientreps.push($scope.users[i]['id']);
                var alreadythere = false;
                for (var j = 0; j < $scope.users[i]['clients'].length; j++) {
                    if ($scope.users[i]['clients'][j] == clientid) {
                        alreadythere = true;
                        break;
                    }
                }
                if (!alreadythere) {
                    $scope.users[i]['clients'].push(clientid);
                }
            }

            else { // remove client from unchecked reps' client lists
                var newclients = []; // rep's new client array, without current client
                for (var j = 0; j < $scope.users[i]['clients'].length; j++) {
                    if ($scope.users[i]['clients'][j] != clientid) {
                        newclients.push($scope.users[i]['clients'][j]);
                    }
                }
                $scope.users[i]['clients'] = newclients;
            }
        }
        console.log({'reps':clientreps,'client':clientid});
        $scope.setClientsAndReps();
    };

/********************* ASSIGN CLIENT END **********************/



/****************** NEEDED FOR ALL MODULES ********************/
    // hard-coded for now. Later, get this from the server!!
    $scope.users = [
        {
        'id': 1,
        'fname': 'James',
        'lname': 'Smith',
        'uname': 'JSmith01',
        'language': 'english',
        'type' : 11, 
        'clients': [3]
        },
        {
        'id': 2,
        'fname': 'Rita',
        'lname': 'Shatz',
        'uname': 'RShatz01',
        'language': 'spanish',
        'type' : 12, 
        'clients': [1,5]
        },
        {
        'id': 3,
        'fname': 'Sarah',
        'lname': 'Best',
        'uname': 'SBest02',
        'language': 'english',
        'type' : 13, 
        'clients': [5]
        },
        {
        'id': 4,
        'fname': 'Johnson',
        'lname': 'Johnson',
        'uname': 'JJohnson',
        'language': 'english',
        'type' : 14, 
        'clients': [3,5]
        },
        {
        'id': 5,
        'fname': 'Bianca',
        'lname': 'Blueberry',
        'uname': 'BB',
        'language': 'spanish',
        'type' : 15, 
        'clients': [3]
        }
    ];
    $scope.users.sort(compare);
        
    // sets arrays of clients and reps based on array of overall users
    $scope.setClientsAndReps = function() {
        $scope.clients = [];
        $scope.reps = [];
        for (var i = 0; i < $scope.users.length; i++) {
            if (($scope.users[i]['type'] & 1) > 0) {
                $scope.clients.push($scope.users[i]);
            }
            if (($scope.users[i]['type'] & 2) > 0 || ($scope.users[i]['type'] & 4)  > 0) {
                $scope.reps.push($scope.users[i]);
            }
        }
    };

    $scope.setClientsAndReps();
});

