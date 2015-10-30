/**
 * AppMessageController
 *
 * @description :: Server-side logic for managing Appmessages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    getNext: function (req, res, next) {

        //Since client clock and our clock may be different, we need to search using
        //relative time in ms. 'ago' param is how many ms since the client read from us
        //based on its frame of reference.
        var relativeTime = req.param('ago');
        var dest = req.param('dest');

        if (relativeTime && dest) {

            var inOurFrame = (new Date().getTime()) - relativeTime;
            var dateLimit = new Date(inOurFrame);
            var query = {createdAt: {'>=': dateLimit}, dest: dest};
            AppMessage.find(query)
                .then(function (messages) {
                          if (messages)
                              res.json(messages);
                          else
                              res.notFound();
                      })
                .catch(function (err) {
                           return next(err);
                       })

        } else {
            return res.badRequest("Missing Params");
        }
    }




};

