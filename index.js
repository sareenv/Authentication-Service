const Koa = require('koa')
const Router = require('koa-router')
<<<<<<< HEAD
const cors = require('@koa/cors')
=======
const passport = require('koa-passport')
>>>>>>> feature/facebookAuth


const facebookAuthRouter = require('./Routes/facebookAuth')
const registerRoute = require('./Routes/register')
const app = new Koa()
const router = new Router()
<<<<<<< HEAD
const register = require('./Routes/register')

const port = process.env.PORT || 5050
=======
const port = process.env.port || 222
>>>>>>> feature/facebookAuth


router.get('/', async(ctx)=>{
    ctx.body = 'Welcome to the koa-server'
})

<<<<<<< HEAD
// this is just for testing the user's actual ip and host details.


router.get('/client_info', async(ctx)=>{
    const ip = ctx.ip;
    const host = ctx.host = ctx.host
    ctx.body = {ip, host}
})


app.use(cors())
app.use(register.routes())
=======
app.use(passport.initialize())
app.use(registerRoute.routes())
app.use(facebookAuthRouter.routes())
>>>>>>> feature/facebookAuth
app.use(router.routes())
app.listen(port, () => console.log(`The server is listening on port ${port}`))