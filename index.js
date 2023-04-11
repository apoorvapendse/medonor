import express from "express";
import path from "path";



const app = express();
app.use(express.static(path.join(path.resolve(),"public")));

app.get("/",(req,res)=>{
    res.render("defaultEntry.ejs");
})

app.get("/home",(req,res)=>{
    res.render("home.ejs");
})

app.get("/about",(req,res)=>{
    res.render("about.ejs");
})
app.listen(4000,()=>{
    console.log("server is up")
})