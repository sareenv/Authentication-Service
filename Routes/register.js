'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const {connect, disconnect} = require('../connection')
const User = require('../Model/User')

const checkCaptcha = require('../Middlewares/recaptcha')

const router = new Router()
router.post('/register', bodyParser() ,async(cnx) => {
	try{
		const registerationResult = await User.register(cnx.request.body)
		cnx.response.status = (registerationResult.status === true) ? 201 : 400
		cnx.body = (registerationResult === true) ? registerationResult.message : `${registerationResult.message + registerationResult.error}`
	}catch(error){
		cnx.throw(400, error.message)
	}
})

router.get('/users', async(cnx) => {
	await connect()
	const users = await User.find({})
	cnx.body = users
	await disconnect()
})

module.exports = router
