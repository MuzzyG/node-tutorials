const express = require("express");
const router = express.Router();
const { check, validationResult} = require("express-validator");

// Bring in Article model
let Article = require("../models/article");


// Add article
router.get("/add", function(req, res){
  res.render("add_article", {
    title:"Add article"
  });
});

// Get Single Article
router.get("/:id", function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render("article", {
      article:article
    });
  });
});

// Load Edit Form
router.get("/edit/:id", function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render("edit_article", {
      title:"Edit Article",
      article:article
    });
  });
});

router.post("/add", [
  check("title", "Title must not be empty").isLength({ min: 1 }),
  check("author", "Author must not be empty").isLength({ min: 1 }),
  check("body", "Body must not be empty").isLength({ min: 1 })
  ], (req, res) => {

  //Get errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash("success","Article Added");
        res.redirect("/");
      }
    });
  }
});

router.post("/edit/:id", function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash("success","Article Updated");
      res.redirect("/");
    }
  });
});

// Delete Article
router.delete("/:id", function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send("Success");
  });
});

module.exports = router;
