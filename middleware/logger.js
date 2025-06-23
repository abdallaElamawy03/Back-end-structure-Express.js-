const{format} = require("date-fns")
const {v4:uuid} = require("uuid")
const fsPromises = require("fs").promises
const fs = require("fs")
const path = require("path")
const logEvents = async (message , logFileName)=>{
    const dateTime = `${format(new Date(),'ddMMyyyy\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs'))

        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logFileName),logItem)

    }catch(err){
        console.log(err)

    }    
}
const logger = (req,res,next)=>{
    logEvents(`method :  ${req.method}, req : ${req.url}, headers.origin: ${req.headers.origin}`,'reqlog.log')
    console.log(`${req.method} ${req.path}`)
    next()

}
module.exports = {logEvents,logger}