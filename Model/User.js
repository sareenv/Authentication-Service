'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const {connect, disconnect} = require('../connection')

const Userschema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	// Salt value before saving to the database.
	passwordSalt: {
		type: String
	},

	firstName: {
		type: String,
	},

	lastName: {
		type: String
	},

	profileImageUrl: {
		type: String
	},

	email: {
		type: String,
		required: true,
		validate: validator.isEmail
	},

	about: {
		type: String
	},

	countryId: {
		type: String
	},

	birthDate: {
		type: Date,

	},

	dateRegistered: {
		type: Date,
	},

	Active: {
		type: Boolean,
		default: true
	},

	deleted: {
		type: Boolean,
		default: false
	}
})

/*
	Middleware: Before saving the data.
	Hash the data before saving to the database.
	Ref: https://mongoosejs.com/docs/middleware.html#pre
*/

Userschema.pre('save', async function() {
	const unencryptedPassword = this.password
	const saltRound = 10
	const encryptedPassword = await bcrypt.hash(unencryptedPassword, saltRound)
	this.password = encryptedPassword
	this.dateRegistered = Date.now()
})

Userschema.statics.register = async function(details) {
	const {email, password, username, firstName} = details
	if(email === undefined || username === undefined || password === undefined || firstName === undefined) {
		throw new Error('User registeration was unsuccessfull without mandatory fields')
	}
	await connect()
	const newUser = new this({email, password, username, firstName})
	await newUser.save()
	await disconnect()
}


const User = mongoose.model('User', Userschema)
module.exports = User
