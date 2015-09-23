/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

    'login': function (req, res) {

        res.view('session/login');

    },

    'create': function (req, res, next) {

        if (!req.param('email') || !req.param('password')) {
            req.session.flash = {err: {name: 'dipshit', message: 'try a fucking usename/pwd'}};
            return res.redirect('session/login');
        }

        User.findOneByEmail(req.param('email'))
            .then(function (user) {
                      if (!user) {
                          req.session.flash = {err: {name: 'NoSuchUser', message: 'No such user!'}};
                          return res.redirect('session/login');
                      }

                      bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
                          if (err) return next(err);

                          if (!valid) {
                              req.session.flash = {err: {name: 'BadPassword', message: 'Bad password!'}};
                              return res.redirect('session/login');
                          }

                          req.session.authenticated = true;
                          req.session.user = user;
                          res.redirect('/user/show/' + user.id);

                      })

                  })
            .catch(function (err) {
                       req.session.flash = {err: err};
                       return res.redirect('session/login');

                   })
    },

    destroy: function(req, res, next){

        req.session.destroy();
        res.redirect('session/login');

    }
};

