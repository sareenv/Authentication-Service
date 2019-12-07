'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const User = require('../Model/User')

const router = new Router()

router.post('/twoFactorAuth', bodyParser(), async ctx => {
	try{
		const {email} = ctx.request.body
		if(email === undefined) throw new Error('missing email')
		const user = await User.findByEmail(email)
		const twoFactor = await user.twoFactorpasswordVerificationEmail()
		ctx.body = twoFactor
	} catch(error) {
		console.log(error.message)
		ctx.throw(404, error.message)
	}	
})

module.exports = router
