const express = require("express");
const app = express();
const port = 3000;

app.get('/', function(req, res){
  res.send("Hello world");
});

app.get("/cheese", function(req, res){
  res.send("Cathedral City");
});

app.listen(3000, function(){
  console.log(`Server started on port ${port}`);
});
