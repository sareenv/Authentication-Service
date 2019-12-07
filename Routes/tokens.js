'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const User = require('../Model/User')

const router = new Router()

router.post('/generateToken', bodyParser(), async ctx => {
	try{
		const {email} = ctx.request.body
		if(email === undefined) throw new Error('missing email')
		const user = await User.findByEmail(email)
		if(user === undefined) throw new Error('system cannot find any user with this email')
		const token = await user.generateJwt()
		ctx.body = token
	} catch(error) {
		ctx.throw(404, error.message)
	}	
})
/** This I need to do. */
router.post('/signoutAllDevices', bodyParser(), async ctx => {
	try{
		const {email} = ctx.request.body
		if(email === undefined) throw new Error('missing email')
		const user = await User.findByEmail(email)
		if(user === undefined) throw new Error('system cannot find any user with this email')
		const token = await user.generateJwt()
		ctx.body = token
	} catch(error) {
		ctx.throw(404, error.message)
	}	
})

module.exports = router
