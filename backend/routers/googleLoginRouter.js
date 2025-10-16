const express = require('express')
const Router = express.Router()
require('../config/passportGoogle')
const passport = require('passport')
const {googleLoginHandler} = require('../controllers/googleLoginController')

Router.route('/google').get(passport.authenticate('google' , {
    scope : ['email' , 'profile']
}))

Router.route('/redirect/google').get(passport.authenticate('google', {
    session : false,
    failureRedirect : '/authentication'
}), 
    googleLoginHandler
)

module.exports = Router
