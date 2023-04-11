import express from "express";
import path from "path";
import mongoose from "mongoose";


const app = express();
app.use(express.static(path.join(path.resolve(),"public")));

mongoose.connect("mongodb://localhost:27017",{
    dbName:"Medonor"
}).then(()=>console.log("database connected")).catch((e)=>{console.log(e)})



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