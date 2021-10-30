const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { check, validationResult} = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();
const port = 3000;


// Load the database
// Bring in models
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

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));


// Middleware
// Express Session Middleware
app.use(session({
  secret: "Keyboard cat",
  resave: true,
  saveUninitialized: true
}));
// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});


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

// Route Files
let articles = require("./routes/articles");
let users = require("./routes/users");
app.use("/articles", articles);
app.use("/users", users);


// Start
app.listen(3000, function(){
  console.log(`Server started on port ${port}`);
});
