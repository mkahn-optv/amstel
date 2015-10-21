/**
 * Created by mkahn on 4/28/15.
 */

app.controller("mfConController",
               function ($scope, $timeout, $http, $log, optvModel, $window) {

                   $log.info("Loading mfConController");

                   $scope.apps = [];

                   optvModel.init({
                       appName: "io.overplay.mainframe"
                   });


                   //Get all the apps to show on AppPicker
                   $http.get('/api/v1/apps?onLauncher=true')
                       .then(function (data) {
                                 $scope.apps = [];
                                 data.data.forEach(function (a) {

                                     a.iconPath = "/opkg/" + a.reverseDomainName + '/assets/icons/' + a.iconLauncher;
                                     $scope.apps.push(a);

                                 });


                             });

                   $scope.clicked = function (app) {

                       $log.info("Clicked on: " + app.reverseDomainName);
                       optvModel.postMessage({
                           to: "io.overplay.mainframe", data: {launch: app}
                       });

                       $window.location.href = '/opkg/'+app.reverseDomainName+'/app/control/index.html';

                   }


               });
