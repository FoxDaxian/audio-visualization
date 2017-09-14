import base from './Canvas_base.js'

class Canvas extends base {
	constructor (buffer = []) {
		super()
		this.setStyle()
		this.buffer = buffer
		this.executed = ''

		// 平均值用到的数据
		this.total = 0
		this.len = this.buffer.length
		this.capHead = []
		window.addEventListener('resize', () => {
			this.setStyle()
			this[this.executed]()
		})
	}

	default () {
		const width = 20
		const space = 2
		const count = Math.floor(this.width / (width + space))
		const forShow = 5
		const step = Math.round(this.len / count) // 类似抽样，这样更平均

		this.ctx.clearRect(0, 0, this.width, this.height)

		var gradient = this.ctx.createLinearGradient(0, this.height - 255, 0, this.height)
		gradient.addColorStop(1, '#19be6b')
		gradient.addColorStop(0.5, '#ff9900')
		gradient.addColorStop(0, '#ed3f14')

		this.ctx.fillStyle = '#2d8cf0'
		// 如果帽的长度小于长度，则push,相当于初始化
		for (let i = 0; i < count; i++) {
			const value = this.buffer[step * i]
			if (this.capHead.length < count) {
				this.capHead.push(value)
			}

			if (value < this.capHead[i]) {
				this.ctx.fillRect((width + space) * i, this.height - (--this.capHead[i]) - 10, width, -forShow)
			} else {
				this.ctx.fillRect((width + space) * i, this.height - value - 10, width, -forShow)
				this.capHead[i] = value
			}
		}

		this.ctx.fillStyle = '#80848f'
		for (let i = 0; i < count; i++) {
			const value = this.buffer[step * i]
			if (typeof value !== 'undefined') {
				this.ctx.fillRect((width + space) * i, this.height, width, -forShow)
			}
		}

		this.ctx.fillStyle = gradient
		for (let i = 0; i < count; i++) {
			const value = this.buffer[step * i]
			if (typeof value !== 'undefined') {
				this.ctx.fillStyle = gradient
				this.ctx.fillRect((width + space) * i, this.height - forShow - 2, width, -value)
			}
		}
		this.ctx.fill()

	}

	circle () {
		this.ctx.clearRect(0, 0, this.width, this.height)
		this.buffer.forEach((buf) => {
			this.ctx.beginPath()
			this.ctx.arc(this.width / 2, this.height / 2, buf, 0, Math.PI * 2, true)
			this.ctx.closePath()
			this.ctx.lineWidth = 2
			this.ctx.strokeStyle = `#${ buf }`
			this.ctx.stroke()
		})
	}

	particle () {
		this.preLoad('../../public/note.png', (arg) => {
			this.executed = 'particle'
			this.ctx.clearRect(0, 0, this.width, this.height)
			this.ctx.drawImage(arg, 0, 0)

			const imgData = this.ctx.getImageData(0, 0, arg.width, arg.height)
			const len = imgData.data.length
			const temp = []
			for (let i = 0; i < len; i += 4) {
				if (imgData.data[i + 3] > 100) {
					temp.push([imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3]])
				}
			}

			const imgData2 = this.ctx.createImageData(arg.width, arg.height)
			for (let i = 0; i < temp.length; i += 4){
				const spliceArr =  temp.splice(0, 1)
				imgData2.data[i + 0] = spliceArr[0][0]
				imgData2.data[i + 1] = spliceArr[0][1]
				imgData2.data[i + 2] = spliceArr[0][2]
				imgData2.data[i + 3] = spliceArr[0][3]
			}
			this.ctx.putImageData(imgData2, 0, 0)

		})
	}

	average () {
		this.total = 0
		for (let i = 0; i < this.len; i++) {
			this.total += this.buffer[i]
		}
		return this.total / this.len
	}

	preLoad (src = '../../public/note.png', callback = () => {
		console.log('proload completed')
	}) {
		const img = document.createElement('img')
		img.src = src
		img.onload = () => {
			callback.call(this, img)
		}
	}
}

export default Canvas
