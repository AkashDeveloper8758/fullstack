const mongoose = require('mongoose')
const Books = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
authorSchema.pre('remove', function (next) {
    if (Books.find({ author: this.id },(err,book)=>{
        if(err)
        next(err)
        else if(book.length > 0){
            next(new Error('Some book of this author already exist , we can\'t delete this author'))
        }else{
            next()
        }
    })) { 
        
    }
})
module.exports = mongoose.model('Author', authorSchema)