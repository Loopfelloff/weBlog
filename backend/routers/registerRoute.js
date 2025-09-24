const express = require("express")
const Router = express.Router()
const registerUser = require("../controllers/registerController")

Router.route("/").post(registerUser)

module.exports = Router
