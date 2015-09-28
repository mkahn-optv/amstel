/**
 * Created by mkahn on 4/28/15.
 */

app.controller("shuffleController",
               function ($scope, $timeout, $http, $interval) {

                   console.log("Loading shuffleController");


                   $scope.position = {corner: 0};
                   $scope.score = {red: 19, blue: 21, redHighlight: false, blueHighlight: false};

                   var _remoteScore = {};

                   $scope.$on('CPANEL', function () {

                       $scope.position.corner++;
                       if ($scope.position.corner > 3) $scope.position.corner = 0;

                   })

                   var hackUrl = 'http://192.168.1.3:2080';



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




                   function updateFromRemote() {

                        /*
                       $http.get(hackUrl + '/AppData?appName=shuffleboard')
                           .then(function (data) {
                                     var darr = data.data;
                                     if (darr.length==0 || darr[0].data.red === undefined) {
                                         console.log("invalid shuffle score, creating new score");
                                         _remoteScore = {data: {red: 0, blue: 0}, appName: 'shuffleboard'};
                                         $http.post(hackUrl + '/AppData', _remoteScore)
                                             .then(updateLocalScore);
                                     } else {
                                        _remoteScore = darr[0].data;
                                         updateLocalScore();
                                     }

                                 })
                           .catch(function (err) {
                                      console.log("Error getting remote score! " + err)

                                  })
                        */

                   }

                    /*
                   $interval(updateFromRemote, 500);

                   updateFromRemote();

                   */


               });
