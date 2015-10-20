/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    'new': function (req, res) {
        console.log("Tracker: "+sails.config.printing.tracker);
        res.view();
    },

    create: function (req, res, next) {

        User.create(req.params.all(), function userCreated(err, user) {

            if (err) {
                console.warn(err);
                req.session.flash = {err: err};
                return res.redirect('/user/new');
            }

            req.session.authenticated = true;
            req.session.user = user;

            //var Configstore = require('configstore');
            //var conf = new Configstore('opconf');
            //conf.set('firstTime', false);

            res.redirect('/user/show/' + user.id);

        });
    },

    show: function (req, res, next) {

        User.findOne(req.param('id'))
            .then(function (user) {
                      if (!user) return next();
                      res.view({user: user});
                  })
            .catch(function (err) {
                       return next(err);
                   });
    },

    all: function (req, res, next) {

        User.find()
            .then(function (users) {
                      res.view({users: users});
                  })
            .catch(function (err) {
                       return next(err);
                   })
    },

    edit: function (req, res, next) {

        User.findOne(req.param('id'))
            .then(function (user) {
                      if (!user) return next();
                      res.view({user: user});
                  })
            .catch(function (err) {
                       return next(err);
                   });
    },

    update: function (req, res, next) {

        User.update(req.param('id'), req.params.all())
            .then(function (user) {
                      res.redirect('/user/show/' + req.param('id'));
                  })
            .catch(function (err) {
                       return res.redirect('/user/edit/' + req.param('id'));
                   });
    },

    destroy: function (req, res, next) {

        console.log("Destroying you bitches!");
        res.redirect('/');

    }

};

