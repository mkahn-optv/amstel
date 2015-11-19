/*********************************

 File:       OPTVOsService.js
 Function:   Interface to OPTVOs and Layout
 Copyright:  Overplay TV
 Date:       11/8/15 10:18 AM
 Author:     mkahn

 Handles all placement of iframes within Mainframe
 and interface to core OS

 **********************************/

app.factory( 'osService', [ '$log', '$http', '$rootScope', '$window', function ( $log, $http, $rootScope, $window ) {
    "use strict";

    var service = {};
    $log.debug( "Loading osService" );

    service.name        = "osService";
    service.appRootPath = "/opp/"; //must have trailing slash
    service.runningApps = [];

    //Grab initial window dims. On a TV, this will likely never change
    service.windowDimension = {
        text:   $window.innerWidth + ' x ' + window.innerHeight,
        width:  $window.innerWidth,
        height: $window.innerHeight
    };

    var logLead = "osService: ";

    service.getTVResolution = function () {

        if ( service.windowDimension.width <= 1080 )
            return service.windowDimension.width.toString();

        switch ( service.windowDimension.width ) {
            case 2160:
                return "4k";
            case 4320:
                return "8k";
            default:
                return "unknown";
        }

    };

    service.getLauncher = function () {
        //Load the app picker / launcher
        return $http.get( '/api/v1/apps?isMain=true' )
            .then( function ( data ) {
                var app      = data.data[ 0 ];
                app[ 'src' ] = service.appRootPath + app.reverseDomainName + '/app/tv/index.html';
                return app
            } );
    };

    function pathFor( appid ) {

        if ( appid != "" ) {

            return '/opp/' + appid + '/app/tv/index.html';

        } else
            return "";


    }

    function mapApps( data ) {

        var map = data.data;

        service.runningApps = [];

        if ( map.fullscreenAppMap[ 0 ] && map.fullscreenAppMap[ 0 ].src ) {
            service.runningApps.push( {
                src:      pathFor( map.fullscreenAppMap[ 0 ].src ),
                location: { top: 0, left: 0 },
                app:      map.fullscreenAppMap[ 0 ].app,
                type:     map.fullscreenAppMap[ 0 ].app.type
            } );
        }

        for ( var slot = 0; slot < 4; slot++ ) {
            var app      = map.widgetAppMap[ slot ];
            var location = service.getWidgetTopLeftForSlot( slot, app.nudge );
            if ( app.src != '' )
                service.runningApps.push( {
                    src:      pathFor( app.src ),
                    location: location,
                    app:      app.app,
                    type:     app.appType
                } );
        }

        for ( var cslot = 0; cslot < 2; cslot++ ) {
            var capp      = map.crawlerAppMap[ cslot ];
            var clocation = service.getCrawlerTopLeftForSlot( cslot, capp.nudge );
            if ( capp.src != '' )
                service.runningApps.push( {
                    src:  pathFor( capp.src ), location: clocation,
                    app:  capp.app,
                    type: capp.appType
                } );
        }



        return service.runningApps;

    }

    function reportError( err ) {
        $log.error( logLead + "ERROR " + angular.toJson( err ) );
    }

    service.getAppMap = function () {

        return $http.get( '/api/v1/overplayos/screenmap' )
            .then( mapApps, reportError );

    }

    service.getApps = function () {

        return $http.get('/api/v1/overplayos/running');

    }


    /**
     * Window sizing an layout functions
     */

    $rootScope.$watch( function () { return $window.innerWidth; }, function ( value ) {
        $log.info( "Window changed: " + $window.innerWidth + ' x ' + $window.innerHeight );
        service.windowDimension = {
            text:   $window.innerWidth + ' x ' + $window.innerHeight,
            width:  $window.innerWidth,
            height: $window.innerHeight
        }
    } );

    service.getWidgetTopLeftForSlot = function ( slot, nudge ) {

        var rval = { top: 0, left: 0 };
        nudge    = nudge || { top: 0, left: 0 };

        //Left as switch vs. something more compact in case we add more zones
        switch ( slot ) {

            case 0:
                rval.top  = Math.floor( .05 * service.windowDimension.height ) + nudge.top + 'px';
                rval.left = Math.floor( .03 * service.windowDimension.width ) + nudge.left + 'px';
                break;

            case 1:
                rval.top  = Math.floor( .05 * service.windowDimension.height ) + nudge.top + 'px';
                rval.left = Math.floor( .85 * service.windowDimension.width ) + nudge.left + 'px';
                break;

            case 2:
                rval.top  = Math.floor( .6 * service.windowDimension.height ) + nudge.top + 'px';
                rval.left = Math.floor( .85 * service.windowDimension.width ) + nudge.left + 'px';
                break;

            case 3:
                rval.top  = Math.floor( .6 * service.windowDimension.height ) + nudge.top + 'px';
                rval.left = Math.floor( .03 * service.windowDimension.width ) + nudge.left + 'px';
                break;

        }

        return rval;
    }

    service.getCrawlerTopLeftForSlot = function ( slot, nudge, widthPct ) {

        var rval = { top: 0, left: 0 };

        widthPct = widthPct || 100;
        nudge    = nudge || { top: 0, left: 0 };

        //center frame
        rval.left = Math.floor( service.windowDimension.width - service.windowDimension.width * (widthPct / 100) ) / 2 + 'px';

        switch ( slot ) {

            case 0:
                rval.top = Math.floor( .89 * service.windowDimension.height ) + nudge.top + 'px';
                break;

            case 1:
                rval.top = Math.floor( 0 * service.windowDimension.height ) + nudge.top + 'px';
                break;

        }

        return rval;

    }

    //service.getAppMap();

    return service;


} ] );
