'use strict'

const nodemailer = require('node-mailer')

/**
 * This middleware will send the verification email to the user using nodemailer.
 * @params {context, next} - This takes the contenxt object and next to call the next middleware.
 * @redirects - Redirects the client to email verification.
 */

async function checkTwoFactorMiddleWare(ctx, next) {
    if(ctx.request.body.twoFactorAuth === false) {
        return next()
    }
    const email = 'sareenv@uni.coventry.ac.uk'
    ctx.redirect(`/loginVerify?email=${email}`)
}
