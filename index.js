import express, { urlencoded } from "express";
import path from "path";
import bcrypt from "bcrypt"
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import jwt_decode from 'jwt-decode'
import sendMail from './sendMail/sendMail.js'


dotenv.config()
// ykeuueijasldkfjlkasdjflkajskljdfklsajd

const app = express();
//This is a commit from my phone
app.use(session({
    cookie: { maxAge: 300000000 },
    secret: "some secret",
    saveUninitialized: false
}))
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "ejs");
const checkAuthentication = async (req, res, next) => {
    const token = req.cookies.token;
    // console.log(req.cookies.token)
    console.log("token is:", token)
    if (!token) {
        res.render("login.ejs", { message: "welcome to medonor" })
    }
    else {
        req.session.user_id = token;
        next();
    }

}

const connectDB = async()=>{

    mongoose.set('strictQuery',false);
const conn =      await mongoose.connect(process.env.MONGO_URI, {
        dbName: "Medonor"
    }).then(() => console.log("database connected")).catch((e) => { console.log(e) })
}

//we use mongoose as a module to make use of MongoDB in nodejs
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    donor: Boolean,
    products: Array,

})

const Users = mongoose.model("users", userSchema);




app.get("/", checkAuthentication, ((req, res) => {
    res.render("home.ejs")
}))
app.get("/donate", (req, res) => {
    if(!req.cookies.token)
    {
        res.render("login.ejs",{message:"please login first"})
    }
    res.render("donate.ejs",{message:""});
})


app.get("/home", (req, res) => {
    if(!req.cookies.token)
    {
        res.render("login.ejs",{message:"please login first"})
    }
    res.render("home.ejs");
})

app.get("/about", (req, res) => {
    if(!req.cookies.token)
    {
        res.render("login.ejs",{message:"please login first"})
    }
    res.render("about.ejs");
})
app.get("/feedback", (req, res) => {
    if(!req.cookies.token)
    {
        res.render("login.ejs",{message:"please login first"})
    }
    res.render("feedback.ejs");
})
app.get("/register", (req, res) => {
    res.render("register.ejs", { message: "WELCOME TO MEDONOR!!!" });
})
app.get("/login", (req, res) => {
    res.render("login.ejs", { message: "Welcome back!" })
})
app.get("/donateinfo",async(req,res)=>{
    let jwtValue = req.cookies.token;
    // console.log(jwtValue);
    let decodedToken = jwt_decode(jwtValue);
    const {id} = decodedToken;
    //using the id from the encrypted cookie, we will now fetch users data from DB
    
    let currentUser = await Users.findById(id);
    // console.log(currentUser)
    res.json(currentUser.products);
    

    


})

app.get("/users/all", async (req, res) => {
    const users = await Users.find();
    res.json(users);

})
app.get("/contact", (req, res) => {
    if(!req.cookies.token)
    {
        res.render("login.ejs",{message:"please login first"})
    }
    res.render("contact.ejs");
})

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const check = await Users.findOne({ email: email });
    if (check != null) {
        res.render("login.ejs", { message: "account already exists, please login" })
        return;
    }


    Users.create({
        name: name,
        email: email,
        password: hashedPassword,
        donor: true,
        products: []
    }).then(async () => {
        console.log("user added with name:", name);
        const newUser = await Users.findOne({ email })
        

        const token = jwt.sign({id:newUser.id},'apoorva')
        console.log("jwt token is:",token);
        res.cookie("token", token, {
            httpOnly: false,
            expires: new Date(Date.now() + 30000000)

        })


        
        res.render("home.ejs");

        // res.redirect("/home");

    })
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const checkUser = await Users.findOne({ email });
    //    console.log(checkUser);
    if (!checkUser) {
        res.render("register.ejs", { message: "please register first before logging in" });
    }
    else {
        if (await bcrypt.compare(req.body.password, checkUser.password)) {
            // req.session.user_id = checkUser.id; 
            // console.log("id of logged in user is",req.session.user_id);
            const token = jwt.sign({id:checkUser.id},'apoorva')
            console.log("jwt token is:",token);
            res.cookie("token", token, {
                httpOnly: false,
                expires: new Date(Date.now() + 30000000)

            })
            res.redirect("/home");
        }
        else {
            res.render("login.ejs", { message: "invalid password!" });
        }
    }


})

app.post("/logout",(async(req,res)=>{
   try {
    
       await res.clearCookie("token")
   } catch (error) {
    console.log(error);
   }
   res.render("login.ejs",{message:'Welcome'})

}))

app.post("/donate", async (req, res) => {
    const currentUserID = jwt.verify(req.cookies.token,'apoorva') ;
    console.log("current id:",currentUserID);
    // console.log("current user id",currentUserID)
    try {
        console.log(req.body)
        const currentUser = await Users.updateOne({ _id: currentUserID.id }, {
            $push: {
                
                products:new Object(req.body)
            }
        })
    } catch (error) {
        console.log(error)
    }
    
    const user = jwt_decode(req.cookies.token);
    let currentUser = await Users.findById(user.id);
    // console.log("to be mailed:",currentUser);
    if(currentUser){
        console.log(req.body);
        sendMail(currentUser.email,req.body.equipment,req.body.quality);
        
    }

    res.render("donate.ejs",{message:"Donation registered Successfully!"})

})

connectDB().then(()=>{
    app.listen(4000, () => {
        console.log("server is up")
    })
})
