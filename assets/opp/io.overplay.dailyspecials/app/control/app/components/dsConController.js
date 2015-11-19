/**
 * Created by mkahn on 4/28/15.
 */

app.controller("dsConController",
               function ($scope, $timeout, $http, $log, optvModel) {

                   $log.info("Loading dsConController");

                    var logLead = "DS Control App: ";
                   $scope.inboundMessageArray = [];
                   $scope.messageArray = [];
                   var loaded = false;

                   function modelUpdate( data ) {

                       if ( !loaded ) {
                           $log.info( logLead + " got a model update: " + angular.toJson( data ) );
                           $scope.messageArray = data.messages;
                           loaded = true;

                       }


                   }

                   function inboundMessage( msg ) {
                       $log.debug( logLead + "Inbound message..." );
                   }

                   function initialize() {

                       optvModel.init({
                           appName: "io.overplay.dailyspecials",
                           dataCallback: modelUpdate,
                           messageCallback: inboundMessage
                       });

                   }

                    $scope.add = function(){
                        $scope.messageArray.push($scope.input.newMsg);
                        optvModel.messages = $scope.messageArray;
                        optvModel.save();
                    }

                    $scope.save = function(){
                        optvModel.save();
                    }


                   initialize();

               });
