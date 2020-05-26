const express = require("express");
const router = express.Router();
const Author = require("../models/author");
//GET AUTHORS
router.get("/", async (req, res) => {
  const searchOptions = {};
  if (req.query.name != null && req.query.name != "") {
    searchOptions.name = new RegExp(req.query.name, "i")
  }
  try {
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
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect("author");
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error while saving your data",
    });
    console.log("error: " + err);
  }
});

module.exports = router;
