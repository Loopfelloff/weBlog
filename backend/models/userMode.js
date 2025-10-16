const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({

    email : {type : String , require:true},
    password : {type : String , require: true},
    username : {type : String , require: true},
    no_post : {type : Number , default: 0},
    no_replies : {type : Number , default : 0},
    refreshToken : String
})

module.exports = mongoose.model("User", userSchema)
