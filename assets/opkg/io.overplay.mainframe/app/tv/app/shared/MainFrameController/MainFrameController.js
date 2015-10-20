/*********************************

 File:       MainFrameController.js
 Function:   Controller for MainFrame
 Copyright:  Overplay TV
 Date:       10/14/15 5:35 PM
 Author:     mkahn

 Pretty much does everything for Mainframe since all it does is sequence iframes.

 **********************************/


app.controller("mainFrameController", function ($scope, $timeout, $location, $log, $rootScope, $http, $window, optvModel) {

    console.log("Loading mainFrameController");

    $scope.uiState = {showAppPicker: false};

    $scope.widgetApps = [];
    $scope.crawlerApps = [];


    var widgetLocations = ['tl', 'tr', 'br', 'bl'];
    var crawlerLocations = ['bottom', 'top'];


    $scope.keyPressed = function (event) {

        $log.info("Keyboard button pressed: " + event.which);

    }

    function showApps(shouldShow) {
        //TODo Sequencing animation? Should be done by position on screen, not array position...

        $log.warn("SHOWING APPS: " + shouldShow);
        $scope.widgetApps.forEach(function (a) {
            a.show = shouldShow;
        })

        $scope.crawlerApps.forEach(function (a) {
            a.show = shouldShow;
        })
    }

    function showAppPicker(shouldShow) {

        $scope.uiState.showAppPicker = shouldShow;
    }

    function toggleAppPicker() {

        $scope.uiState.showAppPicker = !$scope.uiState.showAppPicker;
        showApps(!$scope.uiState.showAppPicker);

    }

    $scope.buttonPushed = function (netvButton) {

        /*
         Buttons are: 'widget', 'cpanel', 'up', 'down', 'left', 'right', 'center'
         */
        $log.info("NeTV remote pressed: " + netvButton);


        $scope.$apply(function () {

            switch (netvButton) {

                case 'widget':
                    $log.info("Widget button pressed");
                    toggleAppPicker();
                    break;

                case 'left':
                case 'right':
                case 'center':
                case 'cpanel':
                default:
                    break;

            }

        })


    }


    function moveWidgetToSpot(app, spot) {

        switch (spot) {

            case 'tl':
                app.currentFrame.top = "5vh";
                app.currentFrame.left = "3vw";
                break;

            case 'tr':
                app.currentFrame.top = "5vh";
                app.currentFrame.left = "80vw";
                break;

            case 'bl':
                app.currentFrame.top = "60vh";
                app.currentFrame.left = "3vw";
                break;

            case 'br':
                app.currentFrame.top = "60vh";
                app.currentFrame.left = "80vw";
                break;

        }

        app.spot = spot;

    }

    function moveCrawlerToSpot(app, spot) {

        switch (spot) {

            case 'bottom':
                app.currentFrame.top = "65vh";
                app.currentFrame.left = "3vw";
                break;

            case 'top':
                app.currentFrame.top = "5vh";
                app.currentFrame.left = "3vw";
                break;

        }
        app.spot = spot;

    }

    /*

     Move messages need to be like this for now:

     { "to":"io.overplay.mainframe", "from":"io.overplay.shuffleboard", "data":{ "move": { "spot" : "tl" }}}

     */

    function inboundMessageMain(msg) {
        $log.info("Mainframe received message: " + msg);

        msg.forEach(
            function (m) {

                //Launch
                if (m.data && m.data.launch) {

                    //Check and see if this app is already running
                    var app = m.data.launch;
                    app.src = '/opkg/' + app.reverseDomainName + '/app/tv/';
                    app.show = false;

                    switch (app.appType) {

                        case 'widget':
                            //Check if running already
                            var idx = _.findIndex($scope.widgetApps, function (running) {
                                return app.reverseDomainName = running.reverseDomainName;
                            });

                            if (idx < 0) {
                                $scope.widgetApps.push(app);
                                if ($scope.widgetApps.length > 4) {
                                    $scope.widgetApps = $scope.widgetApps.slice(1, 4);
                                }

                                for (var i = 0; i < $scope.widgetApps.length; i++) {
                                    moveWidgetToSpot($scope.widgetApps[i], widgetLocations[i]);
                                }
                            }

                            break;

                        case 'crawler':
                            //Check if running already
                            var idx = _.findIndex($scope.widgetApps, function (running) {
                                return app.reverseDomainName = running.reverseDomainName;
                            });

                            if (idx < 0) {
                                $scope.crawlerApps.push(app);
                                if ($scope.crawlerApps.length > 2) {
                                    $scope.crawlerApps = $scope.crawlerApps.slice(1, 2);
                                }

                                for (var i = 0; i < $scope.crawlerApps.length; i++) {
                                    moveCrawlerToSpot($scope.crawlerApps[i], crawlerLocations[i]);
                                }
                            }
                            break;

                    }


                    $http.post('/api/v1/setrunning', {crawlers: $scope.crawlerApps, widgets: $scope.widgetApps});
                    showAppPicker(false);
                    //Give the app picker some time to hide
                    $timeout(function () {
                        $log.debug("Delayed show of apps");
                        showApps(true);
                    }, 250);

                }

                //Kill
                if (m.data && m.data.kill) {

                    $scope.runningApps = _.remove($scope.runningApps, function (app) {
                        return app.reverseDomainName == m.data.kill.reverseDomainName;
                    })
                }

                //Move
                if (m.data && m.data.move) {

                    var spot = m.data.move.spot;
                    var appToMove = m.data.move.app;

                    var app = _.find($scope.runningApps, function (a) {
                        return appToMove = a.reverseDomainName;
                    });

                    //TODO This cannot be px, needs to be vw, vh for different resolutions!!!
                    if (app && app.appType == 'widget') {
                        moveWidgetToSpot(app, spot);
                    } else {
                        moveCrawlerToSpot(app.spot);
                    }
                }

                //TODO this should be a case statement
                //Show Dash
                if (m.data && m.data.dash) {

                    switch (m.data.dash) {

                        case 'show':
                            showApps(false);
                            $timeout(function () { showAppPicker(true); }, 1500);
                            break;

                        case 'hide':
                            showAppPicker(false);
                            $timeout(function () { showApps(true); }, 1500);
                            break;

                        case 'toggle':
                            //TODO sequencing
                            toggleAppPicker();
                            break;

                    }


                }


            });
    }

    optvModel.init({
        appName: "io.overplay.mainframe",
        refreshInterval: 1000,
        messageCallback: inboundMessageMain
    });

    //Load the main app
    $http.get('/api/v1/apps?isMain=true')
        .then(function (data) {
                  $scope.launcher = data.data[0];
                  $scope.launcher['src'] = '/opkg/' + $scope.launcher.reverseDomainName + '/app/tv/index.html';
                  $timeout(function () { showAppPicker(true) }, 1500);
              })


});

