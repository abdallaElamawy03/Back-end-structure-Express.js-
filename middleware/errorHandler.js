const {logEvents} = require("./logger")
const errorHandler=(err,req,res,next)=>{
    logEvents(`${err.name}:${err.message} ${req.method} ${req.url} ${req.headers.origin} `,`error.log`)
    console.log(err.stack)
    

    const status = res.statusCode ? res.statusCode : 500 // server error
    res.status(status)
    res.json({message:err.message,isError:true})
    

}
module.exports=errorHandler