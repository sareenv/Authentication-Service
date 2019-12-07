'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const passport = require('koa-passport')

const register = require('./Routes/register')
const facebookAuthRouter = require('./Routes/facebookAuth')
const tokensRouters = require('./Routes/tokens')


const loginRouter = require('./Routes/login')
const deleteRouter = require('./Routes/delete')
const updateRouter = require('./Routes/update')


const app = new Koa() 
const router = new Router()

const port = process.env.PORT || 5050

router.get('/', async(ctx)=>{
    ctx.body = 'Welcome to the koa-server'
})

app.use(cors())
app.use(passport.initialize())

app.use(facebookAuthRouter.routes())
app.use(register.routes())
app.use(router.routes())
app.use(loginRouter.routes())
app.use(deleteRouter.routes())
app.use(updateRouter.routes())
app.use(tokensRouters.routes())

app.listen(port, () => console.log(`The server is listening on port ${port}`))
