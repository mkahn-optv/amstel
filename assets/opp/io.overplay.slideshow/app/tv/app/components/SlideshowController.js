/**
 * Created by mkahn on 4/28/15.
 */

app.controller( "slideshowController",
    function ( $scope, $timeout, $http, $interval, optvModel, $log ) {

        console.log( "Loading slideshowController" );

        var logLead = "SlideshowController: ";

        var slides = [ "testpattern1.jpg", "testpattern2.png", "testpattern3.jpg" ];
        var sidx = 0;

        function modelUpdate( data ) {

            $log.info( logLead + " got a model update: " + angular.toJson( data ) );
            $log.debug( logLead + "Model update callback..." )

        }

        function inboundMessage( msg ) {
            $log.debug( logLead + "Inbound message..." );
        }


        optvModel.init( {
            appName:         "io.overplay.slideshow",
            dataCallback:    modelUpdate,
            messageCallback: inboundMessage
        } );

        function nextSlide() {
            $scope.slide = "assets/img/"+slides[++sidx%slides.length];
            $timeout(nextSlide, 2000);
        }

        nextSlide();

    } );
