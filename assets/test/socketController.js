/**
 * Created by mkahn on 10/24/15.
 */
app.controller("socketController", [
    '$scope', '$log',
    function ($scope, $log) {

        $log.info("Loading socketController");

        $scope.messages = [];

        io.socket.get('/api/v1/message/subscribe');

        io.socket.on('message', function (obj) {
            //Check whether the verb is created or not
                $log.info(obj)

                $scope.messages.push(angular.toJson(obj, true));
                $scope.$apply();

        });

        $scope.sendMsg = function () {
            $log.info($scope.chatMessage);
            io.socket.post('/api/v1/message', {from: 'io.overplay.text', message: { dude: 'what up?'}});
        };

    }]);
