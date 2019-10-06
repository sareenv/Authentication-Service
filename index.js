const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const register = require('./Routes/register')

const port = process.env.port || 8080


router.get('/', async(ctx)=>{
    ctx.body = 'Welcome to the koa-server'
})

app.use(register.routes())
app.use(router.routes())
app.listen(port, () => console.log(`The server is listening on port ${port}`))