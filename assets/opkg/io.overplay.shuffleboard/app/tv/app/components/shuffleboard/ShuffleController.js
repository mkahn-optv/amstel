/**
 * Created by mkahn on 4/28/15.
 */

app.controller("shuffleController",
               function ($scope, $timeout, $http, $interval, optvModel, $log, $window) {

                   console.log("Loading shuffleController");


                   $scope.position = {corner: 0};
                   $scope.score = {red: 0, blue: 0, redHighlight: false, blueHighlight: false};

                   var _remoteScore = {};

                   $scope.$on('CPANEL', function () {

                       $scope.position.corner++;
                       if ($scope.position.corner > 3) $scope.position.corner = 0;

                   })


                   function updateLocalScore() {

                       var animRed = $scope.score.red < _remoteScore.red;
                       var animBlue = $scope.score.blue < _remoteScore.blue;

                       $scope.score.red = _remoteScore.red;
                       $scope.score.blue = _remoteScore.blue;


                       if (animRed) {

                           $scope.score.redHighlight = true;
                           $timeout(function () { $scope.score.redHighlight = false}, 500);
                       }

                       if (animBlue) {
                           $scope.score.blueHighlight = true;
                           $timeout(function () { $scope.score.blueHighlight = false}, 500);
                       }


                   }

                   function modelUpdate(data) {
                       $log.debug("Model update callback...")
                       _remoteScore = data;
                       updateLocalScore();
                       if (data.toTV == "home") {
                           $log.info("Showing main UI");
                           optvModel.model.toTV = "";
                           optvModel.save();
                           $window.location.href = "/opkg/io.overplay.apppicker/app/tv/index.html";
                       }
                   }

                   function inboundMessage(msg) {
                       $log.debug("Inbound message...");
                   }

                   function updateFromRemote() {

                       optvModel.init({
                           appName: "io.overplay.shuffleboard",
                           refreshInterval: 1000,
                           dataCallback: modelUpdate,
                           messageCallback: inboundMessage,
                           initialValue: {red: 0, blue: 0, toTV: undefined},
                           autoSync: false
                       })
                           .then(modelUpdate);

                   }


                   updateFromRemote();


               });
