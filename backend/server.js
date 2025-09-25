require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const cookie_parser = require("cookie-parser")
const corsOptions = require("./config/corsOption")
const connectDB = require("./config/database")
const port = process.env.PORT || 5000
const mongoose = require("mongoose")
const userHandler = require("./routers/registerRoute")
const loginHandler = require("./routers/loginRoute")

connectDB()
app.use(cookie_parser()) // make sure this is the highest of all
app.use(cors(corsOptions))
app.use(express.json())

app.use("/register" , userHandler)
app.use("/login" , loginHandler)

//error handling middleware
app.use(async (err , req, res , next)=>{
    const session = req.session
    await session.abortTransaction()
    return res.status(500).json({err : `Internal server error : ${err.stack}`})
})


mongoose.connection.once("open", ()=>{
    console.log("connected to mongoDB")
    app.listen(port , ()=>{
	console.log("the server is listening at port : " , port)
    })
})


