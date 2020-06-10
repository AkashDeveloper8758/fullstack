const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Books = require('../models/book')
//GET AUTHORS
router.get("/", async (req, res) => {
  const searchOptions = {};

  try {
    if (req.query.name != null && req.query.name != "") {
      searchOptions.name = new RegExp(req.query.name, "i")
    }
    const author = await Author.find(searchOptions)
    res.render("authors/index", {
      author: author,
      queryOption: req.query,
    });
  } catch {
    res.redirect("/");
  }
})
// NEW AUTHOR
router.get("/new", (req, res) => {
  res.render("authors/new", {
    author: new Author(),
  });
});
// CREATE AUTHOR POST
router.post("/", async (req, res) => {

  try {
    const author = new Author({
      name: req.body.name,
    });
    const newAuthor = await author.save();
    res.redirect("/author");
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error while saving your data",
    });
    console.log("save error: " + err);
  }
});

// routers functions ----------------------------------
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Books.find({ author: author.id }).limit(10).exec();
    res.render('authors/show', {
      author: author,
      booksByAuthor: books,
    })
  } catch (err) {
    console.log('error while getting author books : '+err)
    res.redirect('/')
  }
})
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render("authors/edit", {
      author: author
    });
  } catch (error) {
    console.log('errror white getting author ' + error);
    res.redirect('/authors')
  }

})
router.put('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name;
    // console.log(`new author name: ${req.body}`)
    await author.save()
    res.redirect(`/author/${author.id}`)
    // res.redirect("author")
  } catch (err) {
    if (author == null) {
      res.redirect('/')
    }
    else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error while saving your data",
      });
      console.log("error: " + err);
    }
  }
})
router.delete('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/author')
  } catch (err) {
    console.log('error while deleting:' + err)
    if (author == null)
      res.redirect('/')
    else res.redirect('/author/' + author.id)
  }
})

module.exports = router;
