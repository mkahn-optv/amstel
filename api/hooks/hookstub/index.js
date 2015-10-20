/*********************************

 File:       index.js
 Function:   Hook Stub as placeholder for writing hooks
 Copyright:  Overplay TV
 Date:       10/14/15
 Author:     mkahn


 Use this file as an example of how to write hooks. In production, this code
 should probably be removed or renamed so it never gets run.

 **********************************/

//TODO: this file should be moved or disabled in production for cleanliness.

module.exports = function stubHook(sails) {

    // This var will be private
    var foo = 'bar';

    // This var will be public
    this.abc = 123;

    var myConfig;

    return {

        configure: function () {

            // Configure hook
            if (!sails.config.hookstub) {
                sails.log.verbose("There is no config file for hookstub, ending config.");
                return;
            }

            // if we get here, there is a hookstub.js in /config
            myConfig = sails.config.hookstub;

        },

        initialize: function (cb) {

            // Initialize hook

            //If no config file, don't do anything. It means the hook is not used.
            if (!sails.config.hookstub) return cb();

            sails.log.verbose('hookstub hook init');

            //Let the system boot up before starting hookstub cron function
            var cronDelay = sails.config.hookstub.cronDelay || 5000;

            sails.log.verbose('hookstub initializing in ' + cronDelay + 'ms');

            setTimeout( sails.hooks.hookstub.doForever, cronDelay );

            // MUST always remember to call `cb` to continue
            return cb();

        },

        // This function will be public
        doForever: function () {

            sails.log.verbose('hookstub cronloop...');


            setTimeout(sails.hooks.hookstub.doForever, myConfig.cronPeriod*1000);
        }

    };


};
