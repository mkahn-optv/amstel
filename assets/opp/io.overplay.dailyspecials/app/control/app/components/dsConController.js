/**
 * Created by mkahn on 4/28/15.
 */

app.controller( "dsConController",
    function ( $scope, $timeout, $http, $log, optvModel ) {

        $log.info( "Loading dsConController" );

        var logLead = "DS Control App: ";
        $scope.inboundMessageArray = [];
        $scope.messageArray = [];

        function modelUpdate( data ) {

            $log.info( logLead + " got a model update: " + angular.toJson( data ) );
            $scope.messageArray = data.messages;


        }

        function inboundMessage( msg ) {
            $log.debug( logLead + "Inbound message..." );
        }

        function initialize() {

            optvModel.init( {
                appName:         "io.overplay.dailyspecials",
                dataCallback:    modelUpdate,
                messageCallback: inboundMessage
            } );

        }

        $scope.add = function () {
            $scope.messageArray.push( $scope.input.newMsg );
            $scope.input.newMsg = '';
        }

        $scope.done = function () {
            optvModel.messages = $scope.messageArray;
            optvModel.save();
        }


        initialize();

    } );
