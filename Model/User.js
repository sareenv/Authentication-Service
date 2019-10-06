const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Userschema = mongoose.Schema({
	username: {
		type: String,
		required: true
    }, 
    
	password: {
		type: String,
		required: true
    }, 
    
	email: {
		type: String,
		required: true
	}
})

/* 
	Middleware: Before saving the data. 
	Hash the data before saving to the database. 
	Ref: https://mongoosejs.com/docs/middleware.html#pre
*/


Userschema.pre('save', async function(){
	// hash the password using bcrypt.
	const unencryptedPassword = this.password
	const encryptedPassword = await bcrypt.hash(unencryptedPassword, 10)
	this.password = encryptedPassword
})

const User = mongoose.model('User', Userschema);

module.exports = User
