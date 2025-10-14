const JWTStrategy = require('passport-jwt').Strategy
const passport = require('passport')
const User = require('../models/userModel')

let cookieExtractor = (req)=>{
    let accessToken = null

    if(req?.cookies)
	{
	accessToken = req.cookies['accessToken']
    }

    return accessToken
} // my custome cookie Extractor function. 

let option = {
     jwtFromRequest : cookieExtractor ,
    secretOrKey : process.env.ACCESS_TOKEN_SECRET
} // this option is to be sent as the argument while instansializing the JWTStrategy

passport.use(new JWTStrategy(option , async (payload, cb)=>{
    try {
	
	const foundUser = await User.findOne({email : payload?.email})
	const toSend= {
	    fullName : foundUser.fullName,
	    email : foundUser.email,
	    password : foundUser.password,
	    profileImageUrl : foundUser.profileImageUrl
	}
	if(foundUser) return cb(null , toSend) // 
	return cb(null ,false)
    } catch (error) {
	return cb(error)    	
    }
}))

