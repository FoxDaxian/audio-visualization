import raf from './js/requestAnimationFrame.js'
import Audio from './js/Audio.js'
import axios from 'axios'

const instance = axios.create({
    responseType: 'arraybuffer'
})

const { requestAnimationFrame } = raf
const audio = new Audio()

const ctx = audio.ctx()
const bufferSource = audio.bufferSource()
const volume = audio.volume()
const analyse = audio.analyse()

try {
    instance({
        method: 'get',
        url: 'http://oqvlh6ipq.bkt.clouddn.com/demo.mp3'
    }).then((res) => {
        const audioData = res.data
        // 解码音频，分析音频
        ctx.decodeAudioData(audioData,
            (buffer) => {
                // 设置音频数据
                bufferSource.buffer = buffer
                // 连接分析器
                bufferSource.connect(analyse)
                analyse.connect(volume)
                // 连接到设备的, 类似于pipe
                // 扬声器
                volume.connect(ctx.destination)
                analyse.fftSize = 256
                volume.gain.value = 1


                bufferSource.loop = true
                const arr = new Uint8Array(analyse.frequencyBinCount);

                const boxs = document.createElement('div');
                boxs.classList.add('boxs')
                for (let i = 0, len = analyse.frequencyBinCount; i < len; i++) {
                    const box = document.createElement('div')
                    box.classList.add('box')
                    box.style.left = 7 * i + 'px'
                    boxs.appendChild(box)
                }
                document.body.appendChild(boxs)
                const childs = boxs.children

                const fn = () => {
                    analyse.getByteFrequencyData(arr)
                    for (var i = 0, len = analyse.frequencyBinCount; i < len; i++) {
                        childs[i].style.height = arr[i] * 2 + 'px'
                    }
                    requestAnimationFrame(fn)
                }

                requestAnimationFrame(fn)
                bufferSource.start(0)


            },
            (e) => {
                console.log("Error with decoding audio data" + e.err)
            }
        )
    })
} catch (err) {
    console.log(err)
}