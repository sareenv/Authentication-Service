'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Speakeasy = require('speakeasy')
const mailUtility = require('../utils/mailer')
const {connect, disconnect} = require('../connection')


const Userschema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},

	password: {
		type: String,
	},

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

	twoFactorAuth: {
		type: Boolean,
		default: false
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
	}, 

	usertwoFactorSecretToken: {
		type: String, 
		default: ''
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
 *  @params {String} - user email
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
 *  checks the user token in stored tokens.
 *  @params {Int} user email
 * 	@throws {Error} - If the user is not present in the system with email
 *  @returns {Boolean} - returns true if the token is found in the system
 */

Userschema.statics.checkTokenExists = async function(token, _id){
	if(token === undefined || userId === undefined) throw new Error('Details cannot be undefined')
	try{
		await connect()
		const result = await User.findOne({_id})
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

Userschema.methods.generateJwt = async function() {
	try{
		await connect()
		const date = Date.now()
		const webTokenPayload = {id: this._id, date}
		const tokenSecret = 'bf91c77e9c8901104094c9bc56435cb1f0a451416e7ca8891a5225b3a962db55be1daf9a8fe0956b1e559c373708d72daf53d5a82f396caf55c833d871e4a67c';
		const jwtToken = await jwt.sign({webTokenPayload}, tokenSecret)
		await this.updateOne({$push: {tokens: jwtToken} })
		await disconnect()
		return {token: jwtToken}
	}catch(error){
		console.log(error.message)
		throw new Error('Error, generating the token')
	}
}

/**
 * Sends the email verification code to the user with time validation for two fact authentication.
 * @throws {Error} - User details are not present in the system or empty fields are sent.
 * @returns {String} - sends the json web token when the user is found in our system with two factor auth settings.
 */

Userschema.methods.twoFactorpasswordVerificationEmail = async function() {
	if(this.twoFactorAuth === true) {
		await connect()
		const secret1= Speakeasy.generateSecret( {length: 21} )
		await this.updateOne({$set: {usertwoFactorSecretToken: secret1.base32}})
		await disconnect()
		this.updateOne({})
		const token = Speakeasy.totp({
			secret: secret1.base32,
			encoding: 'base32'
		});
		const message = `The Two factor authentication password for your account is ${token}`
		const twoFactorEmail = await mailUtility(this.email, message)
		return twoFactorEmail
	}
	return false
}


/**
 * Logout the client from multiple devices.
 * @throws {Error} - User details are not present in the system or empty fields are sent.
 * @returns {Boolean} - user was logout then it will return true otherwise will return false
 */


Userschema.statics.logoutAllAccounts = async function(userId) {
	try{
		await connect()
		const currentUser = await User.findById(userId)
		await currentUser.updateOne({$set: {tokens: []}})
		await disconnect()
		return true
	}catch(error) {
		throw new Error(error.message)
	}
}



Userschema.methods.verifyTwoAuthentication = async function(token) {
	const twoFactorVerificationSecret = this.usertwoFactorSecretToken
	const verification = Speakeasy.totp.verify({
		secret: twoFactorVerificationSecret,
		encoding: 'base32',
		token: token,
		window: 2
	})
	return verification
}

const User = mongoose.model('User', Userschema)
module.exports = User
