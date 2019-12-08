'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const passport = require('koa-passport')
const https = require('https')
const fs = require('fs')

const register = require('./Routes/register')
const facebookAuthRouter = require('./Routes/facebookAuth')
const tokensRouters = require('./Routes/tokens')
const securityRouter = require('./Routes/security')

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
app.use(securityRouter.routes())

const credentials = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'covsecret'
}
/*
  Below command will read the ssl self-signed certificate which was generated using 
  openssl for free to make secured api. However, actual certicates are paid cannot be 
  deployed on Heroku for free so, app.listen needs to be enabled insted of https.createServer.  
*/
//https.createServer(credentials, app.callback()).listen(port)

app.listen(port)
