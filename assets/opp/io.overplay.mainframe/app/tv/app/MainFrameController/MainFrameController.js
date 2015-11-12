/*********************************

 File:       MainFrameController.js
 Function:   Controller for MainFrame
 Copyright:  Overplay TV
 Date:       10/14/15 5:35 PM
 Author:     mkahn

 Pretty much does everything for Mainframe since all it does is sequence iframes.

 **********************************/


app.controller( "mainFrameController", function ( $scope, $timeout, $location, $log, $rootScope, $http, $window, optvModel, osService ) {

        console.log( "Loading mainFrameController" );
        $log.info( "osService SERVICE: " + osService.name );

        $scope.launcher = { app: undefined, show: false };

        $scope.os = osService;

        $scope.clientApps = osService.runningApps;

        var logLead = "MFController: ";


        // For on-Mac testing
        $scope.keyPressed = function ( event ) {

            $log.info( "Keyboard button pressed: " + event.which );

        }


        function showAppPicker( shouldShow ) {

            $scope.launcher.show = shouldShow;

        }

        function toggleAppPicker() {

            $scope.launcher.show = !$scope.launcher.show;

        }

        function showApps( shouldShow ){

            $scope.launcher.show = !shouldShow;

        }

        // This call is used from outside Angular, requires $apply
        $scope.buttonPushed = function ( netvButton ) {
            $scope.$apply( function () {
                buttonPushed( netvButton );
            } )
        }

        // Called from inside Angular by messages simulating IR remote
        //
        // Buttons are: 'widget', 'cpanel', 'up', 'down', 'left', 'right', 'center'
        //
        function buttonPushed( netvButton ) {

            $log.info( "NeTV remote pressed: " + netvButton );
            switch ( netvButton ) {
                case 'widget':
                    $log.info( "Widget button pressed" );
                    toggleAppPicker();
                    break;

                case 'left':
                case 'right':
                case 'center':
                case 'cpanel':
                case 'up':
                case 'down':
                    //Relay everything other than show/hide picker to the picker
                    optvModel.postMessage( { to: "io.overplay.apppicker", data: { remote: netvButton } } );
                    break;
                default:
                    break;

            }

        }


        /*
         Move messages need to be like this for now:
         { "to":"io.overplay.mainframe", "from":"io.overplay.shuffleboard", "data":{ "move": { "spot" : "tl" }}}
         */

        function inboundMessageMain( m ) {

            $log.info( "Mainframe received message: " + angular.toJson( m ) );
            $scope.lastMessage = angular.toJson( m );


            if ( m.message && m.message.layout ) {

                $log.info( logLead + "received LAYOUT message" );
                osService.getAppMap()
                    .then( function ( apps ) {
                        $scope.clientApps = osService.runningApps;
                    }, function ( err ) {
                        $log.error( logLead + " error fetching AppMap. Error: "+ angular.toJson(err) );
                    } );

                //Give the app picker some time to hide
                $timeout( function () {
                    $log.debug( "Delayed show of apps" );
                    showApps( true );
                }, 250 );

            }


            //TODO this is all kind of bullshot with the new app holder frame.
            //Show Dash
            if ( m.message && m.message.dash ) {

                switch ( m.message.dash ) {

                    case 'show':
                        showApps( false );
                        $timeout( function () { showAppPicker( true ); }, 1500 );
                        break;

                    case 'hide':
                        showAppPicker( false );
                        $timeout( function () { showApps( true ); }, 1500 );
                        break;

                    case 'toggle':
                        //TODO sequencing
                        toggleAppPicker();
                        break;

                }
            }

            //TODO this should be a case statement
            //Show Dash
            if ( m.message && m.message.remote ) {

                switch ( m.message.remote ) {

                    case 'up':
                        $scope.buttonPushed( 'up' );
                        break;

                    case 'down':
                        $scope.buttonPushed( 'down' );
                        break;

                    case 'select':
                        $scope.buttonPushed( 'center' );
                        break;


                }


            }

        }

        optvModel.init( {
            appName:         "io.overplay.mainframe",
            messageCallback: inboundMessageMain
        } );

        function setLauncher( app ) {
            $scope.launcher.app = app;
            showAppPicker(true);
        }

        osService.getLauncher()
            .then( setLauncher )
            .catch( function ( err ) {
                $log.error( "MFController: major error, no app launcher!! " + err );
            } );


    }
)
;

