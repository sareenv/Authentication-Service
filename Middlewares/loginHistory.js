/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-vars */
'use strict'

const LoginHistory = require('../Model/LoginHistory')

const {connect, disconnect} = require('../connection')

const loginHistory = async function(cnx, next) {
	const ip = cnx.ip
	const browser = cnx.userAgent.browser
	const browserVersion = cnx.userAgent.version
	const os = cnx.userAgent.os
	let deviceType = ''
	if(cnx.userAgent.isMobile === true) {
		deviceType = 'Mobile'
	}else if (cnx.userAgent.isTablet === true) {
		deviceType = 'Tablet'
	}else if (cnx.userAgent.isDesktop === true) {
		deviceType = 'Desktop'
	}else{
		deviceType = 'Unknown'
	}
	try{
		await connect()
		const newLoginHistoryRecord = new LoginHistory({browser, browserVersion, os, ip, deviceType})
		await newLoginHistoryRecord.save()
		await disconnect()
		return next()
	}catch(error) {
		cnx.throw(400, 'Error processing the user information')
	}
}

module.exports = loginHistory
