/**
* AppData.js
*
* @description :: Per app JSON store
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    data: {
      type: 'json',
      defaultsTo: {}
    },

    appName: {
      type: 'string',
      required: true
    }

  }
};

