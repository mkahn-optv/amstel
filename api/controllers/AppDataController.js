/**
 * AppDataController
 *
 * @description :: Server-side logic for managing Appdatas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    sync: function (req, res, next) {

        console.log(req);
        res.send('yep');

    },

    model: function (req, res, next) {

        AppData.findOne({appName: req.param('appName')})
            .then(function (appData) {

                      appData = appData || {};
                      res.json(appData);


                  })
            .catch(function (err) {

                       return next(err);

                   })

    },

    subscribe: function (req, res) {

        var app = req.param('appName');

        if (app) {

            AppData.findOneByAppName(app)
                .then(function (model) {
                          sails.log.debug("Subscribing " + req.socket.id + " to AppData model: " + model.id);
                          //Subscribe to this particular model instance
                          AppData.subscribe(req, [ model.id ]);
                          res.ok();

                      })
                .catch(function (err) {
                           res.negotiate(err);
                       })
        } else {
            res.badRequest();
        }

    }

};

