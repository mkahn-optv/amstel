app.directive("appIcon", function () {
    return {
        restrict: 'E',
        scope: {
            iconSrc: '@',
            appName: '@',
            selected: '='
        },
        link: function (scope, element, attrs) {



        },
        templateUrl: 'app/components/UIDirectives/AppIcon/appicon.template.html'
    }

});
