import express from "express";
import path from "path";



const app = express();
app.use(express.static(path.join(path.resolve(),"public")));

app.get("/",(req,res)=>{
    res.render("defaultEntry.ejs");
})

app.listen(4000,()=>{
    console.log("server is up")
})