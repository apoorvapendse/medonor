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
    res.render("login.ejs",{message:"WELCOME TO MEDONOR!!!"});
})

app.get("/home",(req,res)=>{
    res.render("home.ejs");
})

app.get("/about",(req,res)=>{
    res.render("about.ejs");
})
app.get("/register",(req,res)=>{
    res.render("register.ejs",{message:"WELCOME TO MEDONOR!!!"});
})
app.get("/login",(req,res)=>{
    res.render("login.ejs",{message:"Welcome back!"})
})

app.post("/register",async (req,res)=>{
    const{name,email,password} = req.body;
    const check = await Users.findOne({email:email});
    if(check!=null)
    {
        res.render("login.ejs",{message:"account already exists, please login"})
        return;
    }


    Users.create({
        name:name,
        email:email,
        password:password
    }).then(()=>{
        console.log("user added with name:",name);
    })
})

app.post("/login",async (req,res)=>{
   const {email,password} = req.body;
   const checkUser = await Users.findOne({email});
   console.log(checkUser);
   if(!checkUser){
    res.render("register.ejs",{message:"please register first before logging in"});
   }
   else{
    if(checkUser.password ===password)
    {

        res.redirect("/home");
    }
    else{
        res.render("login.ejs",{message:"invalid password!"});
    }
   }

    
})

app.listen(4000,()=>{
    console.log("server is up")
})