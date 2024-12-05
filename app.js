if(process.env.NODE_ENV !="production"){
    require("dotenv").config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
let ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);
let path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodoverride = require("method-override");
app.use(methodoverride("_method"));
const expressError = require("./utils/expressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const user=require("./models/user.js");
const listing=require("./models/listing");
const Mongo_url="mongodb://127.0.0.1:27017/wanderlust"

const dbUrl=process.env.ATLASDB_URL;

main().then((res) => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_url);
}

const store=MongoStore.create({
    mongoUrl:Mongo_url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE");
})

const sessionoptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/listings/category",async (req,res)=>{
    let {category}=req.query;
    console.log(category);
    let listings=await listing.find({category:category});
    if(! listings){
        req.flash("error","no listing under this category");
      return  res.redirect("/listings");
    }
   res.render("listing/location.ejs",{listings});
})

app.get("/listings/country",async (req,res)=>{
    let{location}={...req.query.listings};
let listings=await listing.find({location:location});
if(!listings){
    req.flash("error","no match found");
   return res.redirect("/listings");
}
res.render("listing/location.ejs",{listings});
})
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);



// rest of non existing routes
app.all("*", (req, res, next) => {
    next(new expressError(400, "page not found"));
});

// error handling middleware
app.use((err, req, res, next) => {
    let { statuscode = 400, message = "something went wrong" } = err;
    res.status(statuscode).render("error.ejs", { message });
});

app.listen(3000, () => {
    console.log("I am listening");
});
