const Router = require('koa-router');
const User = require('./Model/User')
const connect = require('./connection').connect
const disconnect = require('./connection').disconnect

const router = new Router();
 

router.del('/delUser/:email', async(cnx)=> {
    const email = cnx.params.email
   
    await connect()

    const delFind = await User.findOne({email})
    if (delFind !== null){
        console.log('User has been found')
        await delFind.remove()
    }else{
        cnx.throw(400, 'Unfortunatley the user cannot be found in the system')

    }     
    await disconnect()
})


module.exports = router