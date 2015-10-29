/**
 * Created by mkahn on 10/24/15.
 */
app.controller("socketController",
    function ($scope, $log, optvModel) {

        $log.info("Loading socketController");
        $scope.messages = [];
        $scope.data = [];

        function modelUpdate(obj){
            $scope.$apply( function(){
                $scope.data.push(obj);
            });
        }

         function messageInbound(obj){
            $scope.$apply( function(){
                $scope.messages.push(obj);
            });
        }

        optvModel.init({ modelCb: modelUpdate, msgCb: messageInbound, appName: "io.overplay.mf"});



        $scope.sendMessage = function () {
            $log.info("Sending message");
            io.socket.post('/api/v1/ws/shout',
                {from: 'io.overplay.text', message: {dude: 'what up?'}},
                function(data, jwres){
                    $log.info("Status: "+jwres.statusCode);
                });
        };


    });

angular.module('optvModel.service', [])
    .factory('optvModel', function ($log) {

    var service = {};

    var _appName;
    var _msgCb;
    var _modelCb;

    service.init = function (config) {

        if (!config.appName)
            throw new Error("Must specify app name.");

        if (!config.msgCb)
            throw new Error("Must specify message callback.");

        if (!config.modelCb)
            throw new Error("Must specify model callback.");


        _appName = config.appName;
        _msgCb = config.msgCb;
        _modelCb = config.modelCb;

        //Subscribe to messages
        io.socket.post('/api/v1/ws/subscribe', {}, function (body, JWR) {
            $log.info(body);
        });

        io.socket.on('intra-app-msg', function (obj) {
            $log.info("Intra app message came in.")
            _msgCb(obj);
        });

        io.socket.get('/api/v1/appdata');

        io.socket.on('appdata', function (obj) {
            $log.info("Message came into AppData.")
            _modelCb(obj);
        });


    }

    return service;

});