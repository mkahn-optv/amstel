/*********************************

 File:       optvAPI.js
 Function:   Provides an angular service wrapper for inter-app communication
 Copyright:  Overplay TV
 Date:       10/14/15 5:16 PM
 Author:     mkahn

 This is a preliminary version of an inter-app communications module (Angular Factory). Ultimately, we will use socketio
 for better performance. For now, we use polling.

 **********************************/


angular.module('ngOpTVApi', [])
    .factory('optvModel', function ($http, $log, $interval, $rootScope, $q) {

                 var service = {model: {}};

                 var _refreshInterval;
                 var _refreshMachine;

                 //Callback for AppData updates
                 var _dataCb;

                 //Callback for new Message updates
                 var _msgCb;

                 var _appName;
                 var _dbId;
                 var _initialValue;

                 function writeData(outboundData) {

                     return $http.post('/api/v1/AppData', {appName: _appName, data: outboundData})
                         .then(function (data) {
                                   _dbId = data.data.id;
                                   return data.data.data;
                               });

                 }

                 service.loadModel = function () {

                     return $http.get('/api/v1/AppData/model?appName=' + _appName)
                         .then(function (data) {

                                   if (data.data.data) {

                                       //$log.debug("optvModel: model has existing data.");
                                       service.model = data.data.data; // no nice, we named it thrice
                                       _dbId = data.data.id; // id of the single data entry for this app
                                       return service.model;

                                   } else {

                                       // There is no data already in the DB, so let's create an entry with the default
                                       // data, or nothing if that is what the user did(nt) provide

                                       return writeData(_initialValue);

                                   }


                               });

                 }


                 service.init = function (params) {

                     _appName = params.appName;
                     _dataCb = params.dataCallback;
                     _msgCb = params.messageCallback;
                     _initialValue = params.initialValue || {};

                     //If a data cb is defined, subscribe
                     //TODO should only subscribe to one instance of the appdata model!!!
                     if (_dataCb) {
                         io.socket.get('/api/v1/appdata');
                     }

                     //If a message cb is defined, subscribe
                     if (_msgCb) {
                         io.socket.get('/api/v1/message');
                     }

                     if (_msgCb || _dataCb) {

                         io.socket.on('message', function (obj) {
                             //Check whether the verb is created or not
                             $log.info("SocketIO message inbound to API");
                             $log.info(angular.toJson(obj, true));
                             if (obj.data.dest==_appName) _msgCb(obj.data);

                         });

                         io.socket.on('appdata', function (obj) {
                             //Check whether the verb is created or not
                             $log.info("SocketIO appdata inbound to API");
                             $log.info(angular.toJson(obj, true));
                             if (obj.data.appName==_appName) _dataCb(obj.data.data);

                         });

                     }

                     return service.loadModel();

                 }

                //TODO detect failure in io.socket.post
                 service.save = function () {

                     return $q(function(resolve, reject){

                        io.socket.put('/api/v1/AppData/' + _dbId, {data: service.model, appName: _appName}, function(data, jwres){
                            resolve(data)
                        });

                     });

                 };

                 service.postMessage = function (msg) {

                     return $q(function (resolve, reject) {

                         if (msg.to && msg.data) {
                             var message = {dest: msg.to, message: msg.data, from: _appName};
                             io.socket.post('/api/v1/message', message, function (data, jwres) {
                                 resolve(data);

                             });
                         } else {
                             reject("Missing params");
                         }
                     })


                 }


                 return service;

             })

