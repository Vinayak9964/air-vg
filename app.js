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
//index route
app.get("/listings",async(req,res)=>{
  const alllistings = await Listing.find({});
  res.render("listing/index.ejs",{alllistings})
});
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
app.post("/listings",async(req,res)=>{
  const newlisting = new Listing( req.body.listing);
  await newlisting.save();
  console.log(newlisting);
  res.redirect("/listings")
  
})
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs",{listing});
});

//update route
app.put("/listings/:id",async(req,res)=>{
  const {id} = req.params;
  const Listings = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id",async(req,res)=>{
  const {id} = req.params;
  listdelete = await Listing.findByIdAndDelete(id);
  console.log(listdelete);
  res.redirect("/listings");

})
app.listen("3000",(req,res)=>{
    console.log("port is running");
})