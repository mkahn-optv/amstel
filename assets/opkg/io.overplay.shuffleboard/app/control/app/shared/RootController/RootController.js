/**
 *
 * Functionality that is shared across entire app should be in here or a service.
 *
 *
 */


app.controller("rootController", function ($scope, $timeout, $location, $log, $rootScope) {

    console.log("Loading rootController");

    $scope.goLauncher = function () {
        //TODO do some teardown anim, but for now, BOLT
        $window.location.href = "/opkg/io.overplay.apppicker/app/tv/index.html";
    }

});

