/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var util = require('util');

module.exports.bootstrap = function (cb) {


    function installStockApps() {

        var stockApps = sails.config.stockapps && sails.config.stockapps.apps;
        //sails.log.debug(util.inspect(stockApps));

        if ( Array.isArray(stockApps) ) {
            stockApps.forEach(function (app) {

                Apps.create(app)
                    .then(function (a) {
                              sails.log.debug("Attempt to install " + app.reverseDomainName + " yielded: " + a);

                          })
                    .catch(function (e) {
                               sails.log.silly("Error on attempt to install " + app.reverseDomainName + " yielded: " + e);

                           });

            });

        }


    }

    installStockApps();

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
