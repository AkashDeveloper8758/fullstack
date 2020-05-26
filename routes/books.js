const express = require("express");
const router = express.Router();
const Books = require("../models/book");
const Author = require("../models/author");
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const uploadPath = path.join('public', Books.bookCoverBasePath)
const imagesMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        console.log('file under type : '+imagesMimeTypes.includes(file.mimetype))
        callback(null, imagesMimeTypes.includes(file.mimetype))
    }
})

//GET BOOKS
router.get("/", async (req, res) => {
    let query = Books.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title',new RegExp(req.query.title,'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate',req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render('books/index',{
            books:books,
            queryOption: req.query
        })
    }catch{
        res.redirect('/')
    }
})
// NEW BOOK
router.get("/new", async (req, res) => {
    console.log('add book page called')
     renderNewPage(res,new Books())
});
// CREATE BOOK POST
router.post("/", upload.single('bookCover'), async (req, res) => {

    const fileName = req.file != null?req.file.filename :null;
    console.log(`file : ${fileName}`)


    const book = new Books({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName:fileName,
        author: req.body.author
    })
    try{
        const newBook = await book.save()
        res.redirect('/books')
    }catch(error) {
        console.log('error occred !! ________________--')
        console.error(error)
        if(book.coverImageName != null)
        removeBookCover(book.coverImageName)

        renderNewPage(res,book,true)
    }
});
async function renderNewPage(res,books,hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: books
        }
        if(hasError){
            params.errorMessage = 'custom message: Error while creating book '
        }
         res.render('books/new', params)
    } catch (error){
        console.log('error while loading add book page: '+error)
        res.redirect('/books')
    }
}
function removeBookCover(file){
    fs.unlink(path.join(uploadPath,file),err=>{
        console.log(err)
    })
}
module.exports = router;
