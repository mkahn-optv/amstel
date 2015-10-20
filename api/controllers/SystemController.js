/**
 * SystemController
 *
 * @description :: Server-side logic for interfacing between sails and client apps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    systemState: function (req, res, next) {

        if (req.method == 'GET') {
            sails.log.debug("SystemController: Fetching running apps.");
            return res.ok(OPTVServerHelpers.systemState);
        }

        res.forbidden();

    },

    //TODO:
    //Architecturally, I think Mainframe should probably be server-side rendered and then this method would not be needed.

    setRunning: function (req, res, next) {

        if (req.method == 'POST') {
            sails.log.debug("SystemController: Setting running apps.");
            OPTVServerHelpers.systemState.runningCrawlers = req.param('crawlers');
            OPTVServerHelpers.systemState.runningWidgets = req.param('widgets');
            return res.ok(OPTVServerHelpers.systemState);
        }

        res.forbidden();

    }

};

