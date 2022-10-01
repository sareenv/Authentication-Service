const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const bcrypt = require('bcrypt')

const {connect, disconnect} = require('../connection')
const User = require('../Model/User')
const router = new Router()
 

router.post('/login', bodyParser() ,async(cnx)=>{
    let password = cnx.request.body.password
    let email = cnx.request.body.email
    try {
        await connect()
        const ufind = await User.findOne({email})
        if (ufind === null){
            return cnx.body = "User's email is not found!"
        }
        const passValid = await bcrypt.compare(password, ufind.password)
        if (passValid === true){
            return cnx.body = "Password has been validated!"
        } else {
            return cnx.body = "Password has not been verified!"
        }
    } catch(exception) {
        return cnx.body = {exception: `Exception ${exception}`}
    }
    
})

// returns the registered user's for now
router.get('/users', async (cnx) => {
    await connect()
    const users = await User.find({})
    cnx.body = users
    await disconnect()
})

module.exports = router