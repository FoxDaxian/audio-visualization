import base from './Audio_base.js'
import Canvas from './Canvas.js'

class Buffer extends base {
	constructor () {
		super()
		// 读取bufer的source
		this.source = this.audioCtx.createBufferSource()
	}

	execute (options) {
		const { type = 'default', fft = 2048 } = options
		try {
		    this.axios({
		        method: 'get',
		        url: 'http://oqvlh6ipq.bkt.clouddn.com/demo.mp3'
		    }).then((res) => {
		        const audioData = res.data
		        // 解码音频，分析音频
		        this.audioCtx.decodeAudioData(audioData,
		            (buffer) => {
		                // 设置音频数据
		                this.source.buffer = buffer
		                // 连接分析器
		                this.source.connect(this.analyser)
		                this.analyser.connect(this.gain)
		                // 连接到设备的, 类似于pipe
		                // 扬声器
		                this.gain.connect(this.audioCtx.destination)
		                this.analyser.fftSize = fft
		                this.gain.gain.value = 1


		                this.source.loop = true
		                const arr = new Uint8Array(this.analyser.frequencyBinCount);

		                const canvas = new Canvas(arr)

		                const fn = () => {
		                    this.analyser.getByteFrequencyData(arr)
		                    canvas[type]()
		                    requestAnimationFrame(fn)
		                }

		                requestAnimationFrame(fn)

		                this.source.start(0)


		            },
		            (e) => {
		                console.log("Error with decoding audio data" + e.err)
		            }
		        )
		    })
		} catch (err) {
		    console.log(err)
		}
	}
}

export default Buffer
