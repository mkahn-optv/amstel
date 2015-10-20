/**
* Message.js
*
* @description :: For passing messages between apps. Mainly between apps and Mainframe
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Promises = require("bluebird");

module.exports = {

  attributes: {

    data: {
      type: 'json',
      defaultsTo: {}
    },

    to: {
      type: 'string',
      required: true
    },

    from: {
      type: 'string',
      required: true
    }

  },

  getMessagesTo: function(toRDN){

    if (OPTVServerHelpers.queries.legitRDN(toRDN)){
      return Message.find( { where: { to: toRDN }, sort: "createdAt ASC"} );
    } else {
      return Promises.reject("bad query");
    }
  }

};

