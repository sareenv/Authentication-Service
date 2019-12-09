'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const User = require('../Model/User')

router.put('/updateDetails/:id', async cnx => {
    try {
        const {email, firstName, lastName, email, about} = cnx.request.query
        const currentUser = await User.findById(id)
        // call the function here.
        cnx.body = {message: 'Changed user detials'}
    } catch(error) {
        cnx.throw(400, error.message)
    }
})


router.put('/resetPassword/:id', async cnx => {
    try {
        const {newpassword, securityanswer1, securityanswer2} = cnx.request.query
        const currentUser = await User.findById(id)
        // call the function here
        cnx.body = {message: 'Changed user detials'}
    } catch(error) {
        cnx.throw(400, error.message)
    }
})


module.exports = router
