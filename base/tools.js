'use strict'

let defaultLevel = 'info',
    levels = [ 'info', 'debug', 'warn', 'error' ],
    _log = ( level, msgs ) => {
        let args = [ `[${level.toUpperCase()}] ` ].concat( msgs )
        console.log.apply( console, args )
    },
    logger = {
        log: function () {
            /**
             * https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
             * leaking arguments would make V8 bailout.
             */
            let len = arguments.length,
                args = new Array( len )

            for ( let i = 0; i < len; i++ ) {
                args[ i ] = arguments[ i ]
            }
            _log( defaultLevel, args )
        }
    }

levels.forEach(( level ) => {
    logger[ level ] = function () {
        let len = arguments.length,
            args = new Array( len )

        for ( let i = 0; i < len; i++ ) {
            args[ i ] = arguments[ i ]
        }
        _log( level, args )
    }
})


let reflectAction = ( com ) => {
	com = com.split( '.' )
	let action = com.splice( com.length - 1, 1 )[ 0 ],
		modPath = Config.controller + '/' + com.join( '/' )

	return ( ctx, next ) => {
		let Mod = require( modPath ),
			modIns = new Mod()

		return modIns[ action ]( ctx, next )
	}
}


global.reflectAction = reflectAction
global.logger = logger