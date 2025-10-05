const Router = require('express').Router()
const {signupHandler} = require('../controllers/signupController.js')

Router.route('/').post(signupHandler)

module.exports = Router
