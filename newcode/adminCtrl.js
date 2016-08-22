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

    // returns user's type as an int and a string
    $scope.getType = function(client, lawyer, advocate, administrator) {
        var type = 0;
        var typestr = "";
        if (client) {
            type += 1;
            typestr = "client";
        }
        if (lawyer) {
            type += 2;
            typestr = "lawyer";
        }
        if (advocate) {
            type += 4;
            typestr = "other";
        }
        if (administrator) {
            type += 8;
            typestr = "admin"
        }
        return {
            'type': type,
            'typestr': typestr
        }
    }

    // adds a user to postres DB and scope vars once registered with firebase
    $scope.createUser = function(user, type) {
        var j = jQuery.noConflict();
        j.post('/createUser', user, function(response, status) {
            console.log(response);
            user['user_id'] = response.max
            $scope.reserror = "";
            if (type['typestr'] == 'client') {
                user_info  = {
                    'user_id': response.max,
                    'datetime': (new Date()).toISOString()
                }
                j.post('/createAffidavit', user_info, function(response, status) {
                    console.log(response, status);
                    if (response.status == 200) {
                        console.log(response)
                    } else {
                        $scope.reserror = response;
                    }
                });
            }
            j('#myModal1').modal('hide');
            $scope.users.push(user);
            $scope.users.sort(compare);
            $scope.setClientsAndReps();
        });
    };

    // create a new user
    $scope.submitNew = function() {
        var type = $scope.getType($scope.client,
                                  $scope.lawyer,
                                  $scope.advocate,
                                  $scope.administrator);
        var user = { // add new user to our array!
            'fname': $scope.fname,
            'lname': $scope.lname,
            'uname': $scope.uname,
            'language': $scope.language,
            'type': type['type'],
            'typestr': type['typestr'],
            'viewee': [],
            'progress': 0
        };
        var firebase_info = {
            'username': $scope.uname,
            'password': $scope.password,
            'password2': $scope.password
        };
        if (!validateEmail($scope.uname)) {
            alert("Invalid email address");
            return;
        }
        AuthenticationService.register(firebase_info, function(response) {
            console.log(response);
            if (response.status == 200) {
                $scope.createUser(user, type)
            } else {
                $scope.reserror = response;
            }
        });
    };

    // from stackoverflow, checks if email looks valid
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
            $scope.nowlawyer = (client['type'] == 2) ? true : false;
            $scope.nowclient = (client['type'] == 1) ? true : false;
            $scope.nowadvocate = (client['type'] == 4) ? true : false;
            $scope.nowadministrator = (client['type'] == 8) ? true : false;
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
        var type = $scope.getType($scope.nowclient,
                                  $scope.nowlawyer,
                                  $scope.nowadvocate,
                                  $scope.nowadministrator)
        newu = {
            'user_id': document.getElementById('usertoedit').value,
            'fname': $scope.nowfname,
            'lname': $scope.nowlname,
            'uname': $scope.nowuname,
            'language': $scope.nowlanguage,
            'type': type['type'],
            'typestr': type['typestr'],
            'viewee': [],
            'progress': 0
        };
        var j = jQuery.noConflict();
        j.post('/updateUser', newu, function(response, status) {
            console.log(response, status);
            for (var i = 0; i < $scope.users.length; i++) { // reflect changes in our array!
                if ($scope.users[i]['user_id'] == document.getElementById('usertoedit').value) {
                    $scope.users[i] = {
                        'user_id': document.getElementById('usertoedit').value,
                        'fname': $scope.nowfname,
                        'lname': $scope.nowlname,
                        'uname': $scope.nowuname,
                        'language': $scope.nowlanguage,
                        'type': type['type'],
                        'viewee': []
                    };
                }
            }
            $scope.users.sort(compare);
            $scope.setClientsAndReps();
        });
    };

/************************* EDIT USER END **********************/



/*********************** ASSIGN CLIENT ************************/
    // opens assign client modal
    $scope.assignClient = function() {
        var j =jQuery.noConflict(); 
        j('#myModal3').modal('show'); 
    };

    // open hidden section of client assignment modal if user selected, and
    // initialize values
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

    // create assignment of client (viewee) to a rep (viewer)
    $scope.createPair = function(viewer, viewee) {
        var j = jQuery.noConflict();
        var info = {
            viewer: viewer,
            viewee: viewee
        }
        j.post('/createAssignment', info, function(response, status) {
            console.log(response, status)
        });
    };

    // delete assignment of client (viewee) to a rep (viewer)
    $scope.deletePair = function(viewer, viewee) {
        var j = jQuery.noConflict();
        var info = {
            viewer: viewer,
            viewee: viewee
        }
        j.post('/deleteAssignment', info, function(response, status) {
            console.log(response, status)
        });
    };

    // submits an assignment of a client to a group of lawyers
    $scope.submitPair = function() {
        var clientid = document.getElementById('usertopair').value;

        for (var i = 0; i < $scope.users.length; i++) {

            if ($scope.users[i]['type'] == 1) { // client, not a rep
                continue;
            }

            // if they're checked off as one of the client's reps
            if (document.getElementById($scope.users[i]['user_id']).checked) {
                var alreadythere = false;
                for (var j = 0; j < $scope.users[i]['viewee'].length; j++) {
                    if ($scope.users[i]['viewee'][j] == clientid) {
                        alreadythere = true;
                        break;
                    }
                }
                if (!alreadythere) {
                    $scope.createPair($scope.users[i]['user_id'], clientid);
                    $scope.users[i]['viewee'].push(clientid);
                }
            }
            else { // remove client from unchecked reps' client lists
                var newclients = []; // rep's new client array w/o curr client
                for (var j = 0; j < $scope.users[i]['viewee'].length; j++) {
                    if ($scope.users[i]['viewee'][j] != clientid) {
                        newclients.push($scope.users[i]['viewee'][j]);
                    } else {
                        $scope.deletePair($scope.users[i]['user_id'], clientid);
                    }
                }
                $scope.users[i]['viewee'] = newclients;
            }
        }
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
                if (msg[i]['uname'] == $scope.users[j]['uname']) {
                    $scope.users[j]['viewee'].push(msg[i]['viewee']);
                    alreadyIn = true;
                }
            }
            if (!alreadyIn){
                var newperson = msg[i];
                var viewee = msg[i]['viewee'];
                newperson.viewee = [];
                newperson.viewee.push(viewee);
                $scope.users.push(newperson);
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
                if ($scope.users[i]['uname'] == $scope.clients[j]['uname']) {
                    alreadyIn = true;
                }
            }
            for (var j = 0; j < $scope.reps.length; j++) {
                if ($scope.users[i]['uname'] == $scope.reps[j]['uname']) {
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











