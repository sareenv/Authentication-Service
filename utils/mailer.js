'use strict'

const nodemailer = require('nodemailer')
const validator = require('validator')
require('dotenv').config('../')

const sendEmail = async (email, content, subject="KV Backend Notification") => {
    if(email === undefined || email.length <= 0) throw new Error('email cannot be empty')
    const validEmail = validator.isEmail(email)
    if(validEmail === false) throw new Error('Invalid email')
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.password
        }
    })

    const mailOptions = {
        from: process.env.email,
        to: email,
        subject: subject,
    html: `<h2> Authentication System</h2> <p> ${content}  </p>`
    };

    try{
        await transporter.sendMail(mailOptions)
        return true
    }catch (error) {
        return false
    }
    
}

module.exports = sendEmail
