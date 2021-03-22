const mongoose = require ('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    comments: {
        type: Array
    },
    commentCount: {
        type:Number,
        default: 0
    }
})


const Book = mongoose.model('books', bookSchema)

module.exports = Book