var mongoose = require('mongoose')
var url="mongodb://localhost:27017/meanbatch23"
mongoose.connect(url)
var db=mongoose.connection
console.log("Successfully connected to mongodb")
module.exports=db