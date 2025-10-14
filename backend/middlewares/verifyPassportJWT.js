const {regenerateHandler} = require('../controllers/regenerateController')
const passport = require('passport')
require('../config/passport')

const verifyPassportJWT = function(req ,res , next){
    const verification = passport.authenticate('jwt' , {session : false} , (err , user , info)=>{
	    if(err) next(err)
	    
	    if(!user){
		return regenerateHandler(req ,res ,next)
	    }

	    req.user = user

	    return next()
	})

    verification(req ,res, next)
}

module.exports = verifyPassportJWT 


