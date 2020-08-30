const express = require("express");
const router = express.Router();
const Books = require("../models/book");
const Author = require("../models/author");
const path = require('path');
const { render } = require("ejs");
const imagesMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']


//GET BOOKS
router.get("/", async (req, res) => {
    let query = Books.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            queryOption: req.query
        })
    } catch{
        res.redirect('/')
    }
})
// NEW BOOK
router.get("/new", async (req, res) => {
    console.log('add book page called')
    renderFormPage(res, new Books(), 'new')
});
// SHOW BOOK
router.get('/:id', async (req, res) => {
    try {
        const book = await Books.findById(req.params.id).populate('author').exec();
        res.render('books/show', { book: book })
    } catch{
        req.redirect('/')
    }
})
// EDIT BOOK 
router.get("/:id/edit", async (req, res) => {
    try {
        var book = await Books.findById(req.params.id)
        renderFormPage(res, book, 'edit')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});
// CREATE BOOK POST
router.post("/", async (req, res) => {

    const book = new Books({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        author: req.body.author
    })
    saveCover(book, req.body.bookCover)
    try {
        const newBook = await book.save()
        res.redirect('/books')
    } catch (error) {
        renderFormPage(res, book, 'new', true)
    }
});
router.put("/:id", async (req, res) => {
    let book;
    try {
        book = Books.findById(req.params.id)
        book.title = req.body.title
        book.description = req.body.description
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.author = req.body.author
        if(book.coverImage != null && book.coverImage != ''){
            saveCover(book,req.body.cover)
        }
        await book.save()
        res.redirect('/books/'+book.id)
    } catch (error) {
        console.log(error)
        if(book != null)
        renderFormPage(req,book,'edit',true)
        else res.render('/')
    }
});
//render new page
async function renderFormPage(res, books, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: books
        }
        if (hasError) {
            params.errorMessage = 'custom message: Error while creating book '
        }
        res.render(`books/${form}`, params)
    } catch (error) {
        console.log('error while loading add book page: ' + error)
        res.redirect('/books')
    }
}

function saveCover(book, coverEncoded) {
    console.log('book is : ' + book)
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imagesMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImagetype = cover.type
    }
}
module.exports = router;
