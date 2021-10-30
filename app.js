const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

//Bring in models
let Article = require("./models/article");
// Connect to db
mongoose.connect("mongodb://localhost/nodekb");
let db = mongoose.connection;

// Check connection
db.once("open", function(){
  console.log("Connected to MongoDB")
});

// Check for DB errors
db.on("error", function(err){
  console.log(err);
});

// Load Pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// body parser stuff
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));


// Routes
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
    res.render("index", {
      title:"Articles",
      articles: articles
    });
  }
  });
});

app.get("/articles/add", function(req, res){
  res.render("add_article", {
    title:"Add article"
  });
});

// Get Single Article
app.get("/article/:id", function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render("article", {
      article:article
    });
  });
});

// Load Edit Form
app.get("/article/edit/:id", function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render("edit_article", {
      title:"Edit Article",
      article:article
    });
  });
});

app.post("/articles/add", function(req, res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});

app.post("/articles/edit/:id", function(req, res){
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
      res.redirect("/");
    }
  });
});

// Delete Article
app.delete("/article/:id", function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send("Success");
  });
});


// Start
app.listen(3000, function(){
  console.log(`Server started on port ${port}`);
});
