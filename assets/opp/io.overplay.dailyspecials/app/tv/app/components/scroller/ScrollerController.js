/**
 * Created by mkahn on 4/28/15.
 */

app.controller( "scrollerController",
    function ( $scope, $timeout, $http, $interval, optvModel, $log, $window ) {

        console.log( "Loading scrollerController" );

        $scope.messageArrayTest = [
            "$5.99 hot wings until 10:30",
            "2-for-1 Long Island Ice Teas",
            "Coming Up at 1:25 - 49ers @ AZ Cardinals" ];

        $scope.messageArray = [ "Daily Specials from Overplay", "Change your messages via Control App" ];

        function logLead() { return "scrollerController: "; }

        function updateLocalData() {


        }

        function modelUpdate( data ) {

            $log.info( logLead() + " got a model update: " + angular.toJson( data ) );
            $scope.messageArray = data.messages;


        }

        function inboundMessage( msg ) {
            $log.debug( logLead() + "Inbound message..." );
        }

        function updateFromRemote() {

            optvModel.init( {
                appName:         "io.overplay.dailyspecials",
                dataCallback:    modelUpdate,
                messageCallback: inboundMessage,
                initialValue:    { messages: $scope.messageArray }
            } );

        }

        updateFromRemote();


    } );

app.directive( 'marqueeScroller', [
        '$log',
        function ( $log ) {
            return {
                restrict:    'E',
                scope:       {
                    messageArray: '='
                },
                templateUrl: 'app/components/scroller/marqueescroller.template.html',
                link:        function ( scope, elem, attrs ) {
                    "use strict";
                    var idx = 0;
                    scope.currentScroller = scope.messageArray[ idx ];

                    elem.bind( 'onfinish', function ( ev ) {
                        idx++;
                        if ( idx >= scope.messageArray.length ) idx = 0;
                        scope.currentScroller = scope.messageArray[ idx ];
                    } );

                }
            }
        } ]
);

/**
 * Chumby does a shittly job of CSS transition scrolling, so we do it manually
 */
app.directive( 'cssScroller', [
        '$log', '$timeout', '$window',
        function ( $log, $timeout, $window ) {
            return {
                restrict:    'E',
                scope:       {
                    messageArray: '='
                },
                templateUrl: 'app/components/scroller/cssscroller.template.html',
                link:        function ( scope, elem, attrs ) {
                    "use strict";
                    var idx = 0;
                    var leftPixel = $window.innerWidth + 20;
                    var messageWidth = 0;
                    var PIXELS_PER_FRAME = 5;
                    var FPS = 24;

                    scope.message = { text: "", leftPos: leftPixel + 'px' };

                    scope.message.text = scope.messageArray[ idx ];


                    function setLeftPos() {
                        scope.message.leftPos = leftPixel + 'px';
                        //$log.info( "LEFT POS: " + scope.message.leftPos );

                    }

                    function nextMsg() {
                        $log.info( "NEXT MESSAGE" );
                        idx++;
                        if ( idx == scope.messageArray.length ) idx = 0;
                        scope.message.text = scope.messageArray[ idx ];

                        messageWidth = scope.message.text.length * 40;

                        //$log.info( "NEXT MESSAGE: " + scope.message.text + " width: " + messageWidth );

                        leftPixel = $window.innerWidth+20;
                        setLeftPos();
                        $timeout( scroll, 10 );
                    }


                    function scroll() {
                        leftPixel -= PIXELS_PER_FRAME;
                        setLeftPos();
                        if ( leftPixel < (-messageWidth) ) {
                            nextMsg();

                        } else {
                            $timeout( scroll, 1000/FPS );

                        }
                    }

                    $timeout( nextMsg, 200 );

                }
            }
        } ]
);

app.directive( 'cssFader', [
        '$log', '$timeout',
        function ( $log, $timeout ) {
            return {
                restrict:    'E',
                scope:       {
                    messageArray: '='
                },
                templateUrl: 'app/components/scroller/cssfader.template.html',
                link:        function ( scope, elem, attrs ) {
                    "use strict";
                    var idx = 0;

                    scope.message = { text: "", fadein: false };
                    scope.message.text = scope.messageArray[ idx ];


                    function nextMsg() {
                        idx++;
                        if ( idx == scope.messageArray.length ) idx = 0;
                        scope.message.fadein = false;
                        $timeout( scroll, 2000 );
                    }


                    function scroll() {
                        scope.message.fadein = true;
                        scope.message.text = scope.messageArray[ idx ];
                        $timeout( nextMsg, 8000 );
                    }

                    $timeout( scroll, 2000 );

                }
            }
        } ]
);
