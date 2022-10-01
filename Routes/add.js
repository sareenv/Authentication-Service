/// POST (create) to add an action for login 
///information retrieval through API request 

const Router = require('koa-router');
const User = require('../Model/User');
const connect = require('../connection').connect
const disconnect = require('../connection').disconnect

const router = new Router();

router.post('/addUser:email'), async(cnx)=>{
    const email = cnx.params.email
    try {
        await connect()
        const getInfo = await User.findOne({email})
        if (getInfo !== null){
            await getInfo.add()
        }else{
            cnx.throw(400, 'Unfortunatley the users login information cannot be found in the system')
        }     
        await disconnect()
    } catch(exception) {
        cnx.throw(400, 'Exception has occured')
    }

    
}

module.exports = router