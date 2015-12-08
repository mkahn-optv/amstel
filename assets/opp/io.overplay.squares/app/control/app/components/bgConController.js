/**
 * Created by mkahn on 4/28/15.
 */

app.controller( "bgConController",
    function ( $scope, $timeout, $http, $log, optvModel ) {

        $log.info( "Loading bgConController" );

        var logLead = "CG Control App: ";


        function modelUpdate( data ) {

            $log.info( logLead + " got a model update: " + angular.toJson( data ) );


        }

        function inboundMessage( msg ) {
            $log.debug( logLead + "Inbound message..." );
        }

        function initialize() {

            optvModel.init( {
                appName:         "io.overplay.squares",
                dataCallback:    modelUpdate,
                messageCallback: inboundMessage
            } );

        }

        initialize();

    } );
