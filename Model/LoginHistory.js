'use strict'

const mongoose = require('mongoose')
const {connect, disconnect} = require('../connection')

const LoginHistorySchema = mongoose.Schema({
	userId: {
		type: mongoose.SchemaTypes.ObjectId,
	},

	browser: {
		type: String
	},

	os: {
		type: String
	},

	browserVersion: {
		type: String
	},

	AttemptDate: {
		type: Date,
		default: Date.now
	},

	deviceType: {
		type: String
	},

	Succeeded: {
		type: Boolean,
		default: false
	},

	ip: {
		type: String
	},

	timeofLogin: {
		type: Date,
		default: Date.now
	},

	LoggedOutDate: {
		type: Date
	}
})

const LoginHistory = mongoose.model('LoginHistory', LoginHistorySchema)
module.exports = LoginHistory
