/****************************************************************************

 File:       optvAPI.js
 Function:   Provides an angular service wrapper for inter-app communication
 Copyright:  Overplay TV
 Date:       10/14/15 5:16 PM
 Author:     mkahn

 This version does both Websockets and Polling

 ****************************************************************************/


angular.module( 'ngOpTVApi', [] )
    .factory( 'optvModel', function ( $http, $log, $interval, $rootScope, $q, $timeout ) {

        //For HTTP version
        var POLL_INTERVAL_MS = 100;
        var DEFAULT_METHOD   = 'http';

        var service = { model: {} };

        //Callback for AppData updates
        var _dataCb;

        //Callback for new Message updates
        var _msgCb;

        var _appName;
        var _dbId;
        var _initialValue;
        var _netMethod;

        //HTTP Mode stuff
        var appWatcher;
        var msgWatcher;

        //since NeTV can't tell time right and usually comes up in 2011
        //This is ms ahead/behind for the local Chumby clock.
        var _osTimeDifferential;

        function getCurrentOSTime() {

            return new Date().getTime() + _osTimeDifferential;

        }

        function logLead() {
            var ll = "optvAPI (" + _appName + "): ";
            return ll;
        }

        function setInitialAppDataValue() {

            service.model = _initialValue;
            io.socket.post( '/api/v1/appdata', {
                appName: _appName,
                data:    _initialValue
            }, function ( data, jwres ) {

                $log.debug( logLead() + "io.posted initial value" );

            } )

        }

        function setInitialAppDataValueHTTP() {

            service.model = _initialValue;

            //Don't post up an undefined. We are probably in an app that doesn't set defaults.
            if (!_initialValue)
                return;

            $http.post( '/api/v1/appdata', {
                appName: _appName,
                data:    _initialValue
            } )
                .then( function ( data ) {
                    $log.debug( logLead() + " initial value POSTed via HTTP." )
                },
                function ( err ) {
                    $log.debug( logLead() + " initial value POSTed via HTTP FAILED!!!!" )
                } );

        }

        function subscribeToAppDataNotifications() {

            io.socket.get( '/app/v1/appdata' );

            io.socket.on( 'appdata', function ( obj ) {
                $log.info( logLead() + "Message came into AppData." )
                handleAppDataMessage( obj );
            } );

        }

        function handleAppDataMessage( obj ) {

            //Check whether the verb is created or not
            switch ( obj.verb ) {

                case 'created':

                    $log.info( logLead() + "new appData created." );
                    if ( obj.data.appName == _appName ) {
                        $log.info( logLead() + " data is for us, forwarding" );
                        _dataCb( obj.data.data );
                    }
                    break;

                case 'updated':

                    $log.info( logLead() + " appData modded." );
                    if ( obj.previous.appName == _appName ) {
                        $log.info( logLead() + " data is for us, forwarding" );
                        _dataCb( obj.data.data );
                    }

                    break;

                default:

            }

        }

        function AppDataWatcher() {

            this.lastUpdated = new Date( 0 );
            this.running     = true;

            var _this = this;

            function updateIfNewer( data ) {

                //$log.info( logLead() + " Checking if inbound data is newer" );
                //TODO this isn't work right on chumby

                var mtime = new Date( data.modTime );
                var newer = mtime > _this.lastUpdated;

                if ( newer ) {
                    _this.lastUpdated = mtime;
                    service.model = data.data;
                    _dataCb( service.model );
                }

            }

            //TODO this should run a query filter on modTime and not do it in code above
            this.poll = function () {

                $timeout( function () {

                    $http.get( '/api/v1/AppData/model?appName=' + _appName )
                        .then( function ( data ) {
                            updateIfNewer( data.data );
                            if ( _this.running ) _this.poll();
                        },
                        function ( err ) {
                            $log.error( logLead() + " couldn't poll model!" );
                            if ( _this.running ) _this.poll();
                        }
                    );

                }, POLL_INTERVAL_MS );

            }
        }

        function MessageWatcher() {

            //start NOW, not in the past like Data
            this.lastUpdated = getCurrentOSTime();
            this.running     = true;

            var _this = this;

            function updateIfNewer( data ) {

                if ( new Date( data.modTime ) > _this.lastUpdated ) {
                    service.model = data.data;
                    _dataCb( service.model );
                }

            }

            this.poll = function () {

                $timeout( function () {

                    var currentTime   = getCurrentOSTime();
                    var ago           = currentTime - _this.lastUpdated;
                    var qstring       = "?ago=" + ago + "&dest=" + _appName;
                    _this.lastUpdated = currentTime;

                    $http.get( '/api/v1/appmessage/getnext' + qstring )
                        .then( function ( data ) {
                            var msgs = data.data;
                            //$log.info(logLead() + "received inbound messages: " + data.data);
                            msgs.forEach( function ( msg ) {
                                //This dup should go away once we clean everything up
                                msg.message = msg.messageData;
                                _msgCb( msg );
                            } );
                            if ( _this.running ) _this.poll();
                        },
                        function ( err ) {
                            $log.error( logLead() + " couldn't poll messages!" );
                            if ( _this.running ) _this.poll();
                        }
                    );

                }, POLL_INTERVAL_MS );

            }
        }


        function subscribeToGlobalRoom() {

            //Subscribe to ws messages
            io.socket.post( '/api/v1/ws/subscribe', {}, function ( body, JWR ) {
                $log.info( body );
            } );

            io.socket.on( 'intra-app-msg', function ( obj ) {
                $log.info( logLead() + "Intra app message came in." )
                handleIntraAppMessage( obj );
            } );

        }

        function handleIntraAppMessage( obj ) {

            //Lots of log messages while debugging the WS implementation
            $log.info( logLead() + "SocketIO message inbound to optvAPI for app: " + _appName );
            $log.info( logLead() + "SocketIO message destination: " + obj.dest );
            $log.info( logLead() + "SocketIO message will be relayed? " + (obj.dest == _appName) );
            $log.info( angular.toJson( obj, true ) );

            if ( obj.dest == _appName ) {
                $log.info( logLead() + "optvAPI making message callback to " + _appName );
                _msgCb( obj );
            }

        }


        function loadModel() {

            return $q( function ( resolve, reject ) {

                io.socket.get( '/api/v1/AppData/model?appName=' + _appName, function ( data, jwres ) {

                    if ( jwres.statusCode != 200 )
                        reject( jwres );
                    else
                        resolve( data );
                } )

            } )
        }


        /**
         * Must be run after clock sync
         */
        function initPhase2() {

            switch ( _netMethod ) {

                case 'websockets':

                    if ( _dataCb ) {

                        io.socket.get( '/api/v1/AppData/model?appName=' + _appName, function ( data, jwres ) {

                            if ( jwres.statusCode != 200 ) {
                                $log.info( logLead() + " model data not in DB, creating" );
                                setInitialAppDataValue();
                            }
                            else {
                                $log.info( logLead() + " model data (appData) already existed." );
                                service.model = data.data;
                                _dbId         = data.id;

                            }
                        } );

                        //check if model already exists

                        //Commented out because Chumby browser sucks fat hariy dong

                        //loadModel()
                        //    .then(function (data) {
                        //              $log.info(logLead() + " model data (appData) already existed.");
                        //              service.model = data.data;
                        //              _dbId = data.id;
                        //          })
                        //    .catch(function (err) {
                        //               $log.info(logLead + " model data not in DB, creating");
                        //               service.model = _initialValue;
                        //               setInitialAppDataValue();
                        //           });

                        $log.debug( "optvAPI init app: " + _appName + " subscribing to data" );
                        subscribeToAppDataNotifications();

                    }

                    //If a message cb is defined, subscribe
                    if ( _msgCb ) {
                        $log.debug( "optvAPI init app: " + _appName + " subscribing to messages" );
                        subscribeToGlobalRoom();
                    }


                    break;

                case 'http':

                    if ( _dataCb ) {

                        $http.get( '/api/v1/AppData/model?appName=' + _appName )
                            .then( function ( data ) {
                                $log.info( logLead() + " model data (appData) already existed via http." );
                                if (Object.keys( data.data ).length==0){
                                    setInitialAppDataValueHTTP();
                                } else {
                                    service.model = data.data.data;
                                    _dbId = data.data.id;
                                }
                            },
                            //Chumby browser doesn't seem to like "catch" in some places.
                            function ( err ) {
                                $log.info( logLead() + " model data not in DB, creating via http" );
                                setInitialAppDataValueHTTP();
                            } );

                        $log.debug( "optvAPI init app: " + _appName + " subscribing to data" );

                        appWatcher = new AppDataWatcher();
                        appWatcher.poll();
                    }

                    if ( _msgCb ) {

                        msgWatcher = new MessageWatcher();
                        msgWatcher.poll();
                    }


                    break;


            }


        }


        service.init = function ( params ) {

            _appName      = params.appName;
            _dataCb       = params.dataCallback;
            _msgCb        = params.messageCallback;
            _initialValue = params.initialValue || undefined;
            _netMethod    = params.netMethod || DEFAULT_METHOD;

            $log.debug( "optvAPI init for app: " + _appName );
            $log.debug( logLead() + " using net method: " + _netMethod );

            //Have to use the old then() signature for Chumby browser
            //Synching must be done before any other init...
            $http.get( '/api/v1/overplayos/ostime' )
                .then( function ( data ) {
                    var myJson = angular.toJson(data);
                    $log.debug( logLead()+" got this for time from OS server "+myJson);
                    var localTime = new Date().getTime();
                    var osTime = new Date( data.data.msdate );
                    _osTimeDifferential = osTime - localTime;
                    $log.debug( logLead() + " got new OS time diff of: " + _osTimeDifferential );
                    $log.debug( logLead() + " my local ms time is: "+ new Date().getTime());
                    initPhase2();

                },
                function ( err ) {
                    _osTimeDifferential = new Date( '11-01-2015' ).getTime() - new Date().getTime();
                    $log.debug( logLead() + " failed to get to OStime, setting to somthing close: " + _osTimeDifferential );
                    initPhase2();

                } );


        }

        service.save = function () {

            switch ( _netMethod ) {

                case 'websockets':

                    return $q( function ( resolve, reject ) {

                        io.socket.put( '/api/v1/AppData/' + _dbId, { data: service.model },
                            function ( data, jwres ) {

                                if ( jwres.statusCode != 200 )
                                    reject( jwres );
                                else
                                    resolve( data );
                            } );

                    } );

                    break;

                case 'http':

                    return $http.put( '/api/v1/AppData/' + _dbId, { data: service.model } );

                    break;
            }

        };


        service.postMessage = function ( msg ) {

            switch ( _netMethod ) {

                case 'websockets':

                    return $q( function ( resolve, reject ) {

                        //TODO remove 'to' throughout all apps...for now just or it.
                        var dest = msg.dest || msg.to || "io.overplay.mainframe";

                        if ( dest && msg.data ) {
                            var message = { dest: msg.to, message: msg.data, from: _appName };
                            io.socket.post( '/api/v1/ws/shout', message, function ( data, jwres ) {

                                if ( jwres.statusCode != 200 ) {
                                    reject( jwres );
                                } else {
                                    resolve( data );
                                }

                            } );

                        } else {
                            reject( "Missing params" );
                        }
                    } );


                    break;


                case 'http':

                    //TODO remove 'to' throughout all apps...for now just or it.
                    var dest = msg.dest || msg.to || "io.overplay.mainframe";

                    return $http.post( '/api/v1/appmessage', { dest: dest, from: _appName, messageData: msg.data } );

                    break;


            }


        };

        /**
         * Request app be moved between slots
         * @returns {promise that returns slot Id}
         */
        service.moveApp = function(appid){

            //Passing nothing moves the app this API service is attached to
            appid = appid || _appName;
            return $http.post( '/api/v1/overplayos/move?appid='+appid);

        };

        /**
         * Request app be launched
         * @returns {promise}
         */
        service.launchApp = function (appid) {

            //Passing nothing moves the app this API service is attached to
            appid = appid || _appName;
            return $http.post( '/api/v1/overplayos/launch?appid=' + appid );

        };

        /**
         * Request app be killed
         * @returns {promise}
         */
        service.killApp = function ( appid ) {

            //Passing nothing moves the app this API service is attached to
            appid = appid || _appName;
            return $http.post( '/api/v1/overplayos/kill?appid=' + appid );

        };


        return service;

    }
)

