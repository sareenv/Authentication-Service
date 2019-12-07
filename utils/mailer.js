'use strict'

const nodemailer = require('nodemailer')
const validator = require('validator')

const sendEmail = async (email, content, subject="KV Backend Notification") => {
    if(email === undefined || email.length <= 0) throw new Error('email cannot be empty')
    const validEmail = validator.isEmail(email)
    if(validEmail === false) throw new Error('Invalid email')
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'buggyman026@gmail.com', // needs to be replaced 
            pass: 'Kinuorange@123'
        }
    })

    const mailOptions = {
        from: 'buggyman026@gmail.com',
        to: email,
        subject: subject,
    html: `<h2> KVAuth System</h2> <p> ${content}  </p>`
    };

    try{
        const mailSent  = await transporter.sendMail(mailOptions)
        return true
    }catch (error) {
        return false
    }
    
}

module.exports = sendEmail