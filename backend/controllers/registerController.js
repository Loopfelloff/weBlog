const User = require("../models/userMode.js")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const handleNewUser = async(req , res)=>{
    const session = await mongoose.startSession() 
    try {

	await session.startTransaction()
	if(!req.body.userName || req.body.userName.trim() === "") return res.status(400).json({err : "missing Username"})
	if(!req.body.email) return res.status(400).json({err : "missing email"})
	if(!req.body.password) return res.status(400).json({err : "missing password"})
	if(!req.body.password) return res.status(400).json({err : "missing password"})

	const {email , password , userName} = req.body

	const foundUser = await User.findOne({email}).session(session).exec()

	if(foundUser){
	    await session.abortTransaction()
	    return req.status(409).json({err : "this email is already registered"})
	} 

	const encryptedUserPassword = await bcrypt.hash(password, 10)
	const result = await User.create({
	    email,
	    password : encryptedUserPassword,
	    username : userName
	})

	await session.commitTransaction()

	return res.status(200).json({msg : "successfully registered" , result})
    	
    } catch (err) {
    
	await session.abortTransaction()
	res.status(500).json({err : err.stack})
    }
    finally{
	await session.endSession()
    }
}

module.exports = handleNewUser

