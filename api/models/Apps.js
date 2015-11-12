/**
 * Apps.js
 *
 * @description :: Entry per app installed
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {

        appType: {
            type: "string"//,
            //enum: [ "partial", "fullscreen"]
        },

        name: {
            type: "string",
            required: true
        },

        reverseDomainName: {
            type: "string",
            required: true,
            unique: true
        },

        buildNumber: {
            type: "integer",
            required: true,
            defaultsTo: 0
        },

        signature: {
            type: "string",
            required: false
        },

        iconLabel: {
            type: "string",
            required: false
        },

        iconLauncher: {
            type: "string",
            required: false
        },


        onLauncher: {
            type: "boolean",
            defaultsTo: true
        },

        isMain: {
            type: "boolean",
            defaultsTo: false
        },

        publisher: {
            type: 'string'
        },

        size: {
            type: 'json',
            defaultsTo: { "top": 0, "left": 0 }
        },

        currentFrame: {
            type: 'json',
            defaultsTo: { "top": 0, "left": 0, "width": 0, "height": 0 }
        },

        slotNumber: {
            type: 'integer',
            defaultsTo: 0
        },

        lastUsed: {
            type: "integer",
            defaultsTo: 0
        },

        running: {
            type: "boolean",
            defaultsTo: false
        },

        toJSON: function () {

            var app = this.toObject();
            app.launcherIconPath = '/opp/' + app.reverseDomainName + '/assets/icons/' + app.iconLauncher;
            return app;

        }
    }
};

