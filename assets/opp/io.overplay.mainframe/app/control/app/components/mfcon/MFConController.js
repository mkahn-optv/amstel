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


        //Get all the apps to show on AppPicker
        $http.get( '/api/v1/overplayos/appsbystate' )
            .then( function ( data ) {
                $scope.apps = data.data;

            } );


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

        $scope.cellAction = function(action){

            $log.info(angular.toJson(action));
        }


    } );
