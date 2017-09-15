const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.resolve(__dirname, './dist/')))

app.listen(2017, (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log('监听在2017端口')
})