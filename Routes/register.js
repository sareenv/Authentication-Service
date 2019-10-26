const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fetch = require('node-fetch');
const {connect, disconnect} = require('../connection')
const User = require('../Model/User')
const router = new Router()

/**
 * Check for the captcha details. It is a middleware for the register route
 * which ensures that the user has sucessfully solved google captcha and then trying to register
 */
const checkCaptcha = async (cnx, next) => {
    const captchaResponse = cnx.request.body.captcharesp
    if(captchaResponse === undefined){
        return cnx.throw(400, 'Captcha has not been filled properly')
    }
    const captchaSecret = '6LdPjb4UAAAAAI9UhH39CUCJsDJN95s2Cj4XiZYG'
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captchaResponse}&remoteip=${cnx.ip}`
    const validationResponse = await fetch(url)
    const jsonResponse = await validationResponse.json()
    /** Check here if it was a sucess or a pure failure. */
    if(jsonResponse["success"] === false){
        return cnx.throw(400, 'Registration cannot be processed because captcha verification failed')
    }
    next()
}



router.post('/register', bodyParser(), checkCaptcha ,async(cnx)=>{
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