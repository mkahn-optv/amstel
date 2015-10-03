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

    model: function (req, res, next ) {

        AppData.findOne({ appName: req.param('appName')})
                            .then(function(appData){

                                appData = appData || {};
                                res.json(appData);


                            })
                            .catch(function(err){

                                return next(err);

                            })

    }

};

