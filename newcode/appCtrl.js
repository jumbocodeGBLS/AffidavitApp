// used to sort clients by last name
function compare(a,b) {
  if (a['lname'] < b['lname']) {
      return -1;
  } else if (a['lname'] > b['lname']) {
      return 1;
  } else {
      return 0;
  }
}

// angular app
myapp = angular.module('myapp', ["ui.router"]);

// configuration routes
myapp.config(function($stateProvider, $urlRouterProvider){
$stateProvider
    .state('admin', {
        url: "/admin",
        views: {
            "nav": {
                templateUrl: "navtemplate.html"
            },
            "pgbody": {
                templateUrl: "admintemplate.html"
            }
        }
    })
    .state('history', {
        url: "/history",
        views: {
            "nav": {
                templateUrl: "navtemplate.html"
            },
            "pgbody": {
                templateUrl: "historytemplate.html"
            }
        }
    })
    .state('clientlist', {
        url: "/clientlist",
        views: {
            "nav": {
                templateUrl: "navtemplate.html"
            },
            "pgbody": {
                templateUrl: "clientlisttemplate.html"
            }
        }
    })
    .state('clientview', {
        url: "/clientview",
        views: {
            "nav": {
                templateUrl: "navtemplate.html"
            },
            "pgbody": {
                templateUrl: "clientviewtemplate.html"
            }
        }
    })
    .state('login', {
        url: "/login",
        views: {
            "nav": {
                template: ""
            },
            "pgbody": {
                templateUrl: "logintemplate.html"
            }
        }
    });
    $urlRouterProvider.otherwise('login');
});

// don't use '#'s in URLs
angular.module('myapp').config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);
