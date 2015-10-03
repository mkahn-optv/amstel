/**
 *
 *
 */

angular.module('ngOpTVApi', [])
    .factory('optvModel', function ($http, $log, $interval, $rootScope) {

                 var service = {model: {}};

                 var _refreshInterval;
                 var _refreshMachine;
                 var _refreshCb;
                 var _autoSync;
                 var _appName;
                 var _dbId;
                 var _initialValue;

                 function startWatching() {

                     $rootScope.$watch(service.model, function (newModel) {

                         $log.info("AppData model changed.")

                     }, true);

                 }

                 service.loadModel = function () {

                     return $http.get('/api/v1/AppData/model?appName=' + _appName)
                         .then(function (data) {

                                   if (data.data.data) {

                                       $log.debug("optvModel: model has existing data.");
                                       service.model = data.data.data; // no nice, we named it thrice
                                       _dbId = data.data.id;
                                       return service.model;

                                   } else if (!_initialValue){
                                        return {};
                                   } else {

                                        return $http.post('/api/v1/AppData', { appName: _appName, data: _initialValue })
                                            .then( function(data) {
                                                _dbId = data.data.id;
                                                return _initialValue;
                                            })

                                   }


                               });

                 }

                 service.init = function (params) {

                     _appName = params.appName;
                     _refreshInterval = params.refreshInterval || 0;
                     _refreshCb = params.refreshCallback;
                     _initialValue = params.initialValue;

                     if (_refreshInterval && _refreshCb) {
                         _refreshMachine = $interval(function () {
                             service.loadModel().then(_refreshCb);
                         }, _refreshInterval);
                     }

                     return service.loadModel();


                 }


                 service.save = function () {

                     return $http.put('/api/v1/AppData/' + _dbId, {data: service.model, appName: _appName});

                 };


                 return service;

             })

