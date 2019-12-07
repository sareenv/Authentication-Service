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
		cnx.body = (registerationResult === true) ? registerationResult.message : `${registerationResult.message + registerationResult.error}`
	}catch(error){
		cnx.throw(400, error.message)
	}
})

router.post('/generateToken', bodyParser(), async(cnx) => {
	try{
		const {email} = cnx.request.body
		if(email === undefined) throw new Error('missing email')
		const user = await User.findByEmail(email) 
		if(user === undefined) throw new Error('system cannot find any user with this email')
		const token = await user.generateJwt()
		cnx.body = 'Token is generated and saved into our systems'
	} catch(error) {
		cnx.throw(404, error.message)
	}	
})


module.exports = router
