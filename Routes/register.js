'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const User = require('../Model/User')
const checkCaptcha = require('../Middlewares/recaptcha')

const router = new Router()

router.post('/register', bodyParser(), checkCaptcha ,async(cnx) => {
	try{
		const registerationResult = await User.register(cnx.request.body)
		cnx.response.status = (registerationResult.status === true) ? 201 : 400
		const result = (registerationResult === true) ? registerationResult.message : `${registerationResult.message + registerationResult.error}`
		cnx.body = {registeration: result}
	}catch(error){
		cnx.throw(400, error.message)
	}
})

router.get('/registeredUsers', bodyParser() ,async(cnx) => {
	try{
		const users = await User.find({})
		cnx.body = {registeredUsers: users}
	}catch(error){
		cnx.throw(400, error.message)
	}
})




module.exports = router
