import axios from 'axios'

const instance = axios.create({
    responseType: 'arraybuffer'
})

export default instance
