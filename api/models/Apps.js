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

        publisher: {
            type: 'string'
        },

        toJSON: function () {

            var app = this.toObject();
            app.launcherIconPath = '/opkg/' + app.reverseDomainName + '/assets/icons/' + app.iconLauncher;
            return app;

        }
    }
};

