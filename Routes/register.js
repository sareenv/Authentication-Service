'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const {connect, disconnect} = require('../connection')
const User = require('../Model/User')

const checkCaptcha = require('../Middlewares/recaptcha')

const router = new Router()

router.post('/register', bodyParser(), checkCaptcha ,async(cnx) => {
	try{
		await User.register(cnx.request.body)
		cnx.body = 'User has been registered in our system'
	}catch(error) {
		cnx.throw(400, error)
	}
})

router.get('/users', async(cnx) => {
	await connect()
	const users = await User.find({})
	cnx.body = users
	await disconnect()
})

module.exports = router
