const User = require('../models/userModel')
const util = require('util')
const jwt = require('jsonwebtoken')
const promiseVerify = util.promisify(jwt.verify)

const verifyJWT = async (req, res ,next) =>{

    const {cookies} = req

    if(!cookies) return res.render('login', {local:{err : `Please login first`}})
    
    const {accessToken} = req.cookies 

    if(!accessToken) return res.render('login', {local:{err :`Please login first`}})

    let decoded

    try{


	decoded = await promiseVerify(accessToken , process.env.ACCESS_TOKEN_SECRET)

	req.user  = {...decoded}

	return next()

	
    }
    catch(err)
    {
	if(err.name === 'TokenExpiredError')
	    {
	    try
	    {
		console.log('access token has expired after 30min')
		const {refreshToken}  = req.cookies 
		decoded = await promiseVerify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

		const payload = { 
	    fullName : decoded.fullName,
		    email : decoded.email,
		    password : decoded.password,
		    profileImageUrl : decoded.profileImageUrl
		}

		const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET , {
			expiresIn : '30m'
		    })
		const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
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

		const foundUser = await User.findOne({email : decoded.email})
		
		foundUser.refreshToken = newRefreshToken

		req.user = {...payload}

		await foundUser.save()

		return next()

	    }
	    catch(error)
	    {
		return res.render('login' , {local : {err : `Please login first`}})
	    }

 	}
	console.log(err.stack)
	return res.render('login' , {local:{err : `${err.name}`}})
    }
    

}

module.exports = {verifyJWT}
