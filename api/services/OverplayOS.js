/*********************************

 File:       OverplayOS.js
 Function:   Core OS Service for Amstel
 Copyright:  Overplay TV
 Date:       11/6/15 1:24 PM
 Author:     mkahn

 Master of its domain.

 **********************************/



var _ = require('lodash');
var Promise = require("bluebird");

var _runningApps = [];

function signalAppLaunch(app){

}

module.exports = {

    launchApp: function (appid) {

        return new Promise(function (resolve, reject) {

            Apps.findOne({ reverseDomainName: appid })
                .then(function (app) {
                          if (app) {
                              signalAppLaunch(app);
                              _runningApps.push(app);
                              resolve({ message: "Launching: " + appid});
                          } else {
                            reject({ message: "No such app: " + appid });
                          }
                      })
                .catch( function(err){
                    reject({ message: "OS error launching app: "+appid });
                })

        });

    },

    terminateApp: function (appRdn) {

    },

    saveOSState: function () {


    },

    restoreOSState: function () {


    },

    whatsRunning: function() {

        return _runningApps;

    },

    installed: function() {

        return Apps.find( { onLauncher: true } );


    }
}