const User = require('../models/userModel.js')

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

	const result = await User.verifyUser(email , password)

	console.log(result)
	
	return res.render('home' , {local:{msg : 'successfully logged in' , result}})	

    } catch (err) {
	console.log(err.stack)	
	req.renderIssue = 'login'
	next(err)

    }

}

module.exports = {loginHandler}
