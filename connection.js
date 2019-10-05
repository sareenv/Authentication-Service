/*
    Connection to Mongodb that we have hosted online on MLabs.
    Author: Vinayak Sareen.
    Libraries Used: Mongoose.
*/

const mongoose = require('mongoose');

const connect = async () => {
 
    const config = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    const dbUrl = 'mongodb://304cem:304cem123123@ds329668.mlab.com:29668/kv304cem'
 
    try{
        await mongoose.connect(dbUrl, config)
    }catch(error){
        return new Error(`Error Connecting to the databse.`)
    }

}

const disconnect = async () => { 
    await mongoose.connection.close()
}

module.exports = { connect, disconnect }