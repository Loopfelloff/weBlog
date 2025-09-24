require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const cookie_parser = require("cookie-parser")
const corsOptions = require("./config/corsOption")
const connectDB = require("./config/database")
const port = process.env.PORT || 5000
const mongoose = require("mongoose")

connectDB()
app.use(cookie_parser()) // make sure this is the highest of all
app.use(cors(corsOptions))
app.use(express.json())


mongoose.connection.once("open", ()=>{
    console.log("connected to mongoDB")
    app.listen(port , ()=>{
	console.log("the server is listening at port : " , port)
    })
})


