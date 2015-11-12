/*********************************

 File:       AppCell.directive.js
 Function:   App Cell
 Copyright:  Overplay TV
 Date:       11/11/15 4:12 PM
 Author:     mkahn

 Controls app cells that let the user start/stop/move and app

 **********************************/

app.directive( 'appCell', [ '$log', '$http',
        function ( $log, $http ) {
            return {
                restrict:    'E',
                scope:       {
                    app: '=',
                    running: '=',
                    action: '='
                },
                templateUrl: 'app/components/AppCell/appcell.template.html',
                link:        function ( scope, elem, attrs ) {
                "use strict";

                }
            }
        } ]
);