/**
* AppData.js
*
* @description :: Per app JSON store
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {

    data: {
      type: 'json',
      defaultsTo: {}
    },

    appName: {
      type: 'string',
      required: true
    },

    modTime: {
      type: 'integer'
    }

  },

  //These are here because Chumby cannot handle Zulu time
  beforeCreate: function ( values, next ) {

      values.modTime = new Date().getTime();
      next();

  },


  beforeUpdate: function ( values, next ) {

    values.modTime = new Date().getTime();
    next();

  }

};

