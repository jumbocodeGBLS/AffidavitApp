// public/shared/Authentication/AuthenticationService.js

angular.module('myapp').factory('AuthenticationService', ['$http', '$state', '$window', AuthenticationService]);
  
function AuthenticationService($http, $state, $window) {
  return {
    // call to authenticate the user with firebase
    login : function(user, callback) {
      $http.post('/login', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to log the user out of firebase
    logout: function(callback) {
      console.log("log out");
      $http.post('/logout')
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to create a new user in firebase
    register: function(user, callback) {
      $http.post('/register', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to get the user authenticated with firebase
    getUser: function(callback) {
      $http.get('/user')
           .then(function successCallback(response) {
              console.log(response);
              callback(response.data);
            }, function errorCallback(response) {
              console.log(response);
            });
    },

    // call to delete the user from firebase
    deleteuser: function(user, callback) {
      $http.post('/deleteuser', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to change user's password
    changePassword: function(user, callback) {
      $http.post('/changePassword', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to change user's email
    changeEmail: function(user, callback) {
      $http.post('/changeEmail', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    },

    // call to reset user's password
    resetPassword: function(user, callback) {
      $http.post('/resetPassword', user)
           .then(function successCallback(response) {
              callback(response);
            }, function errorCallback(response) {
              callback(response);
            });
    }
  }
};
