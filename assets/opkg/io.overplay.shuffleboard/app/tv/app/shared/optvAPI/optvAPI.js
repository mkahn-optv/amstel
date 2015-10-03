/**
 *
 *
 */

angular.module('ngOpTVApi', [])
    .factory('optvModel', function ($http, $log, $interval) {

                 var service = {model: {}};

                 var _refreshInterval;
                 var _refreshMachine;
                 var _refreshCb;
                 var _autoSync;
                 var _appName;
                 var _dbId;

                 function startWatching() {

                     $rootScope.$watch(service.model, function (newModel) {

                         $log.info("AppData model changed.")

                     }, true);

                 }

                 service.loadModel = function() {

                     return $http.get('/AppData/model?appName=' + _appName)
                         .then(function (data) {

                                   service.model = data.data.data; // no nice, we named it thrice
                                   _dbId = data.data.id;
                                   return service.model;

                               });

                 }

                 service.init = function (params) {

                     _appName = params.appName;
                     _refreshInterval = params.refreshInterval || 0;
                     _autoSync = params.autoSync || false;
                     _refreshCb = params.refreshCallback;

                     if (_refreshInterval && _refreshCb ){
                        _refreshMachine = $interval(function(){
                            service.loadModel().then(_refreshCb);
                        }, _refreshInterval);
                     }

                     return service.loadModel()
                         .then(function (data) {
                                   if (_autoSync) startWatching();
                                   return data;
                               })

                 }



                 service.saveModel = function () {};


                 return service;

             })

