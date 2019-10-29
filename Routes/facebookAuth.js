const Router = require('koa-router')
const passport = require('koa-passport')
const FacebookStrategy = require('passport-facebook').Strategy
const router = new Router();
const User = require('../Model/User')
/**
 * https://www.npmjs.com/package/generate-password
 */
const generator = require('generate-password');
const facebookConfig = {
    clientID: '1178892432307006',
	clientSecret: 'df0faa7791b2f07ac72f730d7afb9225', 
	callbackURL: 'http://localhost:222/auth/facebook/callback', // need to replace this with react url
    profileFields: ['email', 'id', 'displayName', 'photos', 'birthday', 'name'], 
}

passport.use(new FacebookStrategy(facebookConfig, (accessToken, refreshToken, profile, done)=>{
	done(null, profile)
}))	

router.get('/success', cnx => {
    cnx.body = 'The login was sucess'
})

router.get('/failure', cnx => {
    cnx.body = 'The login was failure'
})

router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email'], session: false}))

router.get('/auth/facebook/callback', passport.authenticate('facebook',  (error, user) =>{
    if(error){
        return console.log(error)
    }
    /**
     * Save the information to the database and generate a auth token.
     */
    // console.log(user)
    const {name} = user // this contains firstName and lastName of the use.
    const {emails} = user // this contains multiple email addresses.
    const {photos} = user // this contains the profile image url
    /**
     * Value that we require from facebook to be used.
     */
    const profileImageUrl = photos[0].value
    const firstName = name.givenName
    const lastName  = name.familyName
    const email = emails[0].value // this email should not exist in our system before.

    
    const randomPassword = generator.generate({
        length: 10,
        numbers: true
    });
    /** Now try saving the user in our system and send the user his radomly generate password
     * so, user can change it if they requires which will support basic auth also
    */
    const newUser = new User({
        username: 'firstName',
        email: email, 
        profileImageUrl: profileImageUrl, 
        password: randomPassword, 
        firstName: firstName,
        lastName: lastName
    })

    newUser.save().then((data)=>{
        return console.log(data)
    })
}))



module.exports = router 

