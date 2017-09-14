import raf from './requestAnimationFrame.js'

const { requestAnimationFrame } = raf
class Canvas {
	constructor () {
		const canvas = document.createElement('canvas')
		canvas.id = 'canvas'
		document.body.appendChild(canvas)
		this.width = 0
		this.height = 0
		this.ctx = canvas.getContext('2d')
		this.requestAnimationFrame = requestAnimationFrame.bind(window)
	}

	setStyle () {
		this.width = window.innerWidth * 0.8
		this.height = window.innerHeight * 0.8
		canvas.setAttribute('width', this.width)
		canvas.setAttribute('height', this.height)
	}
}

export default Canvas
