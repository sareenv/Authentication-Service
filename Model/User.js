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
 *  Find the user by it's email.
 *  @params {Int} user email
 * 	@throws {Error} - If the user is not present in the system with email
 *  @returns {Object} - returns the object with the user details
 */

Userschema.statics.findByEmail = async function(email){
	if(email === undefined) throw new Error('Email cannot be undefined')
	try{
		await connect()
		const result = await User.findOne({email})
		if(result == null) throw new Error('Cannot find user with this details in our system') 
		await disconnect()
		return result
	}catch(error){
		throw new Error(`Error performing this operation`)
	} 
}




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

 Userschema.methods.generateJwt = async function(){
	try{
		const webTokenPayload = this._id
		const tokenSecret = 'bf91c77e9c8901104094c9bc56435cb1f0a451416e7ca8891a5225b3a962db55be1daf9a8fe0956b1e559c373708d72daf53d5a82f396caf55c833d871e4a67c';
		const jwtToken = await jwt.sign({webTokenPayload}, tokenSecret)
		return {token: jwtToken}
	}catch(error){
		throw new Error('Error, generating the token')
	}
 }

const User = mongoose.model('User', Userschema)
module.exports = User
