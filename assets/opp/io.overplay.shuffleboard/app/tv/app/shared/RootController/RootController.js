/**
 *
 * Functionality that is shared across entire app should be in here or a service.
 *
 *
 */


app.controller("rootController", function ($scope, $timeout, $location, $log, $rootScope, $http, $window) {

    console.log("Loading rootController");

    $scope.hideUI = false;

    var _selectedIcon = 0;

    $scope.goLauncher = function () {
        //TODO do some teardown anim, but for now, BOLT
        $window.location.href = "/opkg/io.overplay.apppicker/app/tv/index.html";
    }

    $scope.keyPressed = function (event) {

        console.log("Key pressed: " + event.which);
        goLauncher();
    }

    $scope.buttonPushed = function (netvButton) {

        /*
         Buttons are: 'widget', 'cpanel', 'up', 'down', 'left', 'right', 'center'
         */
        console.log("NeTV remote pressed: " + netvButton);


        $scope.$apply(function () {

            switch (netvButton) {

                case 'widget':
                    goLauncher();
                    break;

                case 'cpanel':
                    $rootScope.$broadcast('CPANEL');
                    break;

                default:
                    break;

            }

        })


    }


    $scope.showMainUi = function () {
        $log.info("Showing main UI");
        $window.location.href = "/opkg/io.overplay.apppicker/app/tv/index.html";
    }


});

