import base from './Canvas_base.js'

class Canvas extends base {
	constructor (buffer) {
		super()
		this.setStyle()
		this.buffer = buffer

		// 平均值用到的数据
		this.total = 0
		this.len = this.buffer.length
		this.capHead = []
		window.addEventListener('resize', () => {
			this.setStyle()
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

			if (this.capHead[i] < value) {
				this.ctx.fillRect((width + space) * i, this.height - value - 10, width, -forShow)
				this.capHead[i] = value
			} else {
				this.ctx.fillRect((width + space) * i, this.height - (--this.capHead[i] > 0 ? --this.capHead[i] : 0) - 10, width, -forShow)
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

	average () {
		this.total = 0
		for (let i = 0; i < this.len; i++) {
			this.total += this.buffer[i]
		}
		return this.total / this.len
	}
}

export default Canvas
