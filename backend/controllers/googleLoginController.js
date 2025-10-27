const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')

const googleLoginHandler = async (req , res , next)=>{

    try {
    
	const {email, displayName, picture } = req.user

	let foundUser = await User.findOne({email}).exec()	

	if(!foundUser) {
	foundUser = await User.create({
		fullName : displayName,
		email : email,
		profileImageUrl : picture
	    })
	}
	
	const payload = {
	    fullName : displayName,
	    email :email, 
	    profileImageUrl : picture
	}

	const accessToken = jwt.sign(payload , process.env.ACCESS_TOKEN_SECRET , {
	    expiresIn  : '30m'
	})
	const refreshToken = jwt.sign(payload , process.env.REFRESH_TOKEN_SECRET , {
	    expiresIn  : '30d'
	})


	res.cookie('accessToken' , accessToken, {
	    httpOnly : true, 
	    maxAge : 30*24*60*60*1000
	})
	res.cookie('refreshToken' , refreshToken, {
	    httpOnly : true, 
	    maxAge : 30*24*60*60*1000
	})

	foundUser.refreshToken = refreshToken

	await foundUser.save() // this and the previous line ensures


	return res.redirect('/')

    } catch (err) {
	console.log(err.stack)	
	req.renderIssue = 'login'
	next(err)

    }

}

module.exports = {googleLoginHandler}


