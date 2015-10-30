/*********************************

 File:       optvAPI.js
 Function:   Provides an angular service wrapper for inter-app communication
 Copyright:  Overplay TV
 Date:       10/14/15 5:16 PM
 Author:     mkahn

 This is a preliminary version of an inter-app communications module (Angular Factory).

 **********************************/


angular.module('ngOpTVApi', [])
    .factory('optvModel', function ($http, $log, $interval, $rootScope, $q) {

                 var service = {model: {}};

                 //Callback for AppData updates
                 var _dataCb;

                 //Callback for new Message updates
                 var _msgCb;

                 var _appName;
                 var _dbId;
                 var _initialValue;

                 function logLead() {
                     var ll = "optvAPI (" + _appName + "): ";
                     return ll;
                 }

                 function setInitialAppDataValue() {

                     service.model = _initialValue;
                     io.socket.post('/api/v1/appdata', {
                         appName: _appName,
                         data: _initialValue
                     }, function (data, jwres) {

                         $log.debug(logLead() + "io.posted initial value");

                     })

                 }

                 function subscribeToAppDataNotifications() {

                     io.socket.get('/app/v1/appdata');

                     io.socket.on('appdata', function (obj) {
                         $log.info(logLead() + "Message came into AppData.")
                         handleAppDataMessage(obj);
                     });

                 }

                 function handleAppDataMessage(obj) {

                     //Check whether the verb is created or not
                     switch (obj.verb) {

                         case 'created':

                             $log.info(logLead() + "new appData created.");
                             if (obj.data.appName == _appName) {
                                 $log.info(logLead() + " data is for us, forwarding");
                                 _dataCb(obj.data.data);
                             }
                             break;

                         case 'updated':

                             $log.info(logLead() + " appData modded.");
                             if (obj.previous.appName == _appName) {
                                 $log.info(logLead() + " data is for us, forwarding");
                                 _dataCb(obj.data.data);
                             }

                             break;

                         default:

                     }

                 }


                 function subscribeToGlobalRoom() {

                     //Subscribe to ws messages
                     io.socket.post('/api/v1/ws/subscribe', {}, function (body, JWR) {
                         $log.info(body);
                     });

                     io.socket.on('intra-app-msg', function (obj) {
                         $log.info(logLead() + "Intra app message came in.")
                         handleIntraAppMessage(obj);
                     });

                 }

                 function handleIntraAppMessage(obj) {

                     //Lots of log messages while debugging the WS implementation
                     $log.info(logLead() + "SocketIO message inbound to optvAPI for app: " + _appName);
                     $log.info(logLead() + "SocketIO message destination: " + obj.dest);
                     $log.info(logLead() + "SocketIO message will be relayed? " + (obj.dest == _appName));
                     $log.info(angular.toJson(obj, true));

                     if (obj.dest == _appName) {
                         $log.info(logLead() + "optvAPI making message callback to " + _appName);
                         _msgCb(obj);
                     }

                 }


                 function loadModel() {

                     return $q(function (resolve, reject) {

                         io.socket.get('/api/v1/AppData/model?appName=' + _appName, function (data, jwres) {

                             if (jwres.statusCode != 200)
                                 reject(jwres);
                             else
                                 resolve(data);
                         })

                     })
                 }


                 service.init = function (params) {

                     _appName = params.appName;
                     _dataCb = params.dataCallback;
                     _msgCb = params.messageCallback;
                     _initialValue = params.initialValue || {};

                     $log.debug("optvAPI init for app: " + _appName);

                     if (_dataCb) {

                         io.socket.get('/api/v1/AppData/model?appName=' + _appName, function (data, jwres) {

                             if (jwres.statusCode != 200) {
                                 $log.info(logLead() + " model data not in DB, creating");
                                 service.model = _initialValue;
                                 setInitialAppDataValue();
                             }
                             else {
                                 $log.info(logLead() + " model data (appData) already existed.");
                                 service.model = data.data;
                                 _dbId = data.id;

                             }
                         });

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

                         $log.debug("optvAPI init app: " + _appName + " subscribing to data");
                         subscribeToAppDataNotifications();

                     }

                     //If a message cb is defined, subscribe
                     if (_msgCb) {
                         $log.debug("optvAPI init app: " + _appName + " subscribing to messages");
                         subscribeToGlobalRoom();
                     }

                 }

                 service.save = function () {

                     return $q(function (resolve, reject) {

                         io.socket.put('/api/v1/AppData/' + _dbId, {data: service.model},
                                       function (data, jwres) {

                                           if (jwres.statusCode != 200)
                                               reject(jwres);
                                           else
                                               resolve(data);
                                       });

                     });

                 };

                 service.postMessage = function (msg) {

                     return $q(function (resolve, reject) {

                         //TODO remove 'to' throughout all apps...for now just or it.
                         var dest = msg.dest || msg.to || "io.overplay.mainframe";

                         if (dest && msg.data) {
                             var message = {dest: msg.to, message: msg.data, from: _appName};
                             io.socket.post('/api/v1/ws/shout', message, function (data, jwres) {

                                 if (jwres.statusCode != 200) {
                                     reject(jwres);
                                 } else {
                                     resolve(data);
                                 }

                             });

                         } else {
                             reject("Missing params");
                         }
                     })


                 }


                 return service;

             })

