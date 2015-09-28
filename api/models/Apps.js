/**
* Apps.js
*
* @description :: Entry per app installed
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {

    name: {
      type: "string",
      required: true
    },

    reverseDomainName: {
      type: "string",
      required: true
    },

    buildNumber: {
      type: "integer",
      required: true,
      defaultsTo: 0
    },

    signature: {
      type: "string",
      required: true
    },

    iconLabel: {
      type: "string",
      required: true
    },

    iconImage512: {
      type: "binary",
      required: true
    },

    iconImage128: {
      type: "binary",
      required: true
    },

    iconImage64: {
      type: "binary",
      required: true
    },

    show: {
      type: "boolean",
      defaultsTo: true
    }
  }
};

