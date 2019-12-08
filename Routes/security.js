'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const User = require('../Model/User')
const {connect, disconnect} = require('../connection')

const twoFactorAuth = require('../Middlewares/securityTwoFactor')
const verifyToken = require('../Middlewares/verifyjwt')

const router = new Router()

router.get('/requestTwoFactorAuth', twoFactorAuth, ctx => {
	ctx.body = {message: 'Email has been sent to the client'}
})


router.post('/verifyTwoFactorAuth', bodyParser(), async cnx => {
    const {email, token} =  cnx.request.body
    const user = await User.findByEmail(email)
	const result = await user.verifyTwoAuthentication(token)
	cnx.body = {result}
})

router.post('/signoutAllDevices', bodyParser(), verifyToken, async ctx => {
	try{
		const userId = ctx.request.userId
		const result = await User.logoutAllAccounts(userId)
		console.log(result)
		ctx.body = {message: 'Logged out your from all devices'}
	} catch(error) {
		console.log(error.message)
		ctx.throw(400, 'Error while logout user')
	}
	
})

module.exports = router
