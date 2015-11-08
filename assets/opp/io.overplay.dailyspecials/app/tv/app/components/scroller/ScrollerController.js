/**
 * Created by mkahn on 4/28/15.
 */

app.controller("scrollerController",
               function ($scope, $timeout, $http, $interval, optvModel, $log, $window) {

                   console.log("Loading scrollerController");

                   var _remoteData = {};
                   var debug = true;

                   $scope.messageArray = [
                       "$5.99 hot wings until 10:30",
                       "2-for-1 Long Island Ice Teas",
                       "Coming Up at 1:25 - 49ers @ AZ Cardinals"];

                   function logLead() { return "scrollerController: "; }

                   function updateLocalData() {


                   }

                   function modelUpdate(data) {

                       $log.info(logLead() + " got a model update: " + angular.toJson(data));
                       _remoteData = data;
                       updateLocalData();
                       $log.debug(logLead() + "Model update callback...")


                   }

                   function inboundMessage(msg) {
                       $log.debug(logLead() + "Inbound message...");
                   }

                   function updateFromRemote() {

                       optvModel.init({
                           appName: "io.overplay.dailyspecials",
                           dataCallback: modelUpdate,
                           messageCallback: inboundMessage,
                           initialValue: {messages: []}
                       });

                   }

                   updateFromRemote();


               });

app.directive('marqueeScroller', [
        '$log',
        function ($log) {
            return {
                restrict: 'E',
                scope: {
                    messageArray: '='
                },
                templateUrl: 'app/components/scroller/marqueescroller.template.html',
                link: function (scope, elem, attrs) {
                    "use strict";
                    var idx = 0;
                    scope.currentScroller = scope.messageArray[idx];

                    elem.bind('onfinish', function (ev) {
                        idx++;
                        if (idx >= scope.messageArray.length) idx = 0;
                        scope.currentScroller = scope.messageArray[idx];
                    });

                }
            }
        }]
);

app.directive('cssScroller', [
        '$log', '$timeout',
        function ($log, $timeout) {
            return {
                restrict: 'E',
                scope: {
                    messageArray: '='
                },
                templateUrl: 'app/components/scroller/cssscroller.template.html',
                link: function (scope, elem, attrs) {
                    "use strict";
                    var idx = 0;

                    scope.message = {text: "", scrolling: false};
                    scope.message.text = scope.messageArray[idx];


                    function nextMsg() {
                        idx++;
                        if (idx == scope.messageArray.length) idx = 0;
                        scope.message.text = scope.messageArray[idx];
                        scope.message.scrolling = false;
                        $timeout(scroll, 1000);
                    }


                    function scroll() {
                        scope.message.scrolling = true;
                        $timeout(nextMsg, 10000);
                    }

                    $timeout(scroll, 1000);

                }
            }
        }]
);

app.directive('cssFader', [
        '$log', '$timeout',
        function ($log, $timeout) {
            return {
                restrict: 'E',
                scope: {
                    messageArray: '='
                },
                templateUrl: 'app/components/scroller/cssfader.template.html',
                link: function (scope, elem, attrs) {
                    "use strict";
                    var idx = 0;

                    scope.message = {text: "", fadein: false};
                    scope.message.text = scope.messageArray[idx];


                    function nextMsg() {
                        idx++;
                        if (idx == scope.messageArray.length) idx = 0;
                        scope.message.fadein = false;
                        $timeout(scroll, 2000);
                    }


                    function scroll() {
                        scope.message.fadein = true;
                        scope.message.text = scope.messageArray[idx];
                        $timeout(nextMsg, 8000);
                    }

                    $timeout(scroll, 2000);

                }
            }
        }]
);
