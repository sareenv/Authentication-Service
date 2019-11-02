const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const connect = require('../connection').connect
const disconnect = require('../connection').disconnect

const User = require('../Model/User')
const router = new Router()

router.get('/getHistory/:email', async(cnx)=>{
    console.log('Login History getting accessed')
    const email = cnx.params.email
    await connect()
    const users = await User.findOne({email})
    console.log('Login History for one user is getting accessed')
    cnx.body = users
    await disconnect()
})

router.get('/getAllHistory/:email', async(cnx)=>{
    console.log('Login History getting accessed')
    const email = cnx.params.email
    await connect()
    const users = await User.find({})
    console.log('Array of Login History for all users is getting accessed')
    cnx.body = users
    await disconnect()
})


module.exports = router