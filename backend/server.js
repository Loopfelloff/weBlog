require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const cookie_parser = require("cookie-parser")
const corsOptions = require("./config/corsOption")
const connectDB = require("./config/database")
const port = process.env.PORT || 5000
const mongoose = require("mongoose")

const signupHandler = require('./routers/signupRouter')
const loginHandler = require('./routers/loginRouter')

connectDB()
app.use(cookie_parser()) // make sure this is the highest of all
app.use(cors(corsOptions))
app.use(express.json())
app.set('view engine' , "ejs")
app.set("views" , "./views")
app.use(express.static("./public"))
app.use(express.urlencoded({extended : false}))

// the one below is for all of the top level naviagtions
app.get('/' , (req, res)=>{
    return res.render('home' , {local : {}}) 
})
app.get('/:page' ,(req, res)=>{
    return res.render(req.params.page , {local : {}})
})

// this one is for normal routing

app.use('/register' , signupHandler)
app.use('/authentication' , loginHandler)

//error handling middleware
app.use(async (err , req, res , next)=>{
    const session = req.session
    const renderIssue = req.renderIssue 
    if(session) await session.abortTransaction()
    if(renderIssue) return res.render(renderIssue , {local : {err : `${err.name}`}})
    return res.status(500).json({err : `Internal server error : ${err.stack}`})
})


mongoose.connection.once("open", ()=>{
    console.log("connected to mongoDB")
    app.listen(port , ()=>{
	console.log("the server is listening at port : " , port)
    })
})


