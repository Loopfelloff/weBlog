const User = require("../models/userMode.js")  
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const loginHandler = async (req, res , next)=>{
    const session = await mongoose.startSession()
    try {
	session.startTransaction()	
    
	req.session = session

	if(!req.body?.email) return res.status(400).json({"err" : "missing email"})
	if(!req.body?.password)return res.status(400).json({"err" : "missing password"})

	const {email , password } = req.body

	// remember to change the nvim config to accomodate for the given thing
	
	const foundUser = await User.findOne({email}).session(session).exec()

	if(!foundUser) return res.status(404).json({err : "the user was not found"})

	const match = bcrypt.compare(password , foundUser.password)

	if(!match) return res.status(400).json({"err" : "the password not entered properly"})

	const accessToken = jwt.sign(
	    {
		username : foundUser.username,
		password : foundUser.password
	    },

	    process.env.ACCESS_TOKEN_SECRET,

	    {expiresIn : "30d"}
	    
	)

	const refreshToken = jwt.sign(
	    {username : foundUser.username , password : foundUser.password},

	    process.env.REFRESH_TOKEN_SECRET,

	    {expiresIn : "30m" }

	)

	res.cookie("refreshToken" , refreshToken , {
	    httpOnly : true,
	    maxAge : 30*24*60*60*1000
	})
	res.cookie("accessToken" , accessToken , {
	    httpOnly : true,
	    maxAge : 30*24*60*60*1000
	})
    
	foundUser.refreshToken = refreshToken

	const result = await foundUser.save(session)

	res.status(200).json({"msg" : "successfully verified" , result})

	await session.commitTransaction()

	

    } catch (error) {
	return next(error)
    }
    
    await session.endSession()
}

module.exports = {loginHandler}
