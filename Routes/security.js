'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const User = require('../Model/User')
const twoFactorAuth = require('../Middlewares/securityTwoFactor')
const twoFactorMiddleware = require('../Middlewares/securityTwoFactor')

const router = new Router()

router.get('/requestTwoFactorAuth', twoFactorMiddleware, ctx => {
	ctx.body = {message: 'Email has been sent to the client'}
})


router.post('/verifyTwoFactorAuth', twoFactorMiddleware ,(ctx)=> {
	ctx.body = {message: 'Client is now verified'}
})

router.post('/signoutAllDevices', bodyParser(), twoFactorAuth ,async ctx => {
	ctx.body = "Thanks for sharing everything"
})

module.exports = router
