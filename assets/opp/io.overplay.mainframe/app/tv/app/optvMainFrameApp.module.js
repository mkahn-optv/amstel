/*********************************

 File:       Mainframe App. Provides <iframes>
 Function:   Base App
 Copyright:  OverplayTV
 Date:       4/10/15
 Author:     mkahn

 **********************************/


var app = angular.module('optvMainFrameApp', [
    'ngAnimate',
    'ngSanitize',
    'ngOpTVApi'
]);


/**
 * This method is called automatically by the NeTV Browser to make sure that the app running in it's main
 * window is still alive.
 * @returns {boolean}
 */
function fCheckAlive()
{
	console.log("fCheckAlive called.");
	return true;
}

/**
 * This method is called by NeTV browser in response to a remote control button press
 *
 * @param button
 */
function fButtonPress(button){
    console.log("Button pushed: "+button);

    //This bit of Angular hackery gets the Angular scope for the controller attached to the <body>
    //element and calls the buttonPushed method on that controller.
    angular.element(document.getElementById('docbody')).scope().buttonPushed(button);
}
