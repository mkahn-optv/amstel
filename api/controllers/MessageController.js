/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var util = require('util');

module.exports = {

    popMessage: function (req, res, next) {

        var to = req.param('to');
        var rval = IAMessaging.popMessages(to);
        res.ok(rval);

    },

    postMessage: function (req, res, next) {

        var to = req.param('to');
        IAMessaging.postMessage(to, req.param('message'));
        res.ok(req.param('message'));


    }


};

