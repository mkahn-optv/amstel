/**
 *
 *
 */

angular.module('ngOpTVApi', [])
    .factory('optvModel', function ($http, $log, $interval, $rootScope) {

                 var service = {model: {}};

                 var _refreshInterval;
                 var _refreshMachine;

                 //Callback for AppData updates
                 var _dataCb;
                 //Callback for new Message updates
                 var _msgCb;
                 var _autoSync;
                 var _appName;
                 var _dbId;
                 var _initialValue;

                 service.loadModel = function () {

                     return $http.get('/api/v1/AppData/model?appName=' + _appName)
                         .then(function (data) {

                                   if (data.data.data) {

                                       $log.debug("optvModel: model has existing data.");
                                       service.model = data.data.data; // no nice, we named it thrice
                                       _dbId = data.data.id;
                                       return service.model;

                                   } else if (!_initialValue) {
                                       return {};
                                   } else {

                                       return $http.post('/api/v1/AppData', {appName: _appName, data: _initialValue})
                                           .then(function (data) {
                                                     _dbId = data.data.id;
                                                     return _initialValue;
                                                 })

                                   }


                               });

                 }

                 service.loadMessages = function () {

                     return $http.get('/api/v1/message?to=' + _appName + '&sort=created ASC')
                         .then(function (data) {

                                   if (data.data.length > 0) {
                                       $log.info("New messages received. Length: " + data.data.length);
                                       //Remove rx'd messages
                                       data.data.forEach(function (d) {
                                           $http.delete('/api/v1/message/' + d.id);
                                       });
                                   }

                                   return data.data;

                               });


                 }

                 service.init = function (params) {

                     _appName = params.appName;
                     _refreshInterval = params.refreshInterval || 0;
                     _dataCb = params.dataCallback;
                     _msgCb = params.messageCallback;
                     _initialValue = params.initialValue;

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


                 service.save = function () {

                     return $http.put('/api/v1/AppData/' + _dbId, {data: service.model, appName: _appName});

                 };

                 service.postMessage = function (msg) {

                     if (msg.to && msg.data) {
                         var message = {to: msg.to, data: msg.data, from: _appName};
                         return $http.post('/api/v1/message', message);
                     }

                     return $q.reject("Missing params");

                 }


                 return service;

             })

