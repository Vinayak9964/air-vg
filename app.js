const express = require("express");
const app = express();
const path = require("path");
const methodeOverride = require("method-override");
app.use(methodeOverride("_method"));
app.use(express.urlencoded({extended:true}));
const ejs = require("ejs")
const mongoose = require("mongoose");
const Listing = require("./model/listing.js");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
 
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

const validateListing = (req,res,next)=>{
  let{error} = listingSchema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el) => el.message.join(","));
    throw new ExpressError(400,error);

  }else{
    next();
  }
}


//index route
app.get("/listings",wrapAsync(async(req,res)=>{
  const alllistings = await Listing.find({});
  res.render("listing/index.ejs",{alllistings})
}));
//new route
app.get("/listings/new",(req,res)=>{
  res.render("listing/new.ejs");
})
//show route
app.get("/listings/:id",async(req,res)=>{
   const {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listing/show.ejs",{listing});
}); 
app.post("/listings",validateListing,
  wrapAsync(async(req,res,next)=>{
  const newlisting = new Listing( req.body.listing);
  await newlisting.save();
  console.log(newlisting);
  res.redirect("/listings")
  
})
);
//edit route
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",validateListing,
  wrapAsync(async(req,res)=>{
  const {id} = req.params;
  const Listings = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id", async(req,res)=>{
  const {id} = req.params;
  listdelete = await Listing.findByIdAndDelete(id);
  console.log(listdelete);
  res.redirect("/listings");

});
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