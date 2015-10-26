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

                       if (shouldShow) {
                           $log.debug("Auto-dismissing app picker");
                           $timeout(function () { showAppPicker(false); }, 6000 * 3);
                       }
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


                       //$scope.$apply(function () {

                       switch (netvButton) {

                           case 'widget':
                               $log.info("Widget button pressed");
                               toggleAppPicker();
                               break;

                           case 'left':
                           case 'right':
                           case 'center':
                           case 'cpanel':
                           case 'up':
                           case 'down':
                               optvModel.postMessage({to: "io.overplay.apppicker", data: {remote: netvButton}});
                               break;
                           default:
                               break;

                       }

                       //})


                   }

                   /**
                    * Does the 'vw' style to 'px' mapping a modern browser would do for us, sigh...
                    * @param pctg
                    */
                   function convertToPx(pctg, val) {

                       var int = parseInt(pctg.replace(/v[w,h]/, ""));
                       return Math.floor((int / 100) * val) + "px";
                   }

                   var widgetLocations = ['tl', 'tr', 'br', 'bl'];
                   var crawlerLocations = ['bottom', 'top'];

                   function moveWidgetToSpot(app, spot) {

                       switch (spot) {

                           case 'tl':
                               app.currentFrame.top = .05 * $scope.windowDimension.height + 'px';
                               app.currentFrame.left = .03 * $scope.windowDimension.width + 'px';
                               break;

                           case 'tr':
                               app.currentFrame.top = .05 * $scope.windowDimension.height + 'px';
                               app.currentFrame.left = .85 * $scope.windowDimension.width + 'px';
                               break;

                           case 'bl':
                               app.currentFrame.top = .6 * $scope.windowDimension.height + 'px';
                               app.currentFrame.left = .03 * $scope.windowDimension.width + 'px';
                               break;

                           case 'br':
                               app.currentFrame.top = .6 * $scope.windowDimension.height + 'px';
                               app.currentFrame.left = .85 * $scope.windowDimension.width + 'px';
                               break;

                       }

                       app.spot = spot;

                   }

                   function moveCrawlerToSpot(app, spot) {

                       switch (spot) {

                           case 'bottom':
                               app.currentFrame.top = .65 * $scope.windowDimension.height + 'px';
                               app.currentFrame.left = .03 * $scope.windowDimension.width + 'px';
                               break;

                           case 'top':
                               app.currentFrame.top = .05 * $scope.windowDimension.height + 'px';
                               app.currentFrame.left = .03 * $scope.windowDimension.width + 'px';
                               break;

                       }
                       app.spot = spot;

                   }

                   /*

                    Move messages need to be like this for now:

                    { "to":"io.overplay.mainframe", "from":"io.overplay.shuffleboard", "data":{ "move": { "spot" : "tl" }}}

                    */

                   function inboundMessageMain(m) {

                       $scope.$apply(function () {

                           $log.info("Mainframe received message: " + m);

                           //Launch
                           if (m.message && m.message.launch) {

                               //Check and see if this app is already running
                               var app = m.message.launch;
                               $log.info("Request to launch: " + app.reverseDomainName + " received by MAINFRAME");
                               app.src = '/opkg/' + app.reverseDomainName + '/app/tv/';
                               app.show = false;

                               //Scale the width and height by measured. Old browser does not support vw, vh correctly.
                               app.currentFrame.height = (app.currentFrame.height / 100 * $scope.windowDimension.height) + 'px';
                               app.currentFrame.width = (app.currentFrame.width / 100 * $scope.windowDimension.width) + 'px';


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


                               $http.post('/api/v1/setrunning', {
                                   crawlers: $scope.crawlerApps,
                                   widgets: $scope.widgetApps
                               });
                               showAppPicker(false);
                               //Give the app picker some time to hide
                               $timeout(function () {
                                   $log.debug("Delayed show of apps");
                                   showApps(true);
                               }, 250);

                           }

                           //Kill
                           if (m.message && m.message.kill) {

                               $scope.runningApps = _.remove($scope.runningApps, function (app) {
                                   return app.reverseDomainName == m.message.kill.reverseDomainName;
                               })
                           }

                           //Move
                           //TODO does not work (will crash) for crawlers
                           if (m.message && m.message.move) {

                               var spot = m.message.move.spot;
                               var appToMove = m.message.move.app;


                               var app = _.find($scope.widgetApps, function (a) {
                                   return appToMove = a.reverseDomainName;
                               });

                               if (spot == 'next') {
                                   //request to cycle this app
                                   var currentSpot = app.spot;
                                   var spotIdx = widgetLocations.indexOf(currentSpot);
                                   spotIdx++;
                                   if (spotIdx > widgetLocations.length) spotIdx = 0;
                                   spot = widgetLocations[spotIdx];
                               }
                               moveWidgetToSpot(app, spot);

                           }

                           //TODO this should be a case statement
                           //Show Dash
                           if (m.message && m.message.dash) {

                               switch (m.message.dash) {

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
                       messageCallback: inboundMessageMain
                   });

                   //Load the main app
                   $http.get('/api/v1/apps?isMain=true')
                       .then(function (data) {
                                 $scope.launcher = data.data[0];
                                 $scope.launcher['src'] = '/opkg/' + $scope.launcher.reverseDomainName + '/app/tv/index.html';
                                 $scope.launcher.currentFrame.height = convertToPx($scope.launcher.currentFrame.height, $scope.windowDimension.height);
                                 $scope.launcher.currentFrame.width = convertToPx($scope.launcher.currentFrame.width, $scope.windowDimension.width);

                                 $timeout(function () { showAppPicker(true) }, 500);
                             })


                   $scope.$watch(function () {
                       return window.innerWidth;
                   }, function (value) {
                       console.log(window.innerWidth + ' x ' + window.innerHeight);
                       $scope.windowDimension = {
                           text: window.innerWidth + ' x ' + window.innerHeight,
                           width: window.innerWidth,
                           height: window.innerHeight
                       }
                   });

               }
)
;

