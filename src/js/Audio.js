class Audio {
	constructor () {
		this.AudioContext = window.AudioContext || window.webkitAudioContext
		try {
			this.audioCtx = new this.AudioContext()
		} catch (err) {
			console.error('您的浏览器不支持audio相关API')
		}
		// 读取bufer的source
		this.source = this.audioCtx.createBufferSource()
		// 控制音量
		this.gain = this.audioCtx.createGain()
		// 分析器
		this.analyser = this.audioCtx.createAnalyser()
	}

	ctx () {
		return this.audioCtx
	}

	bufferSource () {
		return this.source
	}

	volume () {
		return this.gain
	}

	analyse () {
		return this.analyser
	}
}
export default Audio