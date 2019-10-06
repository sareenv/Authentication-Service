const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const {connect, disconnect} = require('../connection')
const User = require('../Model/User')
const router = new Router()

router.post('/register', bodyParser() ,async(cnx)=>{
    await connect()
    const newUser = new User(cnx.request.body)
    await newUser.save()
    await disconnect()
    cnx.body = 'Thanks for sharing the details'
})



// returns the registered user's for now
router.get('/users', async (cnx) => {
    await connect()
    const users = await User.find({})
    cnx.body = users
    await disconnect()
})

module.exports = router