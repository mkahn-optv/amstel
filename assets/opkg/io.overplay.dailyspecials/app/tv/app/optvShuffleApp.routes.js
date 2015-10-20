//Probably don't need a $routeProvider, but here in case we do...

app.config(function ($routeProvider) {
    $routeProvider


        .when('/', {
            templateUrl: 'app/components/shuffleboard/shuffle.partial.html',
            controller: 'shuffleController'
        })


        .otherwise({
            templateUrl: 'app/components/Warning/notavailable.partial.html'

        })


});





