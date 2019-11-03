'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const {connect, disconnect} = require('../connection')

const Userschema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},

	password: {
		type: String,
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
	}, 

	tokens: {
		type: [String]
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

/**
 * Process the user registration with validation of data.
 * @params {User} user details - This includes all the user's registration data 
 * @throws {Error} - Mandatory fields are missing.
 * @returns {Object} - Returns the object which contains information about registration of user such as status, message and error.
 */

Userschema.statics.register = async function(details) {
	
	const {email, password, username, firstName} = details
	if(email === undefined || username === undefined || password === undefined || firstName === undefined) {
		throw new Error('User registeration was unsuccessfull without mandatory fields')
	}
	try{
		await connect()
		const existingUser = await User.findOne({email})
		if(existingUser !== null) throw new Error('User with this email already exist in our system')
		const newUser = new this({email, password, username, firstName})
		await newUser.save()
		await disconnect()
		return {status: true, message: 'Registered user into our system successfully.'}
	}catch(error){
		return {status: false, message: 'Error saving the user', error: error}
	}
}

/**
 * Generates the user tokens. Before genrating the tokens, It assumes that the authentication was success.
 * @throws {Error} - User details are not present in the system or empty fields are sent.
 * @returns {String} - Returns the json web token when the user login success or user register successfully.
 */

 Userschema.methods.generateJwt = function(email, tokenExpirationTime){
	if(email === undefined) throw new Error('Error generating the token');
	try{
		await connect()
		const currentUser = await User.findOne({email})
		if(currentUser === null) throw new Error('Error generating the token, User doesnot exist in out system')
		const webTokenPayload = currentUser._id
		const tokenSecret = 'covlifepass2121'
		const jwtToken = jwt.sign({webTokenPayload}, tokenSecret)
		return {token: jwtToken}
	} catch(error){
		throw new Error('Error validating the user details.')
	}
 }

const User = mongoose.model('User', Userschema)
module.exports = User
