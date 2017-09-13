const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen(2017, () => {
	console.log('监听中')
})