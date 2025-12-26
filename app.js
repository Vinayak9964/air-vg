const express = require("express");
const app = express();
const path = require("path");
const methodeOverride = require("method-override");
app.use(methodeOverride("_method"));
app.use(express.urlencoded({extended:true}));
const ejs = require("ejs")
const mongoose = require("mongoose");

const Review = require("./model/review.js");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Listing = require("./model/listing.js");
const sessions = require("express-session");
const flash = require("connect-flash");


const ejsmate = require("ejs-mate");
const review = require("./routes/reviews.js");
const listings = require("./routes/listing.js");
app.engine("ejs",ejsmate);
app.set("views engine","views");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

mong_url = "mongodb://127.0.0.1:27017/airvg";
 
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(mong_url);
  console.log("database conected")
}
app.get("/",(req,res)=>{
    res.send("its working");
});

//cookies and sessions
 app.use(sessions({
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()+1000*60*60*24*7,
      maxAge:1000*60*60*24*7,
      httpOnly:true
    }
 }));
 app.use(flash());
 //flah middleware
 app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
 })



app.use("/listings",listings);
app.use("/listings/:id/review",review);



//error handling midleware
 app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen("3000",(req,res)=>{
    console.log("port is running");
})