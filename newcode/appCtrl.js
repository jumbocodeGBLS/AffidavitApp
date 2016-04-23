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
                templateUrl: "newcode/navtemplate.html"
            },
            "pgbody": {
                templateUrl: "newcode/admintemplate.html"
            }
        }
    })
    .state('history', {
        url: "/history",
        views: {
            "nav": {
                templateUrl: "newcode/navtemplate.html"
            },
            "pgbody": {
                templateUrl: "newcode/historytemplate.html"
            }
        }
    })
    .state('clientlist', {
        url: "/clientlist",
        views: {
            "nav": {
                templateUrl: "newcode/navtemplate.html"
            },
            "pgbody": {
                templateUrl: "newcode/clientlisttemplate.html"
            }
        }
    })
    .state('clientview', {
        url: "/clientview",
        views: {
            "nav": {
                templateUrl: "newcode/navtemplate.html"
            },
            "pgbody": {
                templateUrl: "newcode/clientviewtemplate.html"
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
                templateUrl: "newcode/logintemplate.html"
            }
        }
    });
    $urlRouterProvider.otherwise('login');
});

// don't use '#'s in URLs
angular.module('myapp').config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);
