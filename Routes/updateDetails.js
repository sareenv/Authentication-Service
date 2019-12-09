'use strict'

const Router = require('koa-router')
const {connect, disconnect} = require('../connection')
const verifyJwt = require('../Middlewares/verifyjwt')
const User = require('../Model/User')


const router = new Router()

router.put('/updateDetails', verifyJwt, async cnx => {
    try {
        await connect()
        const {email, firstName, lastName, about} = cnx.request.query
        const id = cnx.request.userId
        const currentUser = await User.findById(id)
        const updateResult = await currentUser.updateDetails(id, firstName, lastName, email, about)
        await disconnect()
        cnx.body = {updateResult}
    } catch(error) {
        cnx.throw(400, error.message)
    }
})


router.put('/resetPassword/:email', async cnx => {
    try {
        await connect()
        const {newpassword, securityanswer1, securityanswer2} = cnx.request.query
        const email = cnx.params.email
        const currentUser = await User.findByEmail(email)
        const resultResult = await currentUser.resetPassword(securityanswer1, securityanswer2, newpassword)
        await disconnect()
        cnx.body = {passwordChangedStatus: resultResult}
    } catch(error) {
        cnx.throw(400, error.message)
    }
})


module.exports = router
