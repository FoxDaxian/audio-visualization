import Buffer from './js/Buffer.js'
import Canvas from './js/Canvas.js'

const buffer = new Buffer()
buffer.execute({
    type: 'particle',
    fft: 2048
})