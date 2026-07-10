const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await  mongoose.connect(dbUrl);
}

main()
.then((res)=> console.log("Radhe Radhe connected to DB"))
.catch((err)=>console.log("Radhe Radhe err"));


// app.get("/",(req,res)=>{
//     res.send("Radhe Rdahe");
// })

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 36000,
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}
 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");  
    res.locals.error = req.flash("error");  
    res.locals.currUser = req.user;
    next();
})

// app.get("/demoUser", async(req, res)=>{
//     let user = new User({
//         email:"rkv@gmail.com",
//         username:process.env.SECRET
//     })

//     let newUser = await User.register(user,"radha");
//     res.send(newUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// --------------- Middlewares ----------------

app.use((req,res,next)=>{
    throw new ExpressError(404,"Radhe Radhe Page Not Found!");
})
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Radhe Radhe Page Not Found!"));
// })

app.use((err, req, res, next)=>{
    let {statusCode=500, message="radhaVallabh Shri Harivansh"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("Radhe Radhe connected to server");
})