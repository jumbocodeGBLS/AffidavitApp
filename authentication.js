authentication = {};   
    // call to authenticate the user with firebase
    authentication.login = function(user, callback) {
      $http.post('/login', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },
    // call to log the user out of firebase
    authentication.logout = function() {
      $http.post('/logout')
           .then(function successCallback(response) {
              console.log(response);
            }, function errorCallback(response) {
              console.log(response);
            });
    },
    // call to create a new user in firebase
    authentication.register = function(user, callback) {
      $http.post('/register', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },
    // call to get the user authenticated with firebase
    authentication.getUser = function(callback) {
      $http.get('/user')
           .then(function successCallback(response) {      
              console.log(response);
              callback(response.data);
            }, function errorCallback(response) {
              console.log(response);
            });
    },

    // call to delete the user from firebase
    authentication.deleteuser = function(user, callback) {
      $http.post('/deleteuser', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to change user's password
    authentication.changePassword = function(user, callback) {
      $http.post('/changePassword', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to change user's email
    authentication.changeEmail = function(user, callback) {
      $http.post('/changeEmail', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to reset user's password
    authentication.resetPassword = function(user, callback) {
      $http.post('/resetPassword', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    }
  }
};
