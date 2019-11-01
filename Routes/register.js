const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fetch = require('node-fetch');
const {connect, disconnect} = require('../connection')
const User = require('../Model/User')
// middleware.
const checkCaptcha = require('../Middlewares/recaptcha')

const router = new Router()
router.post('/register', bodyParser() ,checkCaptcha, async(cnx)=>{
    try{
        await connect()
        /** Additional check to ensure the mandatory fields are present */
        const {username, password, email} = cnx.request.body;
        if(email === undefined || username === undefined || password === undefined){
            return cnx.throw(400, 'error insufficient details')
        }
        const newUser = new User(cnx.request.body)
        await newUser.save()
        await disconnect()
        cnx.body = 'Thanks for sharing the details'
    }catch(error){
        cnx.throw(400, `${error}`)
    }
})

router.get('/users', async (cnx) => {
    await connect()
    const users = await User.find({})
    cnx.body = users
    await disconnect()
})

module.exports = router