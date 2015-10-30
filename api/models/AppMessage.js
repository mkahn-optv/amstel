/**
* AppMessage.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {

    dest: {
      type: 'string',
      required: true
    },

    from: {
      type: 'string',
      required: true
    },

    messageData: {
      type: 'json'
    }

  }
};

