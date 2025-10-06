const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')

const loginHandler = async (req , res , next)=>{

    try {
	if(!req.body?.email ||  req.body?.email.trim() === '') return res.render('login', {
	    local : {
		err : 'Error status : 400 , missing email header'
	    }
	})
	if(!req.body?.password || req.body?.password.trim() === '') return res.render('login', {
	    local : {
		err : 'Error status : 400 , missing password header'
	    }
	})

	const {email , password} = req.body

	const foundUser = await User.findOne({email})

	const result = await User.verifyUser(email , password)
    
	const payload = {
	    fullName : foundUser.fullName,
	    email : foundUser.email,
	    password : foundUser.password,
	    profileImageUrl : foundUser.profileImageUrl
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

	return res.render('home' , {local:{msg : 'successfully logged in' , result}})	

    } catch (err) {
	console.log(err.stack)	
	req.renderIssue = 'login'
	next(err)

    }

}

module.exports = {loginHandler}
