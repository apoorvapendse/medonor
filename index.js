import express, { urlencoded } from "express";
import path from "path";
import mongoose from "mongoose";


const app = express();
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017",{
    dbName:"Medonor"
}).then(()=>console.log("database connected")).catch((e)=>{console.log(e)})

const userSchema = new mongoose.Schema({
name:String,
email:String,
password:String
})

const Users = mongoose.model("users",userSchema);




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
app.post("/login",async (req,res)=>{
   const {email,password} = req.body;
   const checkUser = await Users.findOne({email});
   console.log(checkUser);
   if(!checkUser){
    res.redirect("/register");
   }
   else{
    if(checkUser.password ===password)
    {

        res.redirect("/home");
    }
    else{
        console.log("wrong password")
    }
   }

    
})

app.get("/register",(req,res)=>{
    res.render("register.ejs");
})
