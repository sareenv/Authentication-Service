const jwt = require('jsonwebtoken');
/**
 * This middleware will verify the tokens, sent by the users.
 * @params {context, next} - This takes the contenxt object and next to call the next middleware.
 * @returns {String} - token
 */

const verifyToken = async function(cnx, next){
    const authorizationheader = cnx.headers['authorization']
    if (authorizationheader === undefined) cnx.throw(401, 'Authorisation Header missing') 
    const token = authorizationheader.replace('Bearer ', '')
    const secret = 'bf91c77e9c8901104094c9bc56435cb1f0a451416e7ca8891a5225b3a962db55be1daf9a8fe0956b1e559c373708d72daf53d5a82f396caf55c833d871e4a67c'
    try{
      const tokenVerification = await jwt.verify(token, secret)
      if(tokenVerification !== undefined || tokenVerification !== null) cnx.state.user = tokenVerification.webTokenPayload
      return next()
    }catch(error){
      console.log(error)
      cnx.throw(401, 'The token verification is unsucessfull')
    }
}

module.exports = verifyToken