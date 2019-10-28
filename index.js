const Koa = require('koa')
const Router = require('koa-router')

const loginRouter = require('./login')
const deleteRouter = require('./delete')

const app = new Koa() // this is ur server api
const router = new Router()
const port = process.env.port || 8080


router.get('/', async(ctx)=>{
    ctx.body = 'Welcome to the koa-server'
})

app.use(router.routes())
app.use(loginRouter.routes())
app.use(deleteRouter.routes())

app.listen(port, () => console.log(`The server is listening on port ${port}`))