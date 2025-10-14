const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {createHmac , randomBytes} = require('crypto') 


const userSchema = new Schema({
    fullName : {required : true , type : String},
    email : {required : true , type : String , unique : true},
    password : {required : true , type : String},
    salt : String,
    profileImageUrl: {type : String , default : '/images/user.png'},
    role : {type : String , enum : ["USER" , "ADMIN"] , default : "USER"},
    refreshToken :String 
}, {timestamps : true})

// this middleware is only called when call either model.save() or model.create()

userSchema.pre('save' , function(next){ // always be sure to not use the arrow operation here
    const user = this
    if(!user.isModified('password')) return next() // save can be called say while changing the fullName or the profileImage, not every change is a password change
    
    const salt = randomBytes(16).toString()

    const hashedPassword = createHmac('sha256' , salt).update(user.password).digest('hex')
    
    this.salt = salt
    this.password = hashedPassword

    next() // continues to normal flow 

    // i.e. is ran model.save() it run this middleware first and then saves it to mongodb and then continues program flow.
})

userSchema.static('verifyUser', async function(email , password){
    const user = this
    const foundUser = await user.findOne({email})
    const emailError = new Error()
    emailError.name = `such email doesn't exist`
    if(!foundUser) throw emailError 
    const salt = foundUser.salt
    const checkPassword = createHmac('sha256', salt).update(password).digest('hex')

    const passwordError = new Error()
    passwordError.name = `incorrect password entered` 
    if(checkPassword !== foundUser.password) throw passwordError 

    return {fullName : foundUser.fullName, email : foundUser.email , password : foundUser.password , profileImageUrl :foundUser.profileImageUrl}
})

module.exports = mongoose.model('user' , userSchema)

