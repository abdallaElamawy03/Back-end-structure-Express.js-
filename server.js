const express = require("express")
require('dotenv').config()
const app = express()
const path = require("path")
const {logger,logEvents} = require('./middleware/logger')
const errorHandler = require("./middleware/errorHandler")
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const cors = require("cors")
const PORT = process.env.PORT || 3500
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

app.use(express.json())

app.use(express.static('public'))
app.use(logger)
app.use(cookieParser())
app.use(cors(corsOptions))

console.log(process.env.Node_ENV)

app.use('/',require('./routes/root'))
app.use('/auth',require('./routes/authRoutes'))
app.use('/users',require('./routes/userRoutes'))
app.use('/notes',require('./routes/notesRoutes'))
app.all("*",(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({message:"404 not found"})
        
    }else{
        res.type('txt').send('404 not found')
    }
})
app.use(errorHandler)
// Database connection  
connectDB() // Database confoguration function 

mongoose.connection.once('open',()=>{
    console.log(`connected to mongo db`)
    app.listen(PORT,()=>console.log(`sever running on port ${PORT}`))
})
mongoose.connection.on('error',err=>{
    console.log(err)
    logEvents(`${err.no} : ${err.code} : ${err.syscall} ${err.hostname} `,"mongoerrorlog.log")
})
    // app.listen(PORT,()=>console.log(`sever running on port ${PORT}`))
    //use the upper code if you want to use the server without data base and comment the code line of mongoose and connectDB() => function
