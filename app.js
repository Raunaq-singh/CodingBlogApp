var express    = require("express"),
    app        = express(),
    mongoose   = require("mongoose"),
    moverride  = require("method-override"),
    bodyparser = require("body-parser");
//App Config
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(moverride("_method"));
//DB Config
var blogSchema = new mongoose.Schema({
    title  : String,
    image  : String,
    body   : String,
    created: {type:Date, default:Date.now()}
})
var Blog = mongoose.model("Blog",blogSchema);
//RESTful Routes
//Index Route
app.get("/", function(req, res){
    res.redirect("/blogs");
})
app.get("/blogs", function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    })
})
//New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
})
//Create Route
app.post("/blogs", function(req, res){
    var newBlog=req.body.blog;
    Blog.create(newBlog, function(err, newblog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})
//Show Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {found:foundBlog});
        }
    })
})
//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{found:foundBlog});
        }
    })
})
//Update Route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})
//Delete Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
})