/**
 *
 * Functionality that is shared across entire app should be in here or a service.
 *
 *
 */


app.controller("rootController", function ($scope, $timeout, $location, $log, $rootScope, $http, $window, optvModel) {

    console.log("Loading rootController");

    $scope.hideUI = false;

    var _selectedIcon = 0;

    function toggleUI() {
        $scope.hideUI = !$scope.hideUI;
        console.log("UI hidden? " + $scope.hideUI);
        if (!$scope.hideUI) {
            hideIcons();

        } else {
            buildIcons();
        }

    }

    $scope.toggleUI = function () {
        toggleUI();
    }

    $scope.keyPressed = function (event) {

        console.log("Key pressed: " + event.which);
        toggleUI();
    }

    $scope.buttonPushed = function (netvButton) {

        /*
         Buttons are: 'widget', 'cpanel', 'up', 'down', 'left', 'right', 'center'
         */
        console.log("NeTV remote pressed: " + netvButton);


        $scope.$apply(function () {

            switch (netvButton) {

                case 'widget':
                    toggleUI();
                    break;

                case 'left':
                    _selectedIcon--;
                    if (_selectedIcon < 0) _selectedIcon = $scope.apps.length - 1;
                    break;

                case 'right':
                    _selectedIcon++;
                    if (_selectedIcon == $scope.apps.length) _selectedIcon = 0;
                    break;

                case 'center':
                    $log.info("Center pushed. Go to: " + $scope.apps[_selectedIcon].reverseDomainName);
                    toggleUI();
                    $scope.clicked($scope.apps[_selectedIcon]);
                    break;

                case 'cpanel':
                    $rootScope.$broadcast('CPANEL');
                    break;

                default:
                    break;

            }

        })


    }

    $scope.shouldHide = function (idx) {
        //console.log("Should hide called on: " + idx + " returning: " + $scope.hideIcon[idx]);
        return $scope.hideIcon[idx];

    }

    $scope.isSelected = function (idx) {
        return idx == _selectedIcon;
    }

    function buildIcons() {

        $timeout(function () {
            $scope.hideIcon[0] = true;
            //console.log('show 0');
        }, 100);

        $timeout(function () {
            $scope.hideIcon[1] = true;
            //console.log('show 1');
        }, 300);

        $timeout(function () {
            $scope.hideIcon[2] = true;
            //console.log('show 2');
        }, 500);

        $timeout(function () {
            $scope.hideIcon[3] = true;
            //console.log('show 3');
        }, 700);

        $timeout(function () {
            $scope.hideIcon[4] = true;
            //console.log('show 4');
        }, 900);


    }

    function hideIcons() {

        $timeout(function () {
            $scope.hideIcon[0] = false;
            //console.log('hiding 0');
        }, 100);

        $timeout(function () {
            $scope.hideIcon[1] = false;
            //console.log('hiding 1');
        }, 300);

        $timeout(function () {
            $scope.hideIcon[2] = false;
            //console.log('hiding 2');
        }, 500);

        $timeout(function () {
            $scope.hideIcon[3] = false;
            //console.log('hiding 3');
        }, 700);

        $timeout(function () {
            $scope.hideIcon[4] = false;
            //console.log('hiding 4');
        }, 900);


    }

    $http.get('/api/v1/apps?onLauncher=true')
        .then(function (data) {

        $scope.apps = data.data;
        $scope.hideIcon = [];
        $scope.apps.forEach(function () { $scope.hideIcon.push(false) });

    })


    $scope.clicked = function (app) {
        $log.info("Clicked on: " + app.reverseDomainName);
        //$window.location.href = "/opkg/"+app.reverseDomainName+"/app/tv/index.html";
        optvModel.postMessage({ to: "io.overplay.mainframe", data: { launch: app }});
    }

    function inboundMessage(msg){
        $log.info("Inbound message..to APPPICKER");
        $log.info(JSON.stringify(msg));
    }

    optvModel.init({
            appName: "io.overplay.apppicker",
            refreshInterval: 1000,
            messageCallback: inboundMessage,
            initialValue: {},
            autoSync: false
        });


});

