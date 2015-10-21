/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var util = require('util');

module.exports = {

    /**
     * This wonderful route is essentially a duplication of a blueprint GET with ?to=<rdn>.
     * It's here for some debugging.
     * @param req
     * @param res
     * @param next
     */

    getTo: function (req, res, next) {

        var to = req.param('to');

        Message.getMessagesTo(to)
            .then(function (data) {
                      sails.log.debug(util.inspect(data));
                      res.ok(data);
                  })
            .catch(res.badRequest);


    },

    popTo: function (req, res, next) {

        var to = req.param('to');
        var inhibitPop = req.param('ld'); // "leave dirty" ... for testing

        Message.getMessagesTo(to)
            .then(function (data) {
                      //sails.log.debug("Pop message data: " + util.inspect(data));
                      if (!inhibitPop) {
                          data.forEach(function (m) {
                              Message.destroy(m.id)
                                  .then(function (md) {
                                            sails.log.debug("Whacked message: " + m.id);
                                        })
                                  .catch(function (err) {
                                             sails.log.debug("failed to whack: " + m.id);
                                         });
                          })
                      };
                      res.ok(data);
                  })
            .catch(res.badRequest);

    }


};

