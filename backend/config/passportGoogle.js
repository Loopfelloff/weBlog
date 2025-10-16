const GoogleStrategy = require('passport-google-oauth2').Strategy
const passport = require('passport')

passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : "http://localhost:5000/auth/redirect/google",
    passReqToCallback   : true
}, 
    function(request , accessToken , refreshToken , profile, cb)
	{
	console.log(`Request  : ${request}`)
	console.log(`accessToken : ${accessToken}`)
	console.log(`refreshToken : ${refreshToken}`)
	console.log(`refreshToken : ${JSON.stringify(profile)}`)
	cb(null , profile)
    }
))
