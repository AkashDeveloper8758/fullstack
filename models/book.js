const mongoose = require('mongoose')
const path = require('path')
const bookCoverBasePath = 'uploads/bookCover'
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    publishDate:{
        type:Date,
        required:true
    },
    pageCount:{
        type:Number,
        required:true
    },
    coverImageName:{
        type:String,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Author'
    }
})
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/',bookCoverBasePath,this.coverImageName)
    }
})
module.exports = mongoose.model('Book',bookSchema)
module.exports.bookCoverBasePath = bookCoverBasePath