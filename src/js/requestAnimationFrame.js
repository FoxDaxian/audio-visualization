const prefixes = 'webkit moz ms o'.split(' ')
let lastTime = 0

let requestAnimationFrame = window.requestAnimationFrame
let cancelAnimationFrame = window.cancelAnimationFrame

let prefix
for( let i = 0; i < prefixes.length; i++ ) {
	if ( requestAnimationFrame && cancelAnimationFrame ) {
		break;
	}
	prefix = prefixes[i]
	requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ]
	cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ]
}

if ( !requestAnimationFrame || !cancelAnimationFrame ) {
	requestAnimationFrame = function( callback, element ) {
		const currTime = new Date().getTime()
		const timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) )
		const id = window.setTimeout( function() {
			callback( currTime + timeToCall )
		}, timeToCall )
		lastTime = currTime + timeToCall
		return id
	}

	cancelAnimationFrame = function( id ) {
		window.clearTimeout( id )
	}
}

export default {
	requestAnimationFrame, cancelAnimationFrame
}