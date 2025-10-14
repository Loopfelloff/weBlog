const User = require('../models/userModel')
const util = require('util')
const jwt = require('jsonwebtoken')
const promiseVerify = util.promisify(jwt.verify)

const regenerateHandler = async (req, res , next)=>{
    try {
	const {refreshToken} = req.cookies 

	if(!refreshToken) return res.render('login', {local:{err :`Please login first`}})

	let foundUser= await promiseVerify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    
	let user = await User.findOne({email : foundUser.email})
    
	if(!user) return res.render('login' , {local : {err : `No such user found`}})
	
	const decoded = {
	    fullName : foundUser.fullName,
	    email : foundUser.email,
	    password : foundUser.password,
	    profileImageUrl : foundUser.profileImageUrl
	}
	
	const newAccessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET , {
		expiresIn : '30m'
	    })
	const newRefreshToken = jwt.sign(decoded, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn : '30d'
	    })
	res.cookie('accessToken' , newAccessToken , {
		httpOnly : true,
		maxAge : 30*24*60*60*1000
	    })
	res.cookie('refreshToken' , newRefreshToken, {
		httpOnly : true,
		maxAge : 30*24*60*60*1000
	    })
	
	user.refreshToken = newRefreshToken

	await user.save()

	req.user = decoded

	return next() 
 	
    } catch (error) {

	return res.render('login' , {local : {err : `Please login first`}})
    	
    }
}

module.exports = {regenerateHandler}
