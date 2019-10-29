const Koa = require('koa')
const Router = require('koa-router')
const passport = require('koa-passport')
const session = require('koa-session')

const facebookAuthRouter = require('./Routes/facebookAuth')
const app = new Koa()
const router = new Router()
const port = process.env.port || 222


router.get('/', async(ctx)=>{
    ctx.body = 'Welcome to the koa-server'
})




app.use(passport.initialize())
// app.use(passport.session())

app.use(facebookAuthRouter.routes())
app.use(router.routes())
app.listen(port, () => console.log(`The server is listening on port ${port}`))