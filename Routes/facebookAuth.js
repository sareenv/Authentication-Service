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
    
    /**
     * Handle the auth part here and if the user is not saved in db save it here.
     */
 
    const {photos} = profile 
    const {name} = profile 
    const {emails} = profile 

    const profileImageUrl = photos[0].value
    const firstName = name.givenName
    const lastName  = name.familyName
    const email = emails[0].value 


    User.findOne({email: email}).then((data)=>{
        if(data === null){
            const randomPassword = generator.generate({length: 10, numbers: true});
            const newUser = new User({
                username: firstName,
                email: email, 
                profileImageUrl: profileImageUrl, 
                password: randomPassword, 
                firstName: firstName,
                lastName: lastName
            })
            console.log(`The new user is ${newUser}`)
            newUser.save().then((data) => {
                done(null, profile)
            }).catch(error => {
                console.log('Error saving the details to our system')
                done(error)
            })
        }
        done(null, profile)
    }).catch(error => {
        console.log('Error authenticating the credentials with our system.')
        done(error)
    })
}))	


router.get('/success', async(cnx)=>{
    cnx.body = 'Thanks, you are now on main page'
})

router.get('/failure', async(cnx)=>{
    console.log('failure')
    cnx.body = 'Sorry this auth was a failure'
})

router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email'], session: false}))

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/success',
    failureRedirect: '/failure', 
    session: false
}))

module.exports = router 

