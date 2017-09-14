import axios from './axios.js'
import raf from './requestAnimationFrame.js'

const { requestAnimationFrame } = raf
class Audio {
	constructor () {
		this.axios = axios
		this.AudioContext = window.AudioContext || window.webkitAudioContext
		try {
			this.audioCtx = new this.AudioContext()
		} catch (err) {
			console.error('您的浏览器不支持audio相关API')
		}
		// 控制音量
		this.gain = this.audioCtx.createGain()
		// 分析器
		this.analyser = this.audioCtx.createAnalyser()
	}


}
export default Audio