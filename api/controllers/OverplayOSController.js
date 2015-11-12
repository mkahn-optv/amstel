/**
 * OverplayOSController
 *
 * @description :: Server-side logic for managing Overplayos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    launch: function ( req, res ) {

        sails.log.debug( "OPOS: launching app endpoint hit" );
        var rdn = req.param( 'appid' );
        if ( OPTVServerHelpers.queries.legitRDN( rdn ) && req.method == "POST" ) {

            OverplayOS.launchApp( rdn )
                .then( function ( resp ) {
                    res.ok( resp );
                } )
                .catch( function ( err ) {
                    res.badRequest( err );
                } )


        } else {

            res.badRequest( "Malformed request." );

        }


    },

    kill: function ( req, res ) {

        sails.log.debug( "OPOS: terminate app endpoint hit" );
        var rdn = req.param( 'appid' );
        if ( OPTVServerHelpers.queries.legitRDN( rdn ) && req.method == "POST" ) {

            var killed = OverplayOS.terminateApp( rdn );
            if (killed)
                    res.ok( "terminated" );
                else
                    res.notFound( rdn+" is not running." );

        } else {

            res.badRequest( "Malformed request." );

        }

    },

    restore: function ( req, res ) {


    },

    savestate: function ( req, res ) {


    },

    move: function ( req, res ) {

        sails.log.debug( "OPOS: moving app endpoint hit, nice aim." );
        var rdn = req.param( 'appid' );
        if ( OPTVServerHelpers.queries.legitRDN( rdn ) && req.method == "POST" ) {

            var newSlot = OverplayOS.moveApp( rdn );

            if (newSlot<0){
                return res.badRequest( "Could not move app." );
            }

            return res.ok({ slot: newSlot });


        } else {

            return res.badRequest( "Bad request" );

        }


    },

    install: function ( req, res ) {


    },

    running: function ( req, res ) {

        if ( req.method == "GET" )
            res.ok( OverplayOS.whatsRunning() );
        else
            res.badRequest();

    },

    screenmap: function ( req, res ) {

        if ( req.method == "GET" )
            res.ok( OverplayOS.getScreenMap() );
        else
            res.badRequest();

    },

    installed: function ( req, res ) {

        if ( req.method == "GET" ) {

            OverplayOS.installed()
                .then( res.ok )
                .catch( res.badRequest );

        } else {

            res.badRequest();

        }

    },

    appsbystate: function ( req, res ) {

        if ( req.method == "GET" ) {

            OverplayOS.appsByState()
                .then( res.ok )
                .catch( res.badRequest );

        } else {

            res.badRequest();

        }

    },

    ostime: function ( req, res ) {

        if ( req.method == "GET" ) {

            res.ok( { date: new Date() } );

        } else {

            res.badRequest();

        }

    }
}