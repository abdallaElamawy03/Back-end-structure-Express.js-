const rateLimit = require('express-rate-limit')
const {logEvents} = require("./logger")
const loginLimiter = rateLimit({
    windowsMs:60*1000,
    max:5,
    message:{
        message : `too many login attempts from this IP , please try again after a 60 second pause`
    },
    handler:(req,res,next,options)=>{
        logEvents(`too many requests : ${options.message.message}\t ${req.method}\t ${req.url}\t ${req.headers.origin}`,'errlog.log')
        res.status(options.statusCode).send(options.message)

    },
    standardHeaders : true , 
    legacyHeaders : false , 
})

module.exports = loginLimiter