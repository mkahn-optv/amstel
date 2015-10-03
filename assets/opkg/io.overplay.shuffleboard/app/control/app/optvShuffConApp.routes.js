app.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'app/components/shuffcon/shuffcon.partial.html',
            controller: 'shuffconController'
        })




});





