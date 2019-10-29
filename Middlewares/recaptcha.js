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

module.exports = checkCaptcha