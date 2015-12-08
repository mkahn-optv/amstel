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

 NOTE: This is the THIRD version of this service. Originally, apps were moved between slots in the
 array but this caused the Angular clients to restart the child iframe apps which works fine in a
 modern browser, on decent hardware, but takes all fucking day on the Chumbster.

 So...this version will instead leave the apps always running once started, and simply move
 their frames around. YAY for rewrite 3!!

 *******************************************************/

var _ = require( 'lodash' );
var Promise = require( "bluebird" );
var util = require( "util" );

var _runningApps = [];

var _widgetAppMap = [];
var _crawlerAppMap = [];
var _fullscreenAppMap = [];

var noapp = { app: undefined, frame: { top: 0, left: 0, width: 0, height: 0 } };

// default for 1080x displays
var _screenRect = { width: 1920, height: 1080 };


//TODO: src is redundant once I put the whole app in here, but it is used throughout the code below.
var _screenMap = {

    widgetAppMap:     [],
    crawlerAppMap:    [],
    fullscreenAppMap: []

}

function setDisplaySize( screenRect ) {

    _screenHeight = screenRect.height || 1080;
    _screenWidth = screenRect.width || 1920;
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
                if ( _screenMap.widgetAppMap[ idx ] == undefined ) {
                    _screenMap.widgetAppMap[ idx ] = app;
                    return idx;
                }
            }

            break;

        case 'crawler':

            sails.log.debug( "OPTVOs placing crawler" );

            if ( numRunningApps( 'crawler' ) == 2 )
                return -1; //No room!

            for ( idx = 0; idx < 2; idx++ ) {
                if ( _screenMap.crawlerAppMap[ idx ] == undefined ) {
                    _screenMap.crawlerAppMap[ idx ] = app;
                    return idx;
                }
            }

            break;

        case 'fullscreen':

            sails.log.debug( "OPTVOs placing fullscreen" );

            if ( numRunningApps( 'fullscreen' ) == 1 )
                return -1; //No room!

            _screenMap.fullscreenAppMap[ 0 ] = app;
            return 0;

            break;

    }

}

function setIframePositions() {

    //Do the widgets first

    var app;

    for ( var widx = 0; widx < _screenMap.widgetAppMap.length; widx++ ) {

        app = _screenMap.widgetAppMap[ widx ];
        if ( !app ) continue;

        app.location = { top: 0, left: 0 };
        sails.log.debug( "OPTVOs laying out widget slot " + widx );

        //TODO implement server side nudge
        var nudge = { top: 0, left: 0 };

        switch ( widx ) {

            case 0:
                app.location.top = Math.floor( .05 * _screenRect.height ) + nudge.top + 'px';
                app.location.left = Math.floor( .03 * _screenRect.width ) + nudge.left + 'px';
                break;

            case 1:
                app.location.top = Math.floor( .05 * _screenRect.height ) + nudge.top + 'px';
                app.location.left = Math.floor( .85 * _screenRect.width ) + nudge.left + 'px';
                break;

            case 2:
                app.location.top = Math.floor( .6 * _screenRect.height ) + nudge.top + 'px';
                app.location.left = Math.floor( .85 * _screenRect.width ) + nudge.left + 'px';
                break;

            case 3:
                app.location.top = Math.floor( .6 * _screenRect.height ) + nudge.top + 'px';
                app.location.left = Math.floor( .03 * _screenRect.width ) + nudge.left + 'px';
                break;

        }


    }

    //Do the crawler next
    for ( var cidx = 0; cidx < _screenMap.crawlerAppMap.length; cidx++ ) {

        app = _screenMap.crawlerAppMap[ cidx ];
        if ( !app ) continue;

        app.location = { top: 0, left: 0 };
        sails.log.debug( "OPTVOs laying out crawler slot " + cidx );

        //TODO implement server side nudge
        var nudge = { top: 0, left: 0 };

        //TODO this is here to support crawlers < 100% screen width going forward
        var widthPct = 100;

        //center frame
        app.location.left = Math.floor( _screenRect.width - _screenRect.width * (widthPct / 100) ) / 2 + 'px';

        switch ( cidx ) {

            case 0:
                app.location.top = Math.floor( .89 * _screenRect.height ) + nudge.top + 'px';
                break;

            case 1:
                app.location.top = Math.floor( 0 * _screenRect.height ) + nudge.top + 'px';
                break;

        }

    }

    if ( _screenMap.fullscreenAppMap.length > 0 ) {

        _screenMap.fullscreenAppMap[ 0 ].location = { top: 0, left: 0 };

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
                            app.src = '/opp/' + app.reverseDomainName + '/app/tv/index.html';
                            _runningApps.push( app );
                            setIframePositions();
                            signalAppLaunch( app );
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

                setIframePositions();
                signalLayoutChange();
                return target.slotNumber;

                break;

            case 'widget':

                var currentSlot = _.findIndex( _screenMap.widgetAppMap, { reverseDomainName: appid } );
                var nextSlot = (currentSlot + 1) % 4;

                if ( _screenMap.widgetAppMap[ nextSlot ] == undefined ) {

                    //perfect, dump it here.
                    _screenMap.widgetAppMap[ currentSlot ] = undefined;
                    _screenMap.widgetAppMap[ nextSlot ] = target;
                    setIframePositions();
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
                    setIframePositions();
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

                    kidx = _.findIndex( _screenMap.crawlerAppMap, { reverseDomainName: appid } );
                    _screenMap.crawlerAppMap[ kidx ] = undefined;
                    break;

                case 'widget':

                    kidx = _.findIndex( _screenMap.widgetAppMap, { reverseDomainName: appid } );
                    _screenMap.widgetAppMap[ kidx ] = undefined;
                    break;

                case 'fullscreen':

                    kidx = _.findIndex( _screenMap.fullscreenAppMap, { reverseDomainName: appid } );
                    _screenMap.fullscreenAppMap[ kidx ] = undefined;
                    break;

            }
        }

        if ( zombie !== undefined ) {
            setIframePositions();
            signalLayoutChange();
        }

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

    },

    hardReset: function () {

        _screenMap = {

            widgetAppMap:     [],
            crawlerAppMap:    [],
            fullscreenAppMap: []

        };

        _runningApps = [];
    },

    getIPAddress: function () {

        var os = require( 'os' );
        var util = require( 'util' );
        var ifaces = os.networkInterfaces();

        var rval = [];

        Object.keys( ifaces ).forEach( function ( ifname ) {

            var alias = 0;

            ifaces[ ifname ].forEach( function ( iface ) {

                if ( iface.family == 'IPv4' && !iface.internal ) {

                    rval.push( iface );

                }

            } );
        } );

        return rval;

    }
}