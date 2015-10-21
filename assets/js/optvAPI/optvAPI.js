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
    .factory('optvModel', function ($http, $log, $interval, $rootScope) {

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

                 service.loadMessages = function () {

                     return $http.get('/api/v1/message/popMessage?to=' + _appName)
                         .then(function (data) {

                                   //This is here for debugging
                                   if (data.data.length > 0) {
                                       $log.info("New messages received. Length: " + data.data.length);
                                   }

                                   return data.data;

                               });


                 }

                 service.init = function (params) {

                     _appName = params.appName;
                     _refreshInterval = params.refreshInterval || 10000; //if you don't care enough to set it, you get 10s
                     _dataCb = params.dataCallback;
                     _msgCb = params.messageCallback;
                     _initialValue = params.initialValue || {};

                     //If there are either kind of callback defined, then setup the callback looper
                     if (_refreshInterval && (_dataCb || _msgCb )) {
                         _refreshMachine = $interval(function () {
                             if (_dataCb)
                                 service.loadModel().then(_dataCb);
                             if (_msgCb)
                                 service.loadMessages()
                                     .then(function (msg) {
                                               if (msg.length)
                                                   _msgCb(msg);
                                           });
                         }, _refreshInterval);
                     }

                     return service.loadModel();


                 }

                 //TODO this is replicated from the method above, should be cleaner up
                 service.save = function () {

                     return $http.put('/api/v1/AppData/' + _dbId, {data: service.model, appName: _appName});

                 };

                 service.postMessage = function (msg) {

                     if (msg.to && msg.data) {
                         var message = {to: msg.to, message: { data: msg.data, from: _appName }};
                         return $http.post('/api/v1/message/postMessage', message);
                     }

                     return $q.reject("Missing params");

                 }


                 return service;

             })

