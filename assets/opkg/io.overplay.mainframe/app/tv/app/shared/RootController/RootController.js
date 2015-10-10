/**
 *
 *
 *
 *
 */


app.controller("rootController", function ($scope, $timeout, $location, $log, $rootScope, $http, $window, optvModel) {

    console.log("Loading rootController");

    $scope.launcher = {hide: false}
    $scope.runningApps = [];


    $scope.keyPressed = function (event) {

        console.log("Key pressed: " + event.which);

    }

    $scope.buttonPushed = function (netvButton) {

        /*
         Buttons are: 'widget', 'cpanel', 'up', 'down', 'left', 'right', 'center'
         */
        console.log("NeTV remote pressed: " + netvButton);


        $scope.$apply(function () {

            switch (netvButton) {

                case 'widget':
                    break;

                case 'left':

                    break;

                case 'right':

                    break;

                case 'center':

                    break;

                case 'cpanel':

                    break;

                default:
                    break;

            }

        })


    }

    //Load the main app
    $http.get('/api/v1/apps?isMain=true')
        .then(function (data) {

                  $scope.launcher = data.data[0];
                  $scope.launcher['src'] = '/opkg/' + $scope.launcher.reverseDomainName + '/app/tv/index.html';

              })


    $scope.clicked = function (app) {
        $log.info("Clicked on: " + app.reverseDomainName);
        $window.location.href = "/opkg/" + app.reverseDomainName + "/app/tv/index.html";
    }



    function inboundMessageMain(msg) {
        $log.info("Mainframe received message: "+msg);

        msg.forEach( function(m){

            if (m.data && m.data.launch){

                var app = m.data.launch;
                app.src = '/opkg/'+ app.reverseDomainName + '/app/tv/';
                $scope.runningApps.push(app);
            }

        })

        }

    optvModel.init({
            appName: "io.overplay.mainframe",
            refreshInterval: 1000,
            messageCallback: inboundMessageMain,
            initialValue: {},
            autoSync: false
        });



});

