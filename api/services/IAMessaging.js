/*********************************

 File:       IAMessaging.js
 Function:   Memory based messaging
 Copyright:  Overplay TV
 Date:       10/20/15 4:28 PM
 Author:     mkahn

 **********************************/


var _ = require('lodash');

var _messageMap = {};

module.exports = {

    clearAll: function(){
        _messageMap = {};
    },

    postMessage: function(targetRDN, messageObject){

        if (!_messageMap[targetRDN]){
            _messageMap[targetRDN] = [];
        }

        _messageMap[targetRDN].push(messageObject);

    },

    popMessages: function(targetRDN){

        var rval = _messageMap[targetRDN];
        _messageMap[targetRDN] = [];
        return rval || [];

    },

    _hello: function(){
        console.log("HELLO");
    },

    getMM: function(){
        return _messageMap;
    }

}