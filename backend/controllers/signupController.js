const User = require('../models/userModel.js')

const formValidation = function(username, password , email){
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // the first one is for email
    
    const isEmailValid = regex.test(email)

    regex = /^(?=.*\d)(?=.*\W).{8}$/ 

    const isPasswordValid = regex.test(password)

    return {isUsernameValid: (username.length >= 8) ? true : false , isPasswordValid , isEmailValid}
}

const signupHandler = async (req ,res ,next)=>{

    try {
	if(!req.body?.email ||  req.body?.email.trim() === '') return res.render('signup', {
	    local : {
		err : 'Error status : 400 , missing email header'
	    }
	})
	if(!req.body?.password || req.body?.password.trim() === '') return res.render('signup', {
	    local : {
		err : 'Error status : 400 , missing password header'
	    }
	})


	if(!req.body?.username || req.body?.username.trim() === '') return res.render('signup', {
	    local : {
		err : 'Error status : 400 , missing username header'
	    }
	})

	const {username , email , password} = req.body

	const {isUsernameValid, isPasswordValid , isEmailValid} = formValidation(username, password , email)

	if(!isUsernameValid) return res.render('signup', {
	    local : {
		err : `Error status 400 , username must be of length 8 or more`
	    }
	} )
	if(!isEmailValid) return res.render('signup', {
	    local : {
		err : `Error status 400 , email must be of correct format`
	    }
	} )
	if(!isPasswordValid) return res.render('signup', {
	    local : {
		err : `Error status 400 , password must be of length 8 with one character and one number`
	    }
	} )
	
	const foundUser = await User.findOne({email}).exec()

	if(foundUser) return res.render('signup', {
	    local : {
		err : 'Error status : 409, same email already exists'
	    }
	})
	
	const result = await User.create({
	    fullName : username,
	    email : email,
	    password : password
	})

	console.log(result)

	return res.render('signup', {
	    local : {
		msg  : 'username successfully registered , now login and start blogging'
	    }
	})
	
    	
    } catch (err) {		
	req.renderIssue = 'signup'
	next(err)
    }

}

module.exports = {signupHandler}
