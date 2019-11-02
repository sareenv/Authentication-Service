'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const passport = require('koa-passport')

const register = require('./Routes/register')
const facebookAuthRouter = require('./Routes/facebookAuth')
const LoginHistory = require('./Model/LoginHistory')

const app = new Koa()
const router = new Router()

const port = process.env.PORT || 5050

router.get('/', async(ctx) => {
	ctx.body = 'Welcome to the koa-server'
})

router.get('/loginHistory', async(ctx)=>{
	const loginHistory = new LoginHistory()
	const historyResults = await loginHistory.getLoginHistory()
	ctx.body = historyResults
})


app.use(cors())
app.use(passport.initialize())

app.use(facebookAuthRouter.routes())
app.use(register.routes())
app.use(router.routes())
app.listen(port, () => console.log(`The server is listening on port ${port}`))
