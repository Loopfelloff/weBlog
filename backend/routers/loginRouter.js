const express = require('express')
const Router = express.Router()

const {loginHandler} = require('../controllers/loginController')

Router.route('/').post(loginHandler)

module.exports = Router
