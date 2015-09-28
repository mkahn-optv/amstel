/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


module.exports = {

    schema: true,

    attributes: {

        firstName: {
            type: 'string'
        },

        lastName: {
            type: 'string'
        },

        email: {
            type: 'email',
            unique: true,
            required: true
        },

        encryptedPassword: {
            type: 'string'
        },

        accountType: {
            type: 'string',
            enum: [ 'optv', 'admin', 'patron', 'dev', 'partner'],
            defaultsTo: 'patron', //lowest level
            required: true
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.encryptedPassword;
            delete obj._csrf;
            return obj;

        }

    },

    beforeCreate: function (values, next) {

            console.log("Before User create");

            if (!values.password || values.password != values.confirmation) {
                return next({err: ["Passwords do not match"]});
            }

            require('bcrypt').hash(values.password, 10, function (err, encryptedPwd) {
                if (err) return next(err);
                values.encryptedPassword = encryptedPwd;
                next();

            })
        }


};

