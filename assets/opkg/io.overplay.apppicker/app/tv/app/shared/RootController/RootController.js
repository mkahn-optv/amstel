/**
 *
 * Functionality that is shared across entire app should be in here or a service.
 *
 *
 */


app.controller("rootController", function ($scope, $timeout, $location, $log, $rootScope, $http, $window, optvModel) {

    console.log("Loading rootController");

    //On/off screen animations handled by Mainframe
    //$scope.ui = {onscreen: false};

    var _selectedIcon = 0;

    $scope.keyPressed = function (event) {

        console.log("Key pressed: " + event.which);
        //toggleUI();
    }

    $scope.buttonPushed = function (netvButton) {

        /*
         Buttons are: 'widget', 'cpanel', 'up', 'down', 'left', 'right', 'center'
         */
        console.log("NeTV remote pressed: " + netvButton);


        $scope.$apply(function () {

            switch (netvButton) {

                case 'widget':
                    //toggleUI();
                    break;

                case 'left':
                    _selectedIcon--;
                    if (_selectedIcon < 0) _selectedIcon = $scope.apps.length - 1;
                    break;

                case 'right':
                    _selectedIcon++;
                    if (_selectedIcon == $scope.apps.length) _selectedIcon = 0;
                    break;

                case 'center':
                    $log.info("Center pushed. Go to: " + $scope.apps[_selectedIcon].reverseDomainName);
                    //toggleUI();
                    $scope.clicked($scope.apps[_selectedIcon]);
                    break;

                case 'cpanel':
                    $rootScope.$broadcast('CPANEL');
                    break;

                default:
                    break;

            }

        })


    }

    $scope.isSelected = function (idx) {
        return idx == _selectedIcon;
    }



    $http.get('/api/v1/apps?onLauncher=true')
        .then(function (data) {
                  $scope.apps = data.data;
              })


    $scope.clicked = function (app) {
        $log.info("Clicked on: " + app.reverseDomainName);
        //$window.location.href = "/opkg/"+app.reverseDomainName+"/app/tv/index.html";
        //$scope.ui.onscreen = false;
        //$timeout(function () {
         //   optvModel.postMessage({
         //       to: "io.overplay.mainframe", data: {launch: app}
         //   });
        //}, 500);

        optvModel.postMessage({
               to: "io.overplay.mainframe", data: {launch: app}
           });

    }

    function inboundMessage(msg) {
        $log.info("Inbound message..to APPPICKER");
        $log.info(JSON.stringify(msg));
    }

    optvModel.init({
        appName: "io.overplay.apppicker",
        refreshInterval: 1000,
        messageCallback: inboundMessage,
        initialValue: {},
        autoSync: false
    });

    //$timeout(function () { $scope.ui.onscreen = true }, 1500);

});

