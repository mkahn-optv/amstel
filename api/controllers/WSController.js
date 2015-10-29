/**
 * WSController
 *
 * @description :: Server-side logic for managing WS
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    subscribe: function (req, res) {

        sails.log.debug("In WsController:subscribe");
        var roomName = req.param('roomName') || "overplay";
        sails.sockets.join(req.socket, roomName);
        res.json({
            message: 'Subscribed to a fun room called ' + roomName + '!'
        });

    },

    shout: function (req, res) {

        var roomName = req.param('roomName') || "overplay";

        sails.log.debug("Shout it, shout it, shout it out loud! (to room: "+roomName+")");

        sails.sockets.broadcast(roomName, "intra-app-msg", {
            dest: req.param('dest'),
            from: req.param('from'),
            message: req.param('message'),

        }, req.socket);

        res.ok("Shouted");

    },

    showSockets: function (req, res) {

        var clients = sails.sockets.rooms();
        res.ok(clients);

    }


};

