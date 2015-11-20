/*********************************

 File:       StartAnim.directive.js
 Function:   Silly opening animation :)
 Copyright:  Overplay TV
 Date:       11/20/15 11:45 AM
 Author:     mkahn



 **********************************/

app.directive( 'startAnimation', [ '$log',
     function ( $log ) {
      return {
       restrict:    'E',
       scope:       {
          ui: '='
       },
       templateUrl: 'app/MainFrameController/startanim.template.html',
       link:        function ( scope, elem, attrs ) {


       }
      }
     } ]
);