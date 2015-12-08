/**
 * Created by mkahn on 4/28/15.
 */

app.controller( "mfConController",
    function ( $scope, $timeout, $http, $log, optvModel, $window ) {

        $log.info( "Loading mfConController" );

        $scope.apps = [];


        optvModel.init( {
            appName: "io.overplay.mainframe"
        } );


        function refresh() {
            //Get all the apps to show on AppPicker
            $http.get( '/api/v1/overplayos/appsbystate' )
                .then( function ( data ) {
                    $scope.apps = data.data;

                } );
        }


        $scope.clicked = function ( app ) {

            $log.info( "Clicked on: " + app.reverseDomainName );

            optvModel.launchApp( app.reverseDomainName );
            $window.location.href = '/opp/' + app.reverseDomainName + '/app/control/index.html';

        }

        $scope.menu = function () {
            optvModel.postMessage( { to: "io.overplay.mainframe", data: { dash: 'toggle' } } );
        }

        $scope.remote = function ( button ) {
            optvModel.postMessage( { to: "io.overplay.apppicker", data: { remote: button } } );

        }

        $scope.debug = function () {
            optvModel.postMessage( { to: "io.overplay.mainframe", data: { debug: 'toggle' } } );
        }

        $scope.cellAction = function ( action ) {

            $log.info( angular.toJson( action ) );

            if ( action.hasOwnProperty( 'launch' ) ) {
                optvModel.launchApp( action.launch )
                    .then( refresh )
            } else if ( action.hasOwnProperty( 'kill' ) ) {
                optvModel.killApp( action.kill )
                    .then( refresh )
            } else if ( action.hasOwnProperty( 'move' ) ) {
                optvModel.moveApp( action.move )
                    .then( refresh )

            }
        }

        $scope.controlForApp = function(app){

            return '/opp/'+app.reverseDomainName+'/app/control/index.html';
        }

        refresh();

    } );
