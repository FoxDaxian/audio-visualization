import base from './Canvas_base.js'

class Canvas extends base {
	constructor (buffer = []) {
		super()
		this.setStyle()
		// 获取音频的dataArray
		this.buffer = buffer
		// 将被执行的函数名
		this.executed = ''

		// 平均值用到的数据
		this.total = 0
		this.len = this.buffer.length
		this.capHead = []

		// 粒子效果相关内容
		// 图片相关数据
		this.imgRelated = {
			img: null,
			preloadCompleted: false,
			preloading: false,
			x: 0,
			y: 0,
			drawData: []
		}
		this.particleOPtion = {
			particleSize: 3,
			range: 2,
			randomRange: 8.5,
			size: 200
		}

		window.addEventListener('resize', () => {
			this.setStyle()
			this.executed && this[this.executed]()
		})
	}

	default () {
		this.executed || (this.executed = 'default')
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
		this.executed || (this.executed = 'circle')
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
		const draw = () => {
			this.executed || (this.executed = 'particle')

			const center_x = this.imgRelated.img.width / 2
			const center_y = this.imgRelated.img.height / 2
			this.ctx.clearRect(0, 0, this.width, this.height)

			const average = this.average() * this.particleOPtion.range
			const len = this.imgRelated.drawData.length
			for (let i = 0; i < len; i++) {
				const v = this.imgRelated.drawData[i]
				const averageHalf = average / 2
				let real_x = v.x + this.imgRelated.x
				let real_y = v.y + this.imgRelated.y
				this.ctx.fillStyle = `rgba(${ v.color[0] }, ${ v.color[1] }, ${ v.color[2] }, ${ v.color[3] })`
				real_x += averageHalf - ~~(Math.random() * average)
				real_y -= averageHalf - ~~(Math.random() * average)
				this.ctx.fillRect(real_x, real_y, this.particleOPtion.particleSize, this.particleOPtion.particleSize)
			}			
		}

		if (!this.imgRelated.preloadCompleted && !this.imgRelated.preloading) {
			this.preLoad()
		}
		if (this.imgRelated.preloadCompleted) {
			draw()
		}
	}

	average () {
		this.total = 0
		for (let i = 0; i < this.len; i += 2) {
			this.total += this.buffer[i]
		}
		return this.total / this.len / 2
	}

	preLoad (src = `${ require('../../public/note.png') }`) {
		this.imgRelated.preloading = !this.imgRelated.preloading
		const _this = this
		const img = document.createElement('img')
		img.src = src
		img.onload = () => {
			this.imgRelated.preloading = !this.imgRelated.preloading
			this.imgRelated.preloadCompleted = true
			this.imgRelated.img = img

			if (img.width > this.particleOPtion.size) {
				img.height = this.particleOPtion.size * img.height / img.width
				img.width = this.particleOPtion.size
			}
			this.imgRelated.x = this.width / 2 - img.width / 2
			this.imgRelated.y = this.height / 2 - img.height / 2

			this.ctx.clearRect(0, 0, this.width, this.height)
			this.ctx.drawImage(img, this.imgRelated.x, this.imgRelated.y, img.width, img.height)

			const imgData = this.ctx.getImageData(this.imgRelated.x, this.imgRelated.y, img.width, img.height).data
			const len = imgData.length

			for (let i = 0; i < len; i += 4) {
				const tempI = i / 4
				if (imgData[i + 3] > 100 && Math.random() * 10 > this.particleOPtion.randomRange) {
					this.imgRelated.drawData.push({
						x: tempI % img.width,
						y: Math.floor(tempI / img.width),
						color: [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]]
					})
				}
			}
		}
	}
}

export default Canvas
