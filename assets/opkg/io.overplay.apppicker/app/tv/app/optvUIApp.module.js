/*********************************

 File:       optvUi.module
 Function:   Base App
 Copyright:  OverplayTV
 Date:       4/10/15
 Author:     mkahn

 **********************************/


var app = angular.module('optvUIApp', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ngOpTVApi'
]);


function fCheckAlive()
{
	console.log("fCheckAlive called, homey!");
	return true;
}

function fButtonPress(button){
    console.log("BUtton pushed yo: "+button);

    angular.element(document.getElementById('docbody')).scope().buttonPushed(button);
}
