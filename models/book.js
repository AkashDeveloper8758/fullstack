const mongoose = require('mongoose')
const path = require('path')
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
    coverImage:{
        type:Buffer,
        required:true
    },
    coverImagetype:{
        type:String,
        required:true
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
    if(this.coverImage != null && this.coverImagetype != null){
        const imageSrc =  `data:${this.coverImagetype};charset=utf-8;base64,${this.coverImage.toString('base64')}`
        return imageSrc
    }else{
        console.log('condition fails of parsing buffer')
    }
})
module.exports = mongoose.model('Book',bookSchema)
