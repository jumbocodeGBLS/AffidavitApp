angular.module('myapp').controller('adminCtrl', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {

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
    $scope.reserror = '';

    // opens add user modal
    $scope.addUser = function() {
        var j =jQuery.noConflict(); 
        j('#myModal1').modal('show');
        $scope.reserror = ''; 
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
        var newu = { // add new user to our array!
            'user_id': document.getElementById('usertoedit').value,
            'fname': $scope.fname,
            'lname': $scope.lname,
            'uname': $scope.uname,
            //'id': $scope.users.length + 1,
            'language': $scope.language,
            'type': type,
            'viewee': []
        };
        console.log(newu);
        var firebaseu = {'username': $scope.uname, 'password': $scope.password, 'password2': $scope.password};
        if (!validateEmail($scope.uname)) {
            alert("Invalid email address");
            return;
        }
        AuthenticationService.register(firebaseu, function(response) {
            console.log(response);
            if (response.status == 200) {
                $scope.reserror = "";
                var j =jQuery.noConflict(); 
                j('#myModal1').modal('hide');
                $scope.users.push(newu);
                $scope.users.sort(compare);
                $scope.setClientsAndReps();
            } else {
                $scope.reserror = response;
            }
        });
    };

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

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

            console.log($scope.nowlanguage);
            console.log(document.getElementById('nowlanguage').value);
        }
    };

     // given id, returns user with that id
    $scope.getuserbyid = function(id) {
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i]['user_id'] == id) {
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
            'user_id': document.getElementById('usertoedit').value,
            'fname': $scope.nowfname,
            'lname': $scope.nowlname,
            'uname': $scope.nowuname,
            'language': $scope.nowlanguage,
            'type': type,
            'viewee': []
        });
        for (var i = 0; i < $scope.users.length; i++) { // reflect changes in our array!
                if ($scope.users[i]['user_id'] == document.getElementById('usertoedit').value) {
                    $scope.users[i] = {
                        'user_id': document.getElementById('usertoedit').value,
                        'fname': $scope.nowfname,
                        'lname': $scope.nowlname,
                        'uname': $scope.nowuname,
                        'language': $scope.nowlanguage,
                        'type': type,
                        'viewee': []
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
        console.log(clientid);
        if (clientid != "") {
            document.getElementById('paircontent').hidden = false;
            for (var i = 0; i < $scope.reps.length; i++) {
                document.getElementById($scope.reps[i]['user_id']).checked = false;
                console.log($scope.reps[i]);
                for (var j = 0; j < $scope.reps[i]['viewee'].length; j++) {
                    if ($scope.reps[i]['viewee'][j] == clientid) {
                        document.getElementById($scope.reps[i]['user_id']).checked = true;
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
            if (document.getElementById($scope.users[i]['user_id']).checked) {
                clientreps.push($scope.users[i]['user_id']);
                var alreadythere = false;
                for (var j = 0; j < $scope.users[i]['viewee'].length; j++) {
                    if ($scope.users[i]['viewee'][j] == clientid) {
                        alreadythere = true;
                        break;
                    }
                }
                if (!alreadythere) {
                    $scope.users[i]['viewee'].push(clientid);
                }
            }

            else { // remove client from unchecked reps' client lists
                var newclients = []; // rep's new client array, without current client
                for (var j = 0; j < $scope.users[i]['viewee'].length; j++) {
                    if ($scope.users[i]['viewee'][j] != clientid) {
                        newclients.push($scope.users[i]['viewee'][j]);
                    }
                }
                $scope.users[i]['viewee'] = newclients;
            }
        }
        console.log({'reps':clientreps,'client':clientid});
        $scope.setClientsAndReps();
    };

/********************* ASSIGN CLIENT END **********************/



/****************** NEEDED FOR ALL MODULES ********************/
    var j = jQuery.noConflict();
    j.ajax({
          method: "GET",
          url: '/allUserData'
    })
    .done(function(msg) {
        console.log(msg);
        $scope.users = [];

        for (var i = 0; i < msg.length; i++) {
            var alreadyIn = false;
            if (msg[i].type == "client") {
                msg[i].type = 1;
            } else if (msg[i].type == "lawyer") {
                msg[i].type = 2;
            } else if (msg[i].type == "admin") {
                msg[i].type = 8;
            } else {
                msg[i].type = 4;
            }
            for (var j = 0; j < $scope.users.length; j++) {
                if (msg[i]['fname'] == $scope.users[j]['fname']) {
                    alreadyIn = true;
                }
            }
            if (!alreadyIn){
                $scope.users.push(msg[i]);
            }
        }

        $scope.users.sort(compare);
        $scope.setClientsAndReps();
    });
        
    // sets arrays of clients and reps based on array of overall users
    $scope.setClientsAndReps = function() {
        $scope.clients = [];
        $scope.reps = [];
        console.log($scope.users);
        for (var i = 0; i < $scope.users.length; i++) {
            var alreadyIn = false;
            for (var j = 0; j < $scope.clients.length; j++) {
                if ($scope.users[i]['fname'] == $scope.clients[j]['fname']) {
                    alreadyIn = true;
                }
            }
            for (var j = 0; j < $scope.reps.length; j++) {
                if ($scope.users[i]['fname'] == $scope.reps[j]['fname']) {
                    alreadyIn = true;
                }
            }
            if (alreadyIn) {
                continue;
            }
            else if ($scope.users[i]['type'] == 1) {
                $scope.clients.push($scope.users[i]);
            }
            else {
                $scope.reps.push($scope.users[i]);
            }
        }
        console.log($scope.clients, $scope.reps);
    };
}]);











