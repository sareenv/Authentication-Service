'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')


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

module.exports = router
