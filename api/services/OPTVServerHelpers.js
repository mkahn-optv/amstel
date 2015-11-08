/*********************************

 File:       OPTVServerHelpers.js
 Function:   Helpers for various server actions
 Copyright:  Overplay TV
 Date:       10/14/15 4:28 PM
 Author:     mkahn

 Includes some query sanitization, etc.

 **********************************/


var _ = require('lodash');


// Checks to make sure only a-Z, 0-9, and dash is in the string.
var isLegit = function (s) {

    var legit = /^[\w\-]+$/;
    return legit.test(s);

};

/**
 * Looking for a string like <legit>.<legit>.<legit>
 * @param s
 * @returns {boolean}
 */
var isReverseDomainNameLike = function (s) {

    if (s) {
        var components = s.split('.');
        if (components.length === 3) {
            // well, at least it is 3 components, let's see if they are clean strings
            components.forEach(function (c) {
                if (!isLegit(c))
                    return false;
            })

            return true;
        }
    }

    return false;
}


// Checks to make sure param is either a single legit string, or a cleaned array of legit strings.

var sosa = function (param) {

    if (typeof param === 'string') {
        //we have a string
        //check for query injection.
        return this.legitString(param) ? param : undefined;

    } else if (Array.isArray(param)) {

        var rval = _.remove(param, function (p) {
            return isLegit(p);
        })

        //Empty array might be a bad query, so punt it
        if (rval.length > 0) {
            return rval;
        } else {
            return undefined;
        }

    } else {
        return undefined;
    }

}

function isStringArray(arr) {

    if (Array.isArray(arr)) {

        var len = arr.length;
        var isStringArray = true;

        // This would be faster without forEach. Use a loop that can be broken.
        arr.forEach(function (entry) {

            if ((typeof entry !== 'string') || !(entry instanceof String)) {
                isStringArray = false;
            }
        });


        return isStringArray;

    }

    return false;
}


module.exports = {

    //The Queries group is for operations related to inbound REST queries
    queries: {

        /**
         *
         * Only allow strings of the from 0-9 a-Z and a - (for uuid type stuff)
         * Prevent anything that looks like a Mongo query
         *
         * @param s
         * @returns {boolean}
         */

        legitString: isLegit,

        /**
         * Used for POSTs and PUTs that are doing denormalization. These need a string, or an array of
         * legitimate strings which are usually IDs. Anything else is considered a threat and chucked.
         * @param param
         * @returns {*}
         */

        stringOrStringArray: sosa,

        /**
         *
         * Used for queries that are supposed to be reverse domain app names
         *
         */

        legitRDN: isReverseDomainNameLike
    }

}