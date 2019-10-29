
const Router = require('koa-router')
const passport = require('koa-passport')
const router = new Router();
const FacebookStrategy = require('passport-facebook').Strategy

const facebookConfig = {
    clientID: '1178892432307006',
	clientSecret: 'df0faa7791b2f07ac72f730d7afb9225', 
	callbackURL: 'http://localhost:222/auth/facebook/callback', // need to replace this with react url
    profileFields: ['email', 'id', 'displayName', 'photos', 'gender', 'name'], 
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

router.get('/auth/facebook/callback', passport.authenticate('facebook', (error, user) =>{
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
     * Value that we require.
     */
    const profileImageUrl = photos[0].value
    const firstName = name.givenName
    const lastName  = name.familyName
    console.log(firstName + lastName)
}))



module.exports = router 

