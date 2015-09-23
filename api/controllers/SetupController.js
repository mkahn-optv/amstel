/**
 * SetupController
 *
 * @description :: Server-side logic for managing setups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Configstore = require('configstore');
var conf = new Configstore('opconf', {firstTime: true});

module.exports = {

    setupOrLogin: function (req, res, next) {

        if (conf.get('firstTime')) {

            res.view('static/index');
        } else {

            res.view('session/login');
        }

    },

    clear: function (req, res, next) {

        conf.clear();
        res.redirect('/');

    }
};

