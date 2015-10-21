/**
 * Created by mkahn on 4/28/15.
 */

app.controller("shuffconController",
               function ($scope, $timeout, $http, $log, optvModel) {

                   $log.info("Loading shuffconController");

                   $scope.ui = {show: false};

                   function ready() {
                       $scope.ui.show = true;
                   }

                   function initialize() {

                       optvModel.init({
                           appName: "io.overplay.shuffleboard",
                           initialValue: {red: 0, blue: 0, toTV: undefined},
                           autoSync: true
                       })
                           .then(ready);

                   }

                   $scope.changeBlue = function (by) {

                       optvModel.model.blue = optvModel.model.blue + by;
                       if (optvModel.model.blue < 0) optvModel.model.blue = 0;
                       optvModel.save();

                   }

                   $scope.changeRed = function (by) {
                       optvModel.model.red = optvModel.model.red + by;
                       if (optvModel.model.red < 0) optvModel.model.red = 0;
                       optvModel.save();

                   }


                   $scope.resetScores = function () {
                       optvModel.model.red = 0;
                       optvModel.model.blue = 0;
                       optvModel.save();

                   }

                   $scope.home = function () {

                       optvModel.postMessage({to: "io.overplay.mainframe", data: {dash: 'toggle'}});

                   }

                   $scope.move = function () {

                       optvModel.postMessage({to: "io.overplay.mainframe", data:{ move:{ spot: "next", app:"io.overplay.shuffleboard" } }});

                   }


                   initialize();

               });
