/* eslint-disable max-len */
'use strict'

const fetch = require('node-fetch')

const checkCaptcha = async(cnx, next) => {
	const captchaResponse = cnx.request.body.captcharesp
	if(captchaResponse === undefined) {
		return cnx.throw(400, 'Captcha has not been filled properly')
	}
	const captchaSecret = '6LdPjb4UAAAAAI9UhH39CUCJsDJN95s2Cj4XiZYG'
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captchaResponse}&remoteip=${cnx.ip}`
	const validationResponse = await fetch(url)
	const jsonResponse = await validationResponse.json()
	/** Check here if it was a sucess or a pure failure. */
	if(jsonResponse['success'] === false) {
		return cnx.throw(400, 'Registration cannot be processed because captcha verification failed')
	}
	next()
}

module.exports = checkCaptcha
