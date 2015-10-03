app.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {})


        .when('/shuffle', {
            templateUrl: 'app/components/shuffleboard/shuffle.partial.html',
            controller: 'shuffleController'
        })


        .otherwise({
            templateUrl: 'app/components/Warning/notavailable.partial.html'

        })


});





