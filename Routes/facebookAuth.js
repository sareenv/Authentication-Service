const Router = require('koa-router')
const passport = require('koa-passport')
const FacebookStrategy = require('passport-facebook').Strategy
const router = new Router();
const User = require('../Model/User')
const {connect, disconnect} = require('../connection')
/**
 * https://www.npmjs.com/package/generate-password
 */

const facebookConfig = {
    clientID: '1178892432307006',
	clientSecret: 'df0faa7791b2f07ac72f730d7afb9225', 
	callbackURL: 'http://localhost:5050/auth/facebook/callback', // need to replace this with react url
    profileFields: ['email', 'id', 'displayName', 'photos', 'birthday', 'name'], 
}

passport.use(new FacebookStrategy(facebookConfig, (accessToken, refreshToken, profile, done)=>{
    done(null, profile)	
}))

router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email'], session: false}))
router.get('/auth/facebook/callback', passport.authenticate('facebook', async (error, user) => {
    
    if(error){
        return console.log(`Some error ${error}`)
    }

    const {photos, name, emails} = user  
    const profileImageUrl = photos[0].value
    const firstName = name.givenName
    const lastName  = name.familyName
    const email = emails[0].value 

    const newUser = new User({
        username: firstName,
        email: email, 
        password: '123123',
        profileImageUrl: profileImageUrl,
        firstName: firstName,
        lastName: lastName
    })
    
    await connect()
    const result = await newUser.save()
    console.log(`The saved result is ${result}`)
    return await disconnect()
}))

module.exports = router 

