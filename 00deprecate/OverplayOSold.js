/*********************************

 File:       OverplayOS.js
 Function:   Core OS Service for Amstel
 Copyright:  Overplay TV
 Date:       11/6/15 1:24 PM
 Author:     mkahn

 Master of its domain.

 **********************************/


/*******************************************************

 SYSTEM STATE DEFINITION

 1. What apps running
 2. Which slots each of these apps are in: Widget 0-3, Crawler 0-1, Fullscreen 0
 3. Nudge percentage of each app

 *******************************************************/

var _ = require( 'lodash' );
var Promise = require( "bluebird" );
var util = require( "util" );

var _runningApps = [];

var _widgetAppMap = [ "", "", "", "" ];
var _crawlerAppMap = [ "", "" ];
var _fullscreenAppMap = [ "" ];

var noapp = { src: "", nudge: { top: 0, left: 0 }, app: undefined };

//TODO: src is redundant once I put the whole app in here, but it is used throughout the code below.
var _screenMap = {

    widgetAppMap: [
        { src: "", nudge: { top: 0, left: 0 }, app: undefined },
        { src: "", nudge: { top: 0, left: 0 }, app: undefined },
        { src: "", nudge: { top: 0, left: 0 }, app: undefined },
        { src: "", nudge: { top: 0, left: 0 }, app: undefined }
    ],

    crawlerAppMap: [
        { src: "", nudge: { top: 0, left: 0 }, app: undefined },
        { src: "", nudge: { top: 0, left: 0 }, app: undefined }
    ],

    fullscreenAppMap: [ { src: "", app: undefined } ]

}

function signalAppLaunch( app ) {

    //Not sure we really need to signal to mainframe that an app launch happened, a "layout" message should be enough
    AppMessage.create( {
        dest:        "io.overplay.mainframe",
        from:        "io.overplay.overplayos",
        messageData: { launch: app }
    } )
        .then( function ( msg ) {
            sails.log.debug( "App launch message created." );
        } )
        .catch( function ( err ) {
            sails.log.error( "App launch message could not be created: " + util.inspect( err ) );
        } );

    signalLayoutChange();

}

function signalLayoutChange() {

    AppMessage.create( {
        dest:        "io.overplay.mainframe",
        from:        "io.overplay.overplayos",
        messageData: { layout: true }
    } )
        .then( function ( msg ) {
            sails.log.debug( "Layout change message created." );
        } )
        .catch( function ( err ) {
            sails.log.error( "Layout change message could not be created: " + util.inspect( err ) );
        } );

}

function numRunningApps( appType ) {

    var rval = 0;

    _runningApps.forEach( function ( a ) {
        if ( a.appType == appType )
            rval++;
    } );

    return rval;
}

function placeAppOnDisplay( app ) {

    var idx;

    switch ( app.appType ) {

        case 'widget':

            sails.log.debug( "OPTVOs placing widget" );
            if ( numRunningApps( 'widget' ) == 4 )
                return -1; //No room!

            for ( idx = 0; idx < 4; idx++ ) {
                if ( _screenMap.widgetAppMap[ idx ].src == "" ) {
                    _screenMap.widgetAppMap[ idx ].src = app.reverseDomainName;
                    _screenMap.widgetAppMap[ idx ].app = app;
                    return idx;
                }
            }

            break;

        case 'crawler':

            sails.log.debug( "OPTVOs placing crawler" );

            if ( numRunningApps( 'crawler' ) == 2 )
                return -1; //No room!

            for ( idx = 0; idx < 2; idx++ ) {
                if ( _screenMap.crawlerAppMap[ idx ].src == "" ) {
                    _screenMap.crawlerAppMap[ idx ].src = app.reverseDomainName;
                    _screenMap.crawlerAppMap[ idx ].app = app;
                    return idx;
                }
            }

            break;

        case 'fullscreen':

            sails.log.debug( "OPTVOs placing fullscreen" );

            if ( numRunningApps( 'fullscreen' ) == 1 )
                return -1; //No room!

            _screenMap.fullscreenAppMap[ 0 ].src = app.reverseDomainName;
            _screenMap.fullscreenAppMap[ 0 ].app = app;
            return 0;


            break;

    }

}

module.exports = {

    launchApp: function ( appid ) {

        return new Promise( function ( resolve, reject ) {

            //Puke if already running
            if ( _.find( _runningApps, { reverseDomainName: appid } ) ) {
                signalLayoutChange(); //hamlessly dismiss the AppPicker
                return reject( { message: "App already running " } );
            }

            Apps.findOne( { reverseDomainName: appid } )
                .then( function ( app ) {
                    if ( app ) {

                        if ( placeAppOnDisplay( app ) > -1 ) {
                            signalAppLaunch( app );
                            _runningApps.push( app );
                            resolve( { message: "Launching: " + appid } );
                        } else {
                            reject( { message: "No room for app: " + appid } );
                        }

                    } else {
                        reject( { message: "No such app: " + appid } );
                    }
                } )
                .catch( function ( err ) {
                    reject( { message: "OS error launching app: " + appid } );
                } );


        } );

    },

    /* Move app to next slot */
    moveApp: function ( appid ) {


        var target = _.find( _runningApps, function ( a ) { return a.reverseDomainName == appid } );

        if ( !target || target.appType == 'fullscreen' )
            return -1;

        switch ( target.appType ) {

            case 'crawler':

                var newCrawler = [];
                newCrawler.push( _screenMap.crawlerAppMap[ 1 ] );
                newCrawler.push( _screenMap.crawlerAppMap[ 0 ] );
                _screenMap.crawlerAppMap = newCrawler;


                signalLayoutChange();
                return target.slotNumber;

                break;

            case 'widget':

                var currentSlot = _.findIndex( _screenMap.widgetAppMap, { src: appid } );
                var nextSlot = (currentSlot + 1) % 4;

                if ( _screenMap.widgetAppMap[ nextSlot ].src == "" ) {

                    //perfect, dump it here.
                    _screenMap.widgetAppMap[ currentSlot ].src = "";
                    _screenMap.widgetAppMap[ currentSlot ].app = undefined;
                    _screenMap.widgetAppMap[ nextSlot ].src = target.reverseDomainName;
                    _screenMap.widgetAppMap[ nextSlot ].app = target;
                    signalLayoutChange();
                    return nextSlot;

                } else {
                    //We bumbed up against another app, shift everyone by 1 slot. Maybe not the best algo, but for now
                    //it'll do.
                    var newMap = _.cloneDeep( _screenMap.widgetAppMap );
                    _screenMap.widgetAppMap[ 0 ] = _.cloneDeep( newMap[ 3 ] );
                    _screenMap.widgetAppMap[ 1 ] = _.cloneDeep( newMap[ 0 ] );
                    _screenMap.widgetAppMap[ 2 ] = _.cloneDeep( newMap[ 1 ] );
                    _screenMap.widgetAppMap[ 3 ] = _.cloneDeep( newMap[ 2 ] );

                    signalLayoutChange();
                    return nextSlot;
                }

                break;

        }


    },


    terminateApp: function ( appid ) {

        var predicate = function ( x ) { return (x.reverseDomainName == appid)};
        var killed = _.remove( _runningApps, predicate );

        var zombie = killed[ 0 ];

        if ( zombie ) {

            var kidx;

            switch ( zombie.appType ) {

                case 'crawler':

                    kidx = _.findIndex( _screenMap.crawlerAppMap, { src: appid } );
                    _screenMap.crawlerAppMap[ kidx ] = noapp;
                    break;

                case 'widget':

                    kidx = _.findIndex( _screenMap.widgetAppMap, { src: appid } );
                    _screenMap.widgetAppMap[ kidx ] = noapp;
                    break;

                case 'fullscreen':

                    kidx = _.findIndex( _screenMap.fullscreenAppMap, { src: appid } );
                    _screenMap.fullscreenAppMap[ kidx ] = noapp;
                    break;

            }
        }

        if ( zombie !== undefined )
            signalLayoutChange();

        return zombie !== undefined;

    },

    saveOSState: function () {


    }
    ,

    restoreOSState: function () {


    }
    ,

    whatsRunning: function () {

        return _runningApps;

    }
    ,

    installed: function () {

        return Apps.find( { onLauncher: true } );

    },

    getScreenMap: function () {
        return _screenMap;
    },

    appsByState: function () {

        return Apps.find( { onLauncher: true } )
            .then( function ( allApps ) {
                var runningAppIds = _.pluck( _runningApps, 'reverseDomainName' );
                var availableToRun = [];

                allApps.forEach( function ( app ) {
                    var idx = runningAppIds.indexOf( app.reverseDomainName );
                    if ( idx == -1 ) {
                        availableToRun.push( app );
                    }
                } );


                return { running: _runningApps, dormant: availableToRun };
            } )

    }
}