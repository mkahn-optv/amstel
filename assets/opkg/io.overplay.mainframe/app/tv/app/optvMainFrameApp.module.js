/*********************************

 File:       Mainframe App. Provides <iframes>
 Function:   Base App
 Copyright:  OverplayTV
 Date:       4/10/15
 Author:     mkahn

 **********************************/


var app = angular.module('optvMainFrameApp', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ngOpTVApi'
]);


function fCheckAlive()
{
	console.log("fCheckAlive called.");
	return true;
}

function fButtonPress(button){
    console.log("Button pushed: "+button);

    angular.element(document.getElementById('docbody')).scope().buttonPushed(button);
}
