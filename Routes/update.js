const Router = require('koa-router');
const User = require('../Model/User');
const bcrypt = require('bcrypt');
const connect = require('../connection').connect
const disconnect = require('../connection').disconnect


const router = new Router();

router.put('/updateUser/:email/:password', async(cnx)=>{
    console.log('pass is coming')
    let password = cnx.params.password
    const email = cnx.params.email
    await connect()

    const getPass = await User.findOne({email})
    if (getPass !== null){
        console.log('User can update the password!')
        password = await bcrypt.hash(password, 10)
        const newPass = await getPass.update({password})
        await disconnect()
        cnx.body = 'User information has been updated'
    }else{
        cnx.throw(400, 'Unfortunatley the user is unable to update password as it cannot be found in the system')
    }     
    
})



module.exports = router