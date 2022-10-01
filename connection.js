'use strict'

const mongoose = require('mongoose')

/** 
 * These methods returns the promise which other files are using with await syntax.
 * and should handle execptions using try catch block.
 */

const connect = async() => {
	const config = {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
	
	try {
		return mongoose.connect('mongodb://mongoDB:27017/', config)
	} catch (exception)  {
		console.log(`Exception happend with code ${exception}`)
		return undefined
	}
}

const disconnect = async() => mongoose.connection.close()

module.exports = { connect, disconnect }
