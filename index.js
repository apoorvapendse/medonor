import express, { urlencoded } from "express";
import path from "path";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";


const app = express();

app.use(session({
    cookie: { maxAge: 3000000 },
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

mongoose.connect("mongodb://localhost:27017", {
    dbName: "Medonor"
}).then(() => console.log("database connected")).catch((e) => { console.log(e) })

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
app.get("/register", (req, res) => {
    res.render("register.ejs", { message: "WELCOME TO MEDONOR!!!" });
})
app.get("/login", (req, res) => {
    res.render("login.ejs", { message: "Welcome back!" })
})
app.get("/users/all", async (req, res) => {
    const users = await Users.find();
    res.json(users);

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
        req.session.usedID = newUser.id;
        res.cookie("token", newUser.id, {
            httpOnly: true,
            expires: new Date(Date.now() + 300000)

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
            res.cookie("token", checkUser.id, {
                httpOnly: true,
                expires: new Date(Date.now() + 30000000)

            })
            res.redirect("/home");
        }
        else {
            res.render("login.ejs", { message: "invalid password!" });
        }
    }


})

app.post("/donate", async (req, res) => {
    const currentUserID = req.cookies.token;
    // console.log("current user id",currentUserID)
    try {
        console.log(req.body)
        const currentUser = await Users.updateOne({ _id: currentUserID }, {
            $push: {
                
                products:new Object(req.body)
            }
        })
    } catch (error) {
        console.log(error)
    }


  

    res.render("donate.ejs",{message:"Donation registered Successfully!"})

})

app.listen(4000, () => {
    console.log("server is up")
})