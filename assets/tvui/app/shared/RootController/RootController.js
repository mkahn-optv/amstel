/**
 *
 * Functionality that is shared across entire app should be in here or a service.
 *
 *
 */


app.controller("rootController", function ($scope, $timeout, $location, $log, $rootScope) {

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
                    if (_selectedIcon < 0) _selectedIcon = $scope.iconList.length - 1;
                    break;

                case 'right':
                    _selectedIcon++;
                    if (_selectedIcon == $scope.iconList.length) _selectedIcon = 0;
                    break;

                case 'center':
                    $log.info("Center pushed. Go to: " + $scope.iconList[_selectedIcon].target);
                    toggleUI();
                    $location.path($scope.iconList[_selectedIcon].target);
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

    $scope.iconList = [

        {
            src: 'assets/img/shuffle16x9.png',
            label: 'Shuffleboard',
            target: 'shuffle'
        },

        {
            src: 'assets/img/football16x9.png',
            label: 'Big Game',
            target: 'bg'
        },


        {
            src: 'assets/img/darts16x9.png',
            label: 'Darts',
            target: 'darts'
        },


        {
            src: 'assets/img/nowserve16x9.png',
            label: 'Now Serving',
            target: 'served'
        },

        {
            src: 'assets/img/special16x9.png',
            label: "Today's Specials",
            target: 'specials'
        }

    ]

    $scope.clicked = function (idx) {
        $log.info("Clicked on: " + $scope.iconList[idx].label);
        $location.path($scope.iconList[idx].target);
    }

    $scope.hideIcon = [];
    $scope.iconList.forEach(function () { $scope.hideIcon.push(false) });


});

