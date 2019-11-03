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
	const dbUrl = 'mongodb://304cem:304cem123123@ds329668.mlab.com:29668/kv304cem'
	return mongoose.connect(dbUrl, config)
}

const disconnect = async() => mongoose.connection.close()

module.exports = { connect, disconnect }
